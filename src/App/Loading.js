import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';
import { CheckDate } from 'Utils/DateCheck';
//import Notifications from 'Utils/Notifications';
import { Character } from 'Interface/Components';

/**
 * @typedef {keyof import('Managers/LangManager').Lang['app']['loading-error-message']} ErrorMessages
 * @typedef {import('Interface/FlowEngine/back').FlowEnginePublicClass} FlowEnginePublicClass
 */

/**
 * Intialisation of all data
 * @param {FlowEnginePublicClass} fe Used to change the page
 * @param {() => void} nextStep Used to change the icon
 * @param {() => void} nextPage Used to go to the next page
 * @param {(error: ErrorMessages) => void} callbackError Used to display an error message
 */
async function Initialisation(fe, nextStep, nextPage, callbackError) {
    const time_start = new Date().getTime();

    // Loading: Settings
    await user.settings.Load();

    // Connect to the server TCP
    const t1 = performance.now();
    const status = await user.server2.Connect();
    const t2 = performance.now();
    user.interface.console?.AddLog('info', `Connect to the server TCP in ${t2 - t1}ms (${status})`);

    if (status === 'not-connected') {
        fe.ChangePage('waitinternet', {
            storeInHistory: false,
            transition: 'fromBottom'
        });
        return;
    } else if (status === 'error') {
        fe.ChangePage('display', {
            args: {
                icon: 'close-filled',
                // TODO: Message "Server not reachable"
                text: '[Connection to the server failed]',
                button: 'Retry',
                action: () => {
                    fe.ChangePage('loading', { storeInHistory: false });
                }
            },
            storeInHistory: false
        });
        return;
    }

    await user.settings.Load();
    const email = user.settings.email;
    console.log('Email:', email, 'Connected:', user.settings.IsLogged());
    if (email === '') {
        fe.ChangePage('login', {
            storeInHistory: false,
            transition: 'fromBottom'
        });
        return;
    } else if (!user.settings.IsLogged()) {
        fe.ChangePage('waitmail', { storeInHistory: false });
        return;
    }

    //await user.server2.LoadInternalData();

    //await user.server.Ping(); // TODO: Set timeout ?

    //const online = user.server.IsConnected();
    //if (!online) {
    //    user.interface.console?.AddLog('warn', 'Not connected to the server, data will be saved locally only');
    //}

    nextStep();

    // Loading: Internal data
    //if (online) {
    //    await dataManager.OnlineLoad(user);
    //} else {
    //    await dataManager.LocalLoad(user);
    //}

    // Check if internal data are loaded
    // const dataLoaded = dataManager.DataAreLoaded();
    // if (!dataLoaded) {
    //     user.interface.console?.AddLog('error', 'Internal data not loaded');
    //     // Not connected to the server (TODO: and not logged) => Wait internet to login
    //     if (!user.server2.IsConnected()) {
    //         fe.ChangePage('waitinternet', {
    //             storeInHistory: false,
    //             transition: 'fromBottom'
    //         });
    //     }

    //     // Connected to the server but not logged => Login page
    //     else if (!user.server2.IsLogged()) {
    //         // TODO: Disconnect correctly & show popup ?
    //         fe.ChangePage('login', {
    //             storeInHistory: false,
    //             transition: 'fromBottom'
    //         });
    //     }

    //     // Connected & logged but internal data not loaded => Error message
    //     else {
    //         callbackError('internaldata-not-loaded');
    //     }
    //     return;
    // }

    // Show onboarding if not watched
    const showOnboard = !user.settings.onboardingWatched;
    if (showOnboard) {
        //fe.ChangePage('onboarding', { storeInHistory: false });
        //return;
    }

    // Redirection: Login page (or wait internet page)
    //const email = user.settings.email;
    // if (email === '') {
    //     if (user.server2.IsConnected()) {
    //         fe.ChangePage('login', { storeInHistory: false });
    //         return;
    //     } else {
    //         fe.ChangePage('waitinternet', { storeInHistory: false });
    //         return;
    //     }
    // }

    console.log('User connected:', email);
    return;

    // Loading: User data
    await user.LocalLoad();

    // Connect account if online
    if (user.server2.IsLogged() && user.server.token === '') {
        const { status } = await user.server.Connect(email);

        // Too many devices
        if (status === 'limitDevice') {
            const title = langManager.curr['login']['alert-deviceRemoved-title'];
            const message = langManager.curr['login']['alert-deviceRemoved-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                cancelable: false,
                callback: () => user.Disconnect(true)
            });
            return;
        }

        // Mail not confirmed
        else if (status === 'newDevice' || status === 'waitMailConfirmation') {
            while (
                !fe.ChangePage('waitmail', {
                    args: { email: email },
                    storeInHistory: false
                })
            ) {
                await Sleep(100);
            }
            return;
        }

        // Account is deleted
        else if (status === 'free') {
            const title = langManager.curr['login']['alert-deletedaccount-title'];
            const message = langManager.curr['login']['alert-deletedaccount-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message },
                callback: () => user.Disconnect(true),
                cancelable: false
            });
            return;
        }
    }

    nextStep();

    // Loading: User data online
    if (user.server2.IsLogged()) {
        await user.OnlineSave();
        await user.OnlineLoad();
    }

    // Check if user data are loaded
    if (user.informations.username.Get() === '') {
        user.interface.console?.AddLog('error', 'User data not loaded');
        callbackError('userdata-not-loaded');
        return;
    }

    // Load quests
    user.quests.dailyquest.Init();

    // Loading: User character
    user.character = new Character(
        'player',
        user.inventory.avatar.sexe,
        user.inventory.avatar.skin,
        user.inventory.avatar.skinColor
    );
    user.character.SetEquipment(user.inventory.GetEquippedItemsID());
    user.interface.userHeader?.ShowAvatar(true);

    // Loading: Notifications
    //await Notifications.DisableAll().then(() => {
    //    if (user.settings.morningNotifications) {
    //        return Notifications.Morning.Enable();
    //    }
    //    if (user.settings.eveningNotifications) {
    //        return Notifications.Evening.Enable();
    //    }
    //    return;
    //});

    // Check if ads are available
    if (user.informations.adRemaining === 0) {
        user.interface.console?.AddLog('info', 'No more ads available');
    }

    // Load admob
    //await user.consent.ShowTrackingPopup().then(user.admob.LoadAds);

    // Render default pages
    //await user.interface.LoadDefaultPages();

    nextStep();
    //await Sleep(500);

    CheckDate();
    user.StartTimers();

    // Maintenance message
    if (user.server.status === 'maintenance') {
        const lang = langManager.curr['home'];
        const title = lang['alert-maintenance-title'];
        const message = lang['alert-maintenance-message'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message },
            cancelable: false
        });
    }

    // End of initialisation
    const time_end = new Date().getTime();
    const time_text = `Initialisation done in ${time_end - time_start}ms`;
    console.log(time_text);
    user.interface.console?.AddLog('info', time_text);
    user.appIsLoaded = true;

    nextPage();
}

export { Initialisation };

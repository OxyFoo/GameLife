import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';
import { CheckDate } from 'Utils/DateCheck';
import Notifications from 'Utils/Notifications';
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

    // Ping request
    await user.server.Ping(); // TODO: Set timeout ?
    if (user.server.IsConnected() === false) {
        user.interface.console.AddLog('warn', 'Ping request failed, retrying...');
        await user.server.Ping();
    }

    const online = user.server.IsConnected();
    if (!online) {
        user.interface.console.AddLog('warn', 'Not connected to the server, data will be saved locally only');
    }

    nextStep();

    // Loading: Internal data
    if (online) {
        await dataManager.OnlineLoad(user);
    } else {
        await dataManager.LocalLoad(user);
    }

    // Check if internal data are loaded
    const dataLoaded = dataManager.DataAreLoaded();
    if (!dataLoaded) {
        user.interface.console.AddLog('error', 'Internal data not loaded');
        if (!online) {
            fe.ChangePage('waitinternet', {
                storeInHistory: false,
                transition: 'fromBottom'
            });
        } else {
            callbackError('internaldata-not-loaded');
        }
        return;
    }

    // Show onboarding if not watched
    const showOnboard = !user.settings.onboardingWatched;
    if (showOnboard) {
        fe.ChangePage('onboarding', { storeInHistory: false });
        return;
    }

    // Redirection: Login page (or wait internet page)
    const email = user.settings.email;
    if (email === '') {
        if (online) {
            fe.ChangePage('login', { storeInHistory: false });
            return;
        } else {
            fe.ChangePage('waitinternet', { storeInHistory: false });
            return;
        }
    }

    // Redirection: Wait mail page (if needed)
    const connected = user.settings.connected;
    if (!connected) {
        fe.ChangePage('waitmail', { storeInHistory: false });
        return;
    }

    // Loading: User data
    await user.LocalLoad();

    // Connect account if online
    if (online && user.server.token === '') {
        const { status } = await user.server.Connect(email);

        // Too many devices
        if (status === 'limitDevice') {
            const title = langManager.curr['login']['alert-deviceRemoved-title'];
            const message = langManager.curr['login']['alert-deviceRemoved-message'];
            user.interface.popup.OpenT({
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
            user.interface.popup.OpenT({
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
    if (online) {
        await user.OnlineSave();
        await user.OnlineLoad();
    }

    // Check if user data are loaded
    if (user.informations.username.Get() === '') {
        user.interface.console.AddLog('error', 'User data not loaded');
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
    //user.interface.header.ShowAvatar(true);

    // Loading: Notifications
    Notifications.DisableAll().then(() => {
        if (user.settings.morningNotifications) {
            return Notifications.Morning.Enable();
        }
        if (user.settings.eveningNotifications) {
            return Notifications.Evening.Enable();
        }
        return;
    });

    // Check if ads are available
    if (user.informations.adRemaining === 0) {
        user.interface.console.AddLog('info', 'No more ads available');
    }

    // Connect to the server TCP
    user.tcp.Connect();

    // Load admob
    //await user.consent.ShowTrackingPopup()
    //.then(user.admob.LoadAds);

    // Render default pages
    //await user.interface.LoadDefaultPages();

    nextStep();
    await Sleep(500);

    CheckDate();
    user.StartTimers();

    // Maintenance message
    if (user.server.status === 'maintenance') {
        const lang = langManager.curr['home'];
        const title = lang['alert-maintenance-title'];
        const message = lang['alert-maintenance-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message },
            cancelable: false
        });
    }

    // End of initialisation
    const time_end = new Date().getTime();
    const time_text = `Initialisation done in ${time_end - time_start}ms`;
    console.log(time_text);
    user.interface.console.AddLog('info', time_text);
    user.appIsLoaded = true;

    nextPage();
}

export { Initialisation };

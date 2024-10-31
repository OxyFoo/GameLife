import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';
import { CheckDate } from 'Utils/DateCheck';
//import Notifications from 'Utils/Notifications';
//import { Character } from 'Interface/Components';

/**
 * @typedef {Awaited<ReturnType<import('Managers/DataManager').User['server2']['Login']>>} LoginResponse
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

    // TODO: Remove
    user.interface.console?.Enable();

    // Load important data
    await user.settings.Load();
    const email = user.settings.email;

    // Connect to the server TCP
    const t1 = performance.now();
    const status = await user.server2.Connect();
    const t2 = performance.now();
    user.interface.console?.AddLog('info', `Connect to the server in ${Round(t2 - t1, 2)}ms (${status})`);

    // An error occured, go to the error page
    if (status === 'error') {
        fe.ChangePage('display', {
            args: {
                icon: 'close-filled',
                // TODO: Message "Server not reachable" with error code ?
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

    // Not connected to the server and user not logged, go to the wait internet page
    if (!user.server2.IsLogged()) {
        if (status === 'not-connected' || status === 'maintenance' || !user.server2.IsConnected()) {
            fe.ChangePage('waitinternet', {
                storeInHistory: false,
                transition: 'fromBottom'
            });
            return;
        }
    }

    // Connection to the server is OK but not logged, go to the login page
    if (email === '') {
        fe.ChangePage('login', { storeInHistory: false });
        return;
    }

    /**
     * User is logged, check if the token is still valid (online)
     * @type {LoginResponse} Default: false (offline)
     */
    let loggedState = false;
    if (user.server2.IsConnected() && email !== '') {
        loggedState = await user.server2.Login(email);
    }

    // Try to login but not yet confirmed, go to the wait mail confirmation page
    if (loggedState === 'waitMailConfirmation') {
        fe.ChangePage('waitmail', { storeInHistory: false });
        return;
    }

    // Account not found, probably deleted, go to the login page
    else if (loggedState === 'free') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langManager.curr['login']['alert-deletedaccount-title'],
                message: langManager.curr['login']['alert-deletedaccount-message']
            },
            callback: () => user.Disconnect(true),
            cancelable: false
        });
        return;
    }

    // An error occured, go to the error page
    else if (loggedState === 'error' || loggedState === 'mailNotSent') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langManager.curr['login']['alert-error-title'],
                message: langManager.curr['login']['alert-error-message'] // TODO: Add error code ?
            },
            callback: () => user.Disconnect(true),
            cancelable: false
        });
        return;
    }

    // Offline mode
    else if (loggedState === false) {
        user.interface.console?.AddLog('warn', 'Not connected to the server, data will be saved locally only');
    }

    // 1. User is connected
    nextStep();

    // Load local user data
    await user.LocalLoad();

    //await dataManager.LocalLoad(user);

    // Load app data
    await dataManager.LocalLoad(user);
    if (user.server2.IsAuthenticated()) {
        const _t = performance.now();
        await dataManager.OnlineLoad(user);
        console.log(
            'Online load in',
            performance.now() - _t,
            'ms for',
            dataManager.achievements.Get().length +
                dataManager.skills.Get().skills.length +
                dataManager.skills.Get().skillIcons.length +
                dataManager.skills.Get().skillCategories.length +
                dataManager.titles.Get().length +
                dataManager.quotes.Get().length +
                dataManager.contributors.Get().length,
            'items'
        );
        await dataManager.LocalSave(user);
    }

    // Check if app data are loaded
    const dataLoaded = dataManager.DataAreLoaded();
    if (!dataLoaded) {
        user.interface.console?.AddLog('error', 'App data not loaded');
        callbackError('appdata-not-loaded');
        return;
    }

    // Show onboarding if not watched
    const showOnboard = !user.settings.onboardingWatched;
    if (showOnboard) {
        //fe.ChangePage('onboarding', { storeInHistory: false });
        //return;
    }

    nextStep();

    console.log('Connected with email:', email);
    // return;

    // Loading: User data online
    if (user.server2.IsLogged()) {
        await user.SaveOnline();
        await user.LoadOnline();
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
    // user.character = new Character(
    //     'player',
    //     user.inventory.avatar.sexe,
    //     user.inventory.avatar.skin,
    //     user.inventory.avatar.skinColor
    // );
    // user.character.SetEquipment(user.inventory.GetEquippedItemsID());
    // user.interface.userHeader?.ShowAvatar(true);

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

    // Load admob
    await user.consent.ShowTrackingPopup();

    // Load ads
    const ads = dataManager.ads.Get();
    user.ads.LoadAds(ads);

    // Check if ads are available
    if (user.informations.adRemaining === 0) {
        user.interface.console?.AddLog('warn', 'No more ads available');
    }

    // Render default pages
    //await user.interface.LoadDefaultPages();

    nextStep();

    const dateIsOK = await CheckDate(user.server2.tcp);
    if (dateIsOK === false) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: langManager.curr['home']['alert-dateerror-title'],
                message: langManager.curr['home']['alert-dateerror-text']
            },
            callback: RNExitApp.exitApp,
            cancelable: false
        });
        return;
    }

    user.StartTimers();

    // End of initialisation
    const time_end = new Date().getTime();
    const time_text = `Initialisation done in ${time_end - time_start}ms`;
    console.log(time_text);
    user.interface.console?.AddLog('info', time_text);
    user.appIsLoaded = true;

    // Maintenance message
    if (status === 'maintenance') {
        const lang = langManager.curr['home'];

        await new Promise((resolve) => {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-maintenance-title'],
                    message: lang['alert-maintenance-message']
                },
                callback: resolve
            });
        });
    }

    nextPage();
}

export { Initialisation };

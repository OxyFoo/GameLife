import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Round } from 'Utils/Functions';
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
    if (__DEV__) {
        await user.interface.console?.Enable();
    }

    user.interface.console?.AddLog('info', 'Initialisation...');

    const time_start = performance.now();

    // Load important data
    await user.settings.IndependentLoad();
    const email = user.settings.email;

    // Apply theme variation
    themeManager.SetVariant(user.settings.themeVariant);

    // Connect to the server TCP
    const isNewUser = user.settings.email === '';
    const time_connect_start = performance.now();
    const status = await user.server2.Connect(isNewUser);
    const time_connect_end = performance.now();
    const time_connect = Round(time_connect_end - time_connect_start, 2);
    user.interface.console?.AddLog('info', `Connect to the server in ${time_connect}ms (${status})`);

    // An error occured, go to the error page
    if (status === 'error') {
        const lang = langManager.curr['login'];
        fe.ChangePage('display', {
            args: {
                icon: 'close-filled',
                text: lang['error-connection'],
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

    // Show onboarding if not watched
    const showOnboard = !user.settings.onboardingWatched;
    if (showOnboard) {
        fe.ChangePage('onboarding', { storeInHistory: false });
        return;
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
        const lang = langManager.curr['login'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-deletedaccount-title'],
                message: lang['alert-deletedaccount-message']
            },
            callback: async () => {
                await user.Clear();
                user.interface.ChangePage('login', { storeInHistory: false });
            },
            cancelable: false
        });
        return;
    }

    // An error occured, go to the error page
    else if (loggedState === 'error' || loggedState === 'deviceLimitReached' || loggedState === 'mailNotSent') {
        const lang = langManager.curr['login'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-error-title'],
                message: lang['alert-error-message'].replace('{}', loggedState)
            },
            callback: async () => {
                await user.Clear();
                user.interface.ChangePage('login', { storeInHistory: false });
            },
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
    const t1 = performance.now();

    // Load local user data
    await user.LoadLocal();

    // Load app data
    await dataManager.LoadLocal(user);
    if (user.server2.IsAuthenticated()) {
        const time_appdata_start = performance.now();
        await dataManager.LoadOnline(user);
        const time_appdata_end = performance.now();
        const time_appdata = Round(time_appdata_end - time_appdata_start, 2);
        user.interface.console?.AddLog('info', `Online load in ${time_appdata} ms for ${dataManager.CountAll()} items`);
        await dataManager.SaveLocal(user);
    }

    // Check if app data are loaded
    const dataLoaded = dataManager.DataAreLoaded();
    if (!dataLoaded) {
        user.interface.console?.AddLog('error', 'App data not loaded');
        callbackError('appdata-not-loaded');
        return;
    }

    nextStep();
    const t2 = performance.now();

    // Loading: User data online
    if (user.server2.IsLogged()) {
        await user.SaveOnline();
        await user.LoadOnline();
        await user.SaveLocal();
    }

    // Check if user data are loaded
    if (user.informations.username.Get() === '') {
        user.interface.console?.AddLog('error', 'User data not loaded');
        callbackError('userdata-not-loaded');
        return;
    }

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
    //await user.consent.ShowTrackingPopup();

    // TODO: Fix ads
    // Load ads
    //const ads = dataManager.ads.Get();
    //user.ads.LoadAds(ads);

    // Check if ads are available
    if (user.informations.adRemaining === 0) {
        //user.interface.console?.AddLog('warn', 'No more ads available');
    }

    // Render default pages
    //await user.interface.LoadDefaultPages();

    nextStep();

    user.StartTimers();

    // End of initialisation
    const time_end = performance.now();
    const time_total = Round(time_end - time_start);
    const time_ratio_1 = Round((t1 - time_start) / time_total, 2);
    const time_ratio_2 = Round((t2 - t1) / time_total, 2);
    const time_ratio_3 = Round((time_end - t2) / time_total, 2);
    const time_text = `Initialisation done in ${time_total}ms (${time_ratio_1}/${time_ratio_2}/${time_ratio_3})`;
    console.log(time_text);
    user.interface.console?.AddLog('info', time_text);
    user.appIsLoaded = true;
    user.server2.tcp.Send({ action: 'send-statistics', stats: { LoadingTimeMs: time_total }, anonymous: false });

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

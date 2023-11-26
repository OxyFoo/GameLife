import user from 'Managers/UserManager'
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Sleep } from 'Utils/Functions';
import { CheckDate } from 'Utils/DateCheck';
import Notifications from 'Utils/Notifications';
import { Character } from 'Interface/Components';

/**
 * Intialisation of all data
 * @param {Function} nextStep Used to change the icon
 */
async function Initialisation(nextStep) {
    // Loading: Settings
    await user.settings.Load();

    // Ping request
    await user.server.Ping();
    const online = user.server.online;
    if (!online) {
        user.interface.console.AddLog('warn', 'Not connected to the server, data will be saved locally only');
    }

    // Set background theme
    user.interface.SetTheme(themeManager.selectedTheme === 'Main' ? 0 : 1);

    nextStep();

    // Loading: Internal data
    if (online) await dataManager.OnlineLoad(user);
    else        await dataManager.LocalLoad(user);

    // Check if internal data are loaded
    const dataLoaded = dataManager.DataAreLoaded();
    if (!dataLoaded) {
        user.interface.console.AddLog('error', 'Internal data not loaded');
        if (user.server.status === 'maintenance') {
            user.interface.ChangePage('waitinternet', { force: 1 }, true);
        }
        return;
    }

    // Show onboarding if not watched
    const showOnboard = !user.settings.onboardingWatched;
    if (showOnboard) {
        user.interface.ChangePage('onboarding', undefined, true);
        return;
    }

    // Redirection: Login page (or wait internet page)
    const email = user.settings.email;
    if (email === '') {
        if (online) {
            user.interface.ChangePage('login', undefined, true);
            return;
        } else {
            user.interface.ChangePage('waitinternet', undefined, true);
            return;
        }
    }

    // Redirection: Wait mail page (if needed)
    const connected = user.settings.connected;
    if (!connected) {
        user.interface.ChangePage('waitmail', undefined, true);
        return;
    }

    // Loading: User data
    await user.LocalLoad();

    // Connect account if online
    if (online && user.server.token === '') {
        const email = user.settings.email;
        const { status } = await user.server.Connect(email);

        // Too many devices
        if (status === 'limitDevice') {
            const title = langManager.curr['login']['alert-deviceRemoved-title'];
            const text = langManager.curr['login']['alert-deviceRemoved-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], () => user.Disconnect(true), false);
            return;
        }

        // Mail not confirmed
        else if (status === 'newDevice' || status === 'waitMailConfirmation') {
            while (!user.interface.ChangePage('waitmail', { email: email }, true)) await Sleep(100);
            return;
        }

        // Account is deleted
        else if (status === 'free') {
            const title = langManager.curr['login']['alert-deletedaccount-title'];
            const text = langManager.curr['login']['alert-deletedaccount-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], () => user.Disconnect(true), false);
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
        return;
    }

    // Loading: User character
    user.character = new Character(
        'player',
        user.inventory.avatar.sexe,
        user.inventory.avatar.skin,
        user.inventory.avatar.skinColor
    );
    user.character.SetEquipment(user.inventory.GetEquippedItemsID());
    user.interface.header.ShowAvatar(true);

    // Loading: Notifications
    const time_start_notification = new Date().getTime();
    Notifications.DisableAll().then(() => {
        if (user.settings.morningNotifications) {
            return Notifications.Morning.Enable();
        }
        if (user.settings.eveningNotifications) {
            return Notifications.Evening.Enable();
        }
    }).then(() => {
        const time_end_notification = new Date().getTime();
        const time_delta_notification = time_end_notification - time_start_notification;
        user.interface.console.AddLog('info', `Notifications loaded in ${time_delta_notification}ms`);
    });

    // Check if ads are available
    if (user.informations.adRemaining === 0) {
        user.interface.console.AddLog('info', 'No more ads available');
    }

    // Load admob
    const time_start_admob = new Date().getTime();
    user.consent.ShowTrackingPopup()
    .then(user.admob.LoadAds)
    .then(() => {
        const time_end_admob = new Date().getTime();
        const time_delta_admob = time_end_admob - time_start_admob;
        user.interface.console.AddLog('info', `Admob loaded in ${time_delta_admob}ms`);
    });

    // Render default pages
    await user.interface.LoadDefaultPages();

    nextStep();
    await Sleep(500);

    // Start tutorial
    let homeProps = {};
    if (!user.settings.tutoFinished) {
        homeProps = { tuto: 1 };
        user.settings.tutoFinished = true;
        user.settings.Save();
    }

    CheckDate();
    user.StartTimers();

    // Maintenance message
    if (user.server.status === 'maintenance') {
        const lang = langManager.curr['home'];
        const title = lang['alert-maintenance-title'];
        const text = lang['alert-maintenance-text'];
        user.interface.popup.Open('ok', [ title, text ], undefined, false);
    }

    if (user.activities.currentActivity === null) {
        while (!user.interface.ChangePage('home', homeProps)) await Sleep(100);
    } else {
        while (!user.interface.ChangePage('activitytimer', undefined, true)) await Sleep(100);
    }
}

export { Initialisation };

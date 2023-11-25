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
    await user.settings.Load();

    // Ping request
    await user.server.Ping();
    const online = user.server.online;
    if (!online) {
        user.interface.console.AddLog('warn', 'Not connected to the server, data will be saved locally only');
    }

    // Set background theme
    user.interface.SetTheme(themeManager.selectedTheme === 'Dark' ? 0 : 1);

    nextStep();

    // Loading : Internal data
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

    const email = user.settings.email;
    const connected = user.settings.connected;
    const showOnboard = !user.settings.onboardingWatched;

    // Show onboarding if not watched
    if (showOnboard) {
        user.interface.ChangePage('onboarding', undefined, true);
        return;
    }

    // Redirect to login page (or wait internet/mail page)
    if (email === '') {
        if (online) user.interface.ChangePage('login', undefined, true);
        else        user.interface.ChangePage('waitinternet', undefined, true);
    } else {
        if (connected) LoadData(nextStep);
        else           user.interface.ChangePage('waitmail', undefined, true);
    }
}

async function LoadData(nextStep) {
    const online = user.server.online;
    await user.LocalLoad();

    // Connect account if online
    if (online && user.server.token === '') {
        const email = user.settings.email;
        const { status } = await user.server.Connect(email);
        if (status === 'limitDevice') {
            // Too many devices
            const title = langManager.curr['login']['alert-deviceRemoved-title'];
            const text = langManager.curr['login']['alert-deviceRemoved-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], () => user.Disconnect(true), false);
            return;
        } else if (status === 'newDevice' || status === 'waitMailConfirmation') {
            // Mail not confirmed
            while (!user.interface.ChangePage('waitmail', { email: email }, true)) await Sleep(100);
            return;
        } else if (status === 'free') {
            // Account is deleted
            const title = langManager.curr['login']['alert-deletedaccount-title'];
            const text = langManager.curr['login']['alert-deletedaccount-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], () => user.Disconnect(true), false);
            return;
        }
    }

    nextStep();

    // Loading : User data
    if (online) {
        await user.OnlineSave();
        await user.OnlineLoad();
        // local save
    }

    // Check if user data are loaded
    if (user.informations.username.Get() === '') {
        user.interface.console.AddLog('error', 'User data not loaded');
        return;
    }

    // Load user character
    user.character = new Character(
        'player',
        user.inventory.avatar.sexe,
        user.inventory.avatar.skin,
        user.inventory.avatar.skinColor
    );
    user.character.SetEquipment(user.inventory.GetEquippedItemsID());
    user.interface.header.ShowAvatar(true);

    // Loading : Notifications
    const start_time = new Date().getTime();
    Notifications.DisableAll().then(() => {
        if (user.settings.morningNotifications) {
            return Notifications.Morning.Enable();
        }
        if (user.settings.eveningNotifications) {
            return Notifications.Evening.Enable();
        }
    }).then(() => {
        const end_time = new Date().getTime();
        const time = end_time - start_time;
        user.interface.console.AddLog('info', `Notifications loaded in ${time}ms`);
    });

    // Check if ads are available
    if (user.informations.adRemaining === 0) {
        user.interface.console.AddLog('info', 'No more ads available');
    }

    // Load admob
    const time_start2 = new Date().getTime();
    user.consent.ShowTrackingPopup()
    .then(user.admob.LoadAds)
    .then(() => {
        const time_end2 = new Date().getTime();
        const time2 = time_end2 - time_start2;
        user.interface.console.AddLog('info', `Admob loaded in ${time2}ms`);
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
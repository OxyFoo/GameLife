import user from 'Managers/UserManager'
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Character } from 'Interface/Components';
import { Sleep } from 'Utils/Functions';
import Notifications from 'Utils/Notifications';

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

    const dataLoaded = dataManager.DataAreLoaded();
    if (!dataLoaded) {
        user.interface.console.AddLog('error', 'Internal data not loaded');
        return;
    }

    const email = user.settings.email;
    const connected = user.settings.connected;
    const showOnboard = !user.settings.onboardingWatched;
    if (showOnboard) {
        user.interface.ChangePage('onboarding', undefined, true);
        return;
    }
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

    // Connect
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
    await Notifications.DisableAll();
    if (user.settings.morningNotifications) {
        await Notifications.Morning.Enable();
    }
    if (user.settings.eveningNotifications) {
        await Notifications.Evening.Enable();
    }

    // Load ads
    if (user.informations.adRemaining === 0) {
        user.interface.console.AddLog('info', 'No more ads available');
    }
    await user.admob.ShowTrackingPopup();
    user.admob.LoadAds();
    user.StartTimers();

    await user.interface.LoadDefaultPages();
    await Sleep(500);
    nextStep();
    await Sleep(1500);

    if (user.activities.currentActivity === null) {
        while (!user.interface.ChangePage('home')) await Sleep(100);
    } else {
        while (!user.interface.ChangePage('activitytimer', undefined, true)) await Sleep(100);
    }
}

export { Initialisation };
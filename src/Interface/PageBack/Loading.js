import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Sleep } from '../../Utils/Functions';
import { PlayStartSound } from '../../Utils/Sound';
import { DisableMorningNotifications, EnableMorningNotifications } from '../../Utils/Notifications';

class BackLoading extends React.Component {
    state = {
        icon: 0
    }

    componentDidMount() {
        this.initialisation();
    }

    nextStep = () => this.setState({ icon: this.state.icon + 1 });
    onToucheStart = (event) => { this.startY = event.nativeEvent.pageY; }
    onToucheEnd = (event) => { if (event.nativeEvent.pageY - this.startY < -200) user.interface.EnableConsole(); }

    async initialisation() {
        await user.settings.Load();

        // Play sound
        if (user.settings.startAudio) {
            PlayStartSound();
        }

        // Ping request
        await user.server.Ping();
        const online = user.server.online;
        if (!online) {
            user.interface.console.AddLog('warn', 'Not connected to the server, data will be saved locally only');
        }

        // Set background theme
        user.interface.SetTheme(themeManager.selectedTheme === 'Dark' ? 0 : 1);

        this.nextStep();

        // Loading : Internal data
        if (online) await dataManager.OnlineLoad();
        else        await dataManager.LocalLoad();

        const dataLoaded = dataManager.DataAreLoaded();
        if (!dataLoaded) {
            user.interface.console.AddLog('error', 'Internal data not loaded');
            return;
        }

        const email = user.settings.email;
        const connected = user.settings.connected;
        const showOnboard = !user.settings.onboardingWatched;
        if (showOnboard) {
            user.interface.ChangePage('onboarding');
            return;
        }
        if (email === '') {
            if (online) user.interface.ChangePage('login', undefined, true);
            else             user.interface.ChangePage('waitinternet', undefined, true);
        } else {
            if (connected) this.loadData();
            else           user.interface.ChangePage('waitmail', undefined, true);
        }
    }

    async loadData() {
        const online = user.server.online;
        await user.LocalLoad();

        // Connect
        if (user.server.token === '') {
            const email = user.settings.email;
            const { status } = await user.server.Connect(email);
            if (status === 'newDevice' || status === 'waitMailConfirmation') {
                // Mail not confirmed
                while (!user.interface.ChangePage('waitmail', { email: email }, true)) await Sleep(100);
                return;
            } else if (status === 'free') {
                // Account is deleted
                const title = langManager.curr['login']['alert-deletedaccount-title'];
                const text = langManager.curr['login']['alert-deletedaccount-text'];
                user.interface.popup.ForceOpen('ok', [ title, text ], () => user.Disconnect(false), false);
                return;
            }
        }

        this.nextStep();

        // Loading : User data
        if (online) {
            await user.OnlineSave();
            await user.OnlineLoad();
            // local save
        }
        if (user.informations.username === '') {
            user.interface.console.AddLog('error', 'User data not loaded');
            return;
        }

        // Loading : Notifications
        if (user.settings.morningNotifications) {
            await EnableMorningNotifications();
        } else {
            DisableMorningNotifications();
        }

        user.admob.LoadAds();
        //await user.admob.ShowPopup();

        this.nextStep();
        await Sleep(200);

        if (user.activities.currentActivity === null) {
            while (!user.interface.ChangePage('home')) await Sleep(100);
        } else {
            while (!user.interface.ChangePage('activitytimer', undefined, true)) await Sleep(100);
        }
    }
}

export default BackLoading;
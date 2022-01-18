import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

import { Sleep } from '../../Functions/Functions';
import { PlayStartSound } from '../../Functions/Sound';
import { DisableMorningNotifications, EnableMorningNotifications } from '../../Functions/Notifications';

class BackLoading extends React.Component {
    state = {
        icon: 0
    }

    componentDidMount() {
        this.initialisation();
        PlayStartSound();
    }

    nextStep = () => this.setState({ icon: this.state.icon + 1 });
    onToucheStart = (event) => { this.startY = event.nativeEvent.pageY; }
    onToucheEnd = (event) => { if (event.nativeEvent.pageY - this.startY < -200) user.interface.EnableConsole(); }

    async initialisation() {
        await user.settings.Load();
        await user.server.Ping();
        const online = user.server.online;
        if (!online) {
            user.AddLog('warn', 'Not connected to the server, data will be saved locally only');
        }

        this.nextStep();

        // Loading : Internal data
        if (online) await dataManager.OnlineLoad();
        else        await dataManager.LocalLoad();

        const dataLoaded = dataManager.DataAreLoaded();
        if (!dataLoaded) {
            user.AddLog('error', 'Internal data not loaded');
            return;
        }

        const email = user.settings.email;
        const connected = user.settings.connected;
        const showOnboard = !user.settings.onboardingWatched;
        if (email === '') {
            /*if (showOnboard) user.interface.ChangePage('onboarding', { 'nextPage': 'home' });
            else */if (online) user.interface.ChangePage('login', undefined, true);
            else             user.interface.ChangePage('waitinternet', undefined, true);
        } else {
            if (connected) this.loadData();
            else           user.interface.ChangePage('waitmail', undefined, true);
        }

        return;
        // TODO - Code at end of onboarding
        user.settings.onboardingWatched = true;
        user.settings.Save();
        user.interface.ChangePage(this.props.args['nextPage'], undefined, true);
    }

    async loadData() {
        const online = user.server.online;
        let success = await user.LocalLoad();

        // Connect
        if (user.server.token === '') {
            const email = user.settings.email;
            const status = await user.server.Connect(email);
            if (status === 'newDevice' || status === 'waitMailConfirmation') {
                while (!user.interface.ChangePage('waitmail', { email: email }, true)) await Sleep(100);
                return;
            }
        }

        this.nextStep();

        // Loading : User data
        if (online) {
            success &= await user.SaveUnsavedData();
            success &= await user.OnlineLoad();
        }
        if (!success) {
            user.AddLog('error', 'User data not loaded');
            return;
        }

        // Loading : Notifications
        if (user.settings.morningNotifications) {
            await EnableMorningNotifications();
        } else {
            DisableMorningNotifications();
        }

        this.nextStep();
        await Sleep(200);

        if (user.activities.currentActivity === null) {
            // TODO - home
            while (!user.interface.ChangePage('home')) await Sleep(100);
        } else {
            while (!user.interface.ChangePage('activitytimer', undefined, true)) await Sleep(100);
        }
    }
}

export default BackLoading;
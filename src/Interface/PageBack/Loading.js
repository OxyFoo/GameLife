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
        this.Initialisation();
        PlayStartSound();
    }

    async Initialisation() {
        await user.settings.Load();
        await user.server.Ping();

        this.setState({ icon: 1 });

        const email = user.settings.email;
        const online = user.server.online;
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
        // Loading : Internal data
        const online = user.server.online;
        if (online) await dataManager.OnlineLoad();
        else        await dataManager.LocalLoad();

        await user.LocalLoad();

        // TODO - Check data (if it doesn't empty)

        // Connect
        if (user.server.token === '') {
            const email = user.settings.email;
            const status = await user.server.Connect(email);
            if (status === 'newDevice' || status === 'waitMailConfirmation') {
                while (!user.interface.ChangePage('waitmail', { email: email }, true)) await Sleep(100);
                return;
            }
        }

        this.setState({ icon: 2 });

        // Loading : User data
        if (online) {
            await user.LocalLoad();
            const saved = await user.SaveUnsavedData();
            if (saved) await user.OnlineLoad();
            else console.error('SaveUnsavedData failed');
        }

        // Loading : Notifications
        /*if (user.settings.morningNotifications) {
            await EnableMorningNotifications();
        } else {
            DisableMorningNotifications();
        }*/

        this.setState({ icon: 3 }); await Sleep(200);

        if (user.activities.currentActivity === null) {
            // TODO - home
            while (!user.interface.ChangePage('home')) await Sleep(100);
        } else {
            while (!user.interface.ChangePage('activitytimer', undefined, true)) await Sleep(100);
        }
    }
}

export default BackLoading;
import * as React from 'react';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';

import { sleep } from '../../Functions/Functions';
import { PlayStartSound } from '../../Functions/Sound';
import { disableMorningNotifications, enableMorningNotifications } from '../../Functions/Notifications';

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
        if (online) await dataManager.onlineLoad();
        else        await dataManager.localLoad();
        await user.localLoad();

        // TODO - Check data (if it doesn't empty)

        // Connect
        if (user.server.token === '') {
            const email = user.settings.email;
            const status = await user.server.Connect(email);
            if (status === 'newDevice' || status === 'waitMailConfirmation') {
                while (!user.interface.ChangePage('waitmail', { email: email }, true)) await sleep(100);
                return;
            }
        }

        this.setState({ icon: 2 });

        // Loading : User data
        if (online) {
            await user.localLoad();
            const saved = await user.saveUnsavedData();
            if (saved) await user.onlineLoad();
            else console.error('saveUnsavedData failed');
        }

        // Loading : Notifications
        if (user.settings.morningNotifications) {
            await enableMorningNotifications();
        } else {
            disableMorningNotifications();
        }

        this.setState({ icon: 3 }); await sleep(200);

        if (user.activities.currentActivity === null) {
            // TODO - home
            while (!user.interface.ChangePage('home')) await sleep(100);
        } else {
            while (!user.interface.ChangePage('activitytimer', undefined, true)) await sleep(100);
        }
    }
}

export default BackLoading;
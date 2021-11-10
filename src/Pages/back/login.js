import * as React from 'react';
import { Platform } from 'react-native';

import user from '../../Managers/UserManager';
import { random, sleep } from '../../Functions/Functions';
import { enableMorningNotifications } from '../../Functions/Notifications';

class BackLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            error: false
        };
    }

    onChangeText = (newText) => {
        newText = newText.trim();
        newText = newText.substring(0, Math.min(newText.length, 320));
        this.setState({ email: newText });
    }

    onLogin = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!this.state.email.length) {
            this.setState({ error: true });
            return;
        }

        if (!reg.test(this.state.email)) {
            this.setState({ error: true });
            return;
        }

        this.loadData();
    }

    async loadData() {
        user.changePage('login');
        await sleep(200);

        // Load local user data
        await user.loadData(false);
        await sleep(random(200, 400));
        user.changePage('loading', { state: 1 }, true);

        // Load internet data (if online)
        await user.conn.AsyncRefreshAccount();
        await sleep(random(600, 800));
        user.changePage('loading', { state: 2 }, true);

        // Load internet user data (if connected)
        await user.loadInternalData();
        await user.refreshStats();
        await sleep(random(200, 400));
        user.changePage('loading', { state: 3 }, true);
        await sleep(200);

        // TODO : iOS notifications
        if (Platform.OS === "android") {
            if (user.morningNotifications) {
                enableMorningNotifications();
            }
        }
    }
}

export default BackLogin;
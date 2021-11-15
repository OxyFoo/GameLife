import * as React from 'react';
import { Platform } from 'react-native';

import user from '../../Managers/UserManager';
import { isEmail, random, sleep } from '../../Functions/Functions';
import { enableMorningNotifications } from '../../Functions/Notifications';

const MAX_EMAIL_LENGTH = 320;

class BackLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            error: false,
            signinMode: false
        };
    }

    onChangeText = (newText) => {
        newText = newText.trim();
        if (newText.length > MAX_EMAIL_LENGTH) {
            newText = newText.substring(0, 320);
        }
        this.setState({ email: newText });
    }

    onLogin = async () => {
        const { email } = this.state;
        if (!isEmail(email)) {
            this.setState({ error: true });
            return;
        }

        const status = await user.server.Connect(email);
        console.log(status);
        //this.loadData();
    }

    // TODO - Old function, remove it
    async loadData() {
        user.changePage('login');
        await sleep(200);

        // Load local user data
        await user.loadData(false);
        await sleep(random(200, 400));
        user.changePage('loading', { state: 1 }, true);

        // Load internet data (if online)
        await user.server.AsyncRefreshAccount();
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
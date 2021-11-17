import * as React from 'react';
import { Platform, Animated } from 'react-native';

import user from '../../Managers/UserManager';
import { isEmail, random, sleep } from '../../Functions/Functions';
import { OptionsAnimation } from '../../Functions/Animations';
import { enableMorningNotifications } from '../../Functions/Notifications';

const MAX_EMAIL_LENGTH = 320;
const MAX_PSEUDO_LENGTH = 32;

class BackLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            errorEmail: false,
            pseudo: '',
            errorPseudo: false,
            signinMode: false,

            animSignin: new Animated.Value(0)
        };
    }

    onChangeEmail = (newText) => {
        newText = newText.trim();
        if (newText.length > MAX_EMAIL_LENGTH) {
            newText = newText.substring(0, MAX_EMAIL_LENGTH);
        }
        this.setState({ email: newText });
    }

    onChangePseudo = (newText) => {
        newText = newText.trim();
        if (newText.length > MAX_PSEUDO_LENGTH) {
            newText = newText.substring(0, MAX_PSEUDO_LENGTH);
        }
        this.setState({ pseudo: newText });
    }

    onLogin = async () => {
        const { email } = this.state;
        if (!isEmail(email)) {
            this.setState({ error: true });
            return;
        }

        const status = await user.server.Connect(email);
        if (status === 'free') {
            this.setState({ signinMode: true });
            OptionsAnimation(this.state.animSignin, 1, 400, false).start();
        }
        console.log(status);
        //this.loadData();
    }

    onBack = () => {
        OptionsAnimation(this.state.animSignin, 0, 400, false).start();
        this.setState({ signinMode: false });
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
import * as React from 'react';
import { Animated, Linking } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { IsEmail } from '../../../Utils/String';
import { TimingAnimation } from '../../../Utils/Animations';

const MAX_EMAIL_LENGTH = 320;
const MAX_PSEUDO_LENGTH = 32;

class BackLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            signinMode: false,

            email: '',
            username: '',
            cguAccepted: false,
            errorEmail: '',
            errorUsername: '',
            errorCgu: '',

            animSignin: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this.checkConnection();
    }

    checkConnection = async () => {
        await user.server.Ping();
        if (!user.server.online) {
            user.interface.ChangePage('waitinternet');
        }
    }

    onChangeEmail = (newText) => {
        newText = newText.trim().toLowerCase();
        if (newText.length > MAX_EMAIL_LENGTH) {
            newText = newText.substring(0, MAX_EMAIL_LENGTH);
        }
        this.setState({ email: newText });
    }

    onChangeUsername = (newText) => {
        newText = newText.trim();
        if (newText.length > MAX_PSEUDO_LENGTH) {
            newText = newText.substring(0, MAX_PSEUDO_LENGTH);
        }
        this.setState({ username: newText });
    }

    onChangeCGU = () => {
        const { cguAccepted } = this.state;
        this.setState({ cguAccepted: !cguAccepted });
    }

    CGURedirect() {
        const link = 'https://google.com';
        Linking.openURL(link);
    }

    onLogin = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true });

        const { email } = this.state;
        if (!IsEmail(email)) {
            this.setState({
                loading: false,
                errorEmail: langManager.curr['login']['error-login-nonmail']
            });
            return;
        }

        if (this.state.errorEmail.length) {
            this.setState({ errorEmail: '' });
        }

        if (this.state.signinMode) {
            const success = await this.Signin();
            if (!success) this.setState({ loading: false });
        } else {
            // Login
            const { status } = await user.server.Connect(email);
            if (status === 'limitDevice') {
                // Too many devices
                const title = langManager.curr['login']['alert-limitDevice-title'];
                const text = langManager.curr['login']['alert-limitDevice-text'];
                user.interface.popup.ForceOpen('ok', [ title, text ]);
                this.setState({ loading: false });
            } else if (status === 'free') {
                this.setState({ loading: false, signinMode: true });
                TimingAnimation(this.state.animSignin, 1, 400, false).start();
            } else if (status === 'ok' || status === 'ban') {
                user.settings.email = email;
                user.settings.connected = true;
                await user.settings.Save();
                user.interface.ChangePage('loading', undefined, true);
            } else if (status === 'waitMailConfirmation' || status === 'newDevice') {
                user.settings.email = email;
                await user.settings.Save();
                user.interface.ChangePage('waitmail', { email: email }, true);
            } else if (status === 'error') {
                this.checkConnection();
                this.setState({ loading: false });
            }
        }
    }

    /**
     * Signin, return true if success (& next page loading) or false if error
     * @returns {Promise<boolean>}
     */
    async Signin() {
        if (!this.state.username.length) {
            this.setState({ errorUsername: langManager.curr['login']['error-signin-pseudoWrong'] });
            return;
        } else if (this.state.errorUsername.length) {
            this.setState({ errorUsername: '' });
        }

        if (!this.state.cguAccepted) {
            this.setState({ errorCgu: langManager.curr['login']['error-signin-disagree'] });
            return;
        } else if (this.state.errorCgu.length) {
            this.setState({ errorCgu: '' });
        }

        const { email, username } = this.state;
        const signinStatus = await user.server.Signin(email, username);

        if (signinStatus === 'limitAccount') {
            const title = langManager.curr['login']['alert-limitAccount-title'];
            const text = langManager.curr['login']['alert-limitAccount-text'];
            user.interface.popup.Open('ok', [ title, text ]);
        } else if (signinStatus === 'pseudoUsed') {
            this.setState({ errorUsername: langManager.curr['login']['error-signin-pseudoUsed'] });
        }
        else if (signinStatus === 'pseudoIncorrect') {
            this.setState({ errorUsername: langManager.curr['login']['error-signin-pseudoIncorrect'] });
        }
        else if (signinStatus === null) {
            this.setState({
                username: '',
                errorUsername: '',
                errorEmail: langManager.curr['login']['error-signin-server']
            });
            this.onBack();
        }
        else if (signinStatus === 'ok') {
            if (this.state.errorUsername.length) {
                await new Promise(resolve => this.setState({ errorUsername: '' }, resolve));
            }
            user.settings.email = email;
            await user.settings.Save();
            user.interface.ChangePage('waitmail', { email: email }, true);
            return true;
        }
        return false;
    }

    onBack = () => {
        if (this.state.signinMode) {
            TimingAnimation(this.state.animSignin, 0, 400, false).start();
            this.setState({
                signinMode: false,
                username: '',
                cguAccepted: false,
                errorUsername: '',
                errorCgu: '',
            });
        }
    }
}

export default BackLogin;
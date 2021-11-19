import * as React from 'react';
import { Animated, Linking } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { isEmail } from '../../Functions/Functions';
import { OptionsAnimation } from '../../Functions/Animations';

const MAX_EMAIL_LENGTH = 320;
const MAX_PSEUDO_LENGTH = 32;

class BackLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            signinMode: false,

            email: '',
            pseudo: '',
            cguAccepted: false,
            errorEmail: '',
            errorPseudo: '',
            errorCgu: '',

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
        if (!isEmail(email)) {
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
            await this.Signin();
        } else {
            // Login
            const status = await user.server.Connect(email);
            if (status === 'free') {
                this.setState({ signinMode: true });
                OptionsAnimation(this.state.animSignin, 1, 400, false).start();
            } else if (status === 'ok' || status === 'ban') {
                user.settings.email = email;
                user.settings.connected = true;
                await user.settings.Save();
                user.changePage('loading');
            } else if (status === 'waitMailConfirmation' || status === 'newDevice') {
                user.settings.email = email;
                await user.settings.Save();
                user.changePage('waitmail', { email: email });
            }
        }
        this.setState({ loading: false });
    }

    async Signin() {
        if (!this.state.pseudo.length) {
            this.setState({ errorPseudo: langManager.curr['login']['error-signin-pseudoWrong'] });
            return;
        } else if (this.state.errorPseudo.length) {
            this.setState({ errorPseudo: '' });
        }

        if (!this.state.cguAccepted) {
            this.setState({ errorCgu: langManager.curr['login']['error-signin-disagree'] });
            return;
        } else if (this.state.errorCgu.length) {
            this.setState({ errorCgu: '' });
        }

        const { email, pseudo } = this.state;
        const signinStatus = await user.server.Signin(email, pseudo);

        if (signinStatus === 'pseudoUsed') {
            this.setState({ errorPseudo: langManager.curr['login']['error-signin-pseudoUsed'] });
        }

        else if (signinStatus === null) {
            this.setState({
                pseudo: '',
                errorPseudo: '',
                errorEmail: langManager.curr['login']['error-signin-server']
            });
            this.onBack();
        }

        else if (signinStatus === 'ok') {
            if (this.state.errorPseudo.length) {
                this.setState({ errorPseudo: '' });
            }
            user.settings.email = email;
            await user.settings.Save();
            user.changePage('waitmail', { email: email });
        }
    }

    onBack = () => {
        if (this.state.signinMode) {
            OptionsAnimation(this.state.animSignin, 0, 400, false).start();
            this.setState({
                signinMode: false,
                pseudo: '',
                cguAccepted: false,
                errorPseudo: '',
                errorCgu: '',
            });
        }
    }
}

export default BackLogin;
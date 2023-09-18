import { Animated, Linking, Platform } from 'react-native';

import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Login, Signin } from './login';
import { IsEmail } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';

const MAX_EMAIL_LENGTH = 320;
const MAX_PSEUDO_LENGTH = 32;

class BackLogin extends PageBack {
    state = {
        loading: false,
        signinMode: false,

        email: '',
        username: '',
        cguAccepted: false,
        errorEmail: '',
        errorUsername: '',
        errorCgu: '',

        animImage: new Animated.Value(1),
        animFocus: new Animated.Value(0),
        animSignin: new Animated.Value(0)
    };

    constructor(props) {
        super(props);

        // Load texts
        const lang = langManager.curr['login'];
        this.langs = {
            pageTitle: lang['page-title'],
            pageText: lang['page-text'],
            titleEmail: lang['input-email-title'],
            titleUsername: lang['input-username-title'],
            btnLogin: lang['button-login-text'],
            btnSignin: lang['button-signin-text'],
            cguTexts: lang['input-cgu-text'].split('%')
        };

        // Load images
        this.imageBackground = require('../../../../res/logo/login_circles.png');
        this.imageMain = require('../../../../res/logo/login_hand.png');
    }

    refInputEmail = null;
    refInputUsername = null;

    componentDidMount() {
        super.componentDidMount();
        this.checkConnection();
    }
    componentWillUnmount() {
        user.interface.ResetCustomBackHandler();
    }

    onPressImageIn = () => SpringAnimation(this.state.animImage, .9, false).start();
    onPressImageOut = () => SpringAnimation(this.state.animImage, 1, false).start();

    onFocus = () => {
        if (Platform.OS === 'ios' && user.interface.screenHeight > 600) {
            SpringAnimation(this.state.animImage, 0, false).start();
            SpringAnimation(this.state.animFocus, 1, false).start();
        }
    }
    onBlur = () => {
        if (Platform.OS === 'ios' && user.interface.screenHeight > 600) {
            SpringAnimation(this.state.animImage, 1, false).start();
            SpringAnimation(this.state.animFocus, 0, false).start();
        }
    }

    checkConnection = async () => {
        await user.server.Ping(true);
        if (!user.server.online) {
            user.interface.ChangePage('waitinternet');
        }
    }

    /**
     * Set signin mode
     * @param {boolean} mode
     * @returns {false}
     */
    setSigninMode = (mode = false) => {
        const { signinMode, animSignin } = this.state;
        if (mode === signinMode) {
            return;
        }

        // Do animation, change state, set custom back handle
        if (mode) {
            SpringAnimation(animSignin, 1, false).start();
            this.setState({ signinMode: true });
            user.interface.SetCustomBackHandler(() => this.setSigninMode(false));
        } else {
            SpringAnimation(animSignin, 0, false).start();
            this.setState({
                signinMode: false,
                username: '',
                cguAccepted: false,
                errorUsername: '',
                errorCgu: '',
            });
            user.interface.ResetCustomBackHandler();
        }

        SpringAnimation(this.state.animFocus, 0, false).start();
        if (typeof(this.refInputEmail?.blur) === 'function') {
            this.refInputEmail?.blur();
        }
        if (typeof(this.refInputUsername?.blur) === 'function') {
            this.refInputUsername?.blur();
        }

        return false;
    }

    onChangeEmail = (newEmail) => {
        const email = newEmail.trim().substring(0, MAX_EMAIL_LENGTH);
        this.setState({ email });
    }

    onChangeUsername = (newUsername) => {
        const username = newUsername.trim().substring(0, MAX_PSEUDO_LENGTH);
        this.setState({ username });
    }

    onCGUToggle = () => {
        const { cguAccepted } = this.state;
        this.setState({ cguAccepted: !cguAccepted });
    }

    onCGURedirect() {
        const link = 'https://google.com'; // TODO: Change link
        Linking.openURL(link);
    }

    /**
     * Login or Signin
     * Do verification before call Login or Signin
     */
    onLoginOrSignin = async () => {
        const lang = langManager.curr['login'];
        const { loading, signinMode } = this.state;

        if (loading) {
            return;
        }

        if (!signinMode) {
            const { email, errorEmail } = this.state;

            // Check email
            if (!IsEmail(email)) {
                this.setState({ errorEmail: lang['error-login-nonmail'] });
                return;
            }
            if (errorEmail.length) {
                this.setState({ errorEmail: '' });
            }

            // Login
            this.setState({ loading: true });
            const logged = await Login.call(this, email);
            if (logged) {
                user.interface.ChangePage('loading', undefined, true);
                return;
            }
        }

        else {
            const { email, username, errorUsername, cguAccepted, errorCgu } = this.state;

            // Check username
            if (!username.length) {
                this.setState({ errorUsername: lang['error-signin-pseudoWrong'] });
                return;
            }
            if (errorUsername.length) {
                this.setState({ errorUsername: '' });
            }

            // Check CGU
            if (!cguAccepted) {
                this.setState({ errorCgu: lang['error-signin-disagree'] });
                return;
            }
            if (errorCgu.length) {
                this.setState({ errorCgu: '' });
            }

            // Signin
            this.setState({ loading: true });
            const signed = await Signin.bind(this)(email, username);
            if (signed) {
                user.interface.ChangePage('waitmail', { email: email }, true);
                return;
            }
        }

        this.setState({ loading: false });
    }
}

export default BackLogin;
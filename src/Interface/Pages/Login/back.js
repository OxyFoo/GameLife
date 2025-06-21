import { Animated, Linking } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Login, Signin } from './login';
import GoogleSignIn from 'Utils/GoogleSignIn';
import { IsEmail } from 'Utils/String';
import { Sleep } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').ConnectionState} ConnectionState
 * @typedef {import('Interface/Components/ComboBox').ComboBoxItem} ComboBoxItem
 */

const MAX_EMAIL_LENGTH = 320;
const MAX_PSEUDO_LENGTH = 32;

class BackLogin extends PageBase {
    state = {
        loading: false,
        signinMode: false,

        email: '',
        username: '',
        cguAccepted: false,
        errorEmail: '',
        errorUsername: '',
        errorCgu: '',

        animSignin: new Animated.Value(0),
        animSigninBis: new Animated.Value(0),

        /** @type {ComboBoxItem} */
        cbSelectedLang: {
            key: langManager.currentLangageKey,
            value: langManager.curr['name']
        }
    };

    /**
     * Flag to indicate if the Google token has been validated
     * This is used to track token validation state when login or signin is cancelled
     * @type {boolean}
     */
    googleTokenValidated = false;

    /** @param {PageBase['props']} props */
    constructor(props) {
        super(props);

        /** @type {ComboBoxItem[]} */
        this.availableLangs = langManager.GetLangsKeys().map((langKey) => ({
            key: langKey,
            value: langManager.GetAllLangs()[langKey]['name']
        }));
    }

    componentDidMount() {
        this.onServerUpdateState(user.server2.tcp.state.Get());
        this.listenerServer = user.server2.tcp.state.AddListener(this.onServerUpdateState);
    }

    componentWillUnmount() {
        user.interface.RemoveCustomBackHandler(this.backToLogin);
        if (this.listenerServer) {
            user.server2.tcp.state.RemoveListener(this.listenerServer);
        }
    }

    /** @param {ConnectionState} state */
    onServerUpdateState = (state) => {
        if (state !== 'connected') {
            this.fe.ChangePage('waitinternet', {
                storeInHistory: false,
                transition: 'fromBottom'
            });
        }
    };

    /** @param {ComboBoxItem | null} lang */
    onChangeLang = async (lang) => {
        if (lang === null || typeof lang.key !== 'string') return;

        const key = langManager.IsLangAvailable(lang.key);
        if (key === null) return;

        await user.settings.SetLang(key);

        setTimeout(() => {
            this.setState({ cbSelectedLang: lang });
        }, 100);
    };

    /** @param {string} newEmail */
    onChangeEmail = (newEmail) => {
        const email = newEmail.trim().substring(0, MAX_EMAIL_LENGTH);
        this.setState({ email });
    };

    /** @param {string} newUsername */
    onChangeUsername = (newUsername) => {
        const username = newUsername.trim().substring(0, MAX_PSEUDO_LENGTH);
        this.setState({ username });
    };

    onCGUToggle = () => {
        const { cguAccepted } = this.state;
        this.setState({ cguAccepted: !cguAccepted });
    };

    onCGURedirect() {
        // TODO: Manage langages for the website
        // const websiteAvailableLang = ['fr', 'en'];
        // let langKey = 'fr';
        // if (!websiteAvailableLang.includes(langManager.currentLangageKey)) {
        //     langKey = langManager.currentLangageKey;
        // }

        Linking.openURL(`https://oxyfoo.fr/legal/terms-of-service`);
    }

    onLogin = async () => {
        const lang = langManager.curr['login'];
        const { loading, email, errorEmail } = this.state;

        // Prevent double login
        if (loading) return;

        // Check email
        if (!IsEmail(email)) {
            this.setState({ errorEmail: lang['error-login-nonmail'] });
            return;
        }
        if (errorEmail.length) {
            this.setState({ errorEmail: '' });
        }

        // Login
        await Login.call(this, email);
        return;
    };

    goToSignin = () => {
        const { signinMode, animSignin, animSigninBis } = this.state;
        if (signinMode) {
            return;
        }

        SpringAnimation(animSignin, 1, false).start();
        setTimeout(SpringAnimation(animSigninBis, 1, false).start, 100);

        this.setState({ signinMode: true });
        user.interface.AddCustomBackHandler(this.backToLogin);
    };

    backToLogin = () => {
        const { signinMode, animSignin, animSigninBis } = this.state;
        if (!signinMode) {
            return false;
        }

        // Reset animations
        setTimeout(SpringAnimation(animSignin, 0, false).start, 100);
        SpringAnimation(animSigninBis, 0, false).start();

        // Reset state
        this.setState({
            signinMode: false,
            username: '',
            cguAccepted: false,
            errorUsername: '',
            errorCgu: ''
        });

        // Remove custom back handler
        user.interface.RemoveCustomBackHandler(this.backToLogin);

        // If Google token was validated, reset it
        if (this.googleTokenValidated) {
            this.googleTokenValidated = false;
            user.server2.tcp.Send({ action: 'google-signin-token-reset' });
            GoogleSignIn.SignOut();
        }

        return false;
    };

    onSignin = async () => {
        const lang = langManager.curr['login'];
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
        return await Signin.bind(this)(email, username);
    };

    // Google Sign-In method
    googleSignIn = async () => {
        const lang = langManager.curr['login'];

        this.setState({ loading: true });

        // Wait for animations to finish
        await Sleep(200);

        // Perform Google Sign-In
        const result = await GoogleSignIn.SignIn();
        if (!result.success) {
            // Do nothing if the user cancelled the sign-in
            if (result.errorType === 'cancelled') {
                this.setState({ loading: false });
                return;
            }

            // Handle error
            this.setState({
                loading: false,
                errorEmail: lang['error-signin-server'].replace('{}', result.error)
            });
            return;
        }

        // Submit Google token to server for validation before proceeding with login/signin
        const response = await user.server2.tcp.SendAndWait({
            action: 'google-signin-token-submit',
            email: result.email,
            token: result.idToken
        });
        if (
            response === 'timeout' ||
            response === 'not-sent' ||
            response === 'interrupted' ||
            response.status !== 'google-signin-token-submit'
        ) {
            // Handle server error
            const error = typeof response === 'string' ? response : 'unknown';
            this.setState({
                loading: false,
                errorEmail: lang['error-signin-server'].replace('{}', error)
            });
            return;
        }

        this.googleTokenValidated = true;

        // Use the existing login function with the Google email
        const needSignin = await Login.call(this, result.email);

        // Continue login in loading page
        if (!needSignin) {
            const mailSaved = await user.server2.userAuth.SetEmail(result.email);
            if (!mailSaved) {
                this.setState({
                    loading: false,
                    errorEmail: lang['error-signin-server'].replace('{}', 'email-save-failed')
                });
                return;
            }
            this.fe.ChangePage('loading', { storeInHistory: false });
        }

        // Reset loading state
        this.setState({
            loading: false,
            email: result.email,
            errorEmail: ''
        });
    };
}

export default BackLogin;

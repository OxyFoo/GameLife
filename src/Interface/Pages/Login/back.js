import { Animated, Linking } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Login, Signin } from './login';
import { IsEmail } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';
import { env } from 'Utils/Env';

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
        googleLoading: false,

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

        // Configuration Google Sign-In
        GoogleSignin.configure({
            webClientId: env.GOOGLE_WEB_CLIENT_ID,
            offlineAccess: false
        });
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

    loginOrGoToSignin = async () => {
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
        return await Login.call(this, email);
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

        setTimeout(SpringAnimation(animSignin, 0, false).start, 100);
        SpringAnimation(animSigninBis, 0, false).start();

        this.setState({
            signinMode: false,
            username: '',
            cguAccepted: false,
            errorUsername: '',
            errorCgu: ''
        });
        user.interface.RemoveCustomBackHandler(this.backToLogin);
        return false;
    };

    signin = async () => {
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

        try {
            this.setState({ googleLoading: true });

            // Check if device supports Google Play Services
            await GoogleSignin.hasPlayServices();

            // Sign in with Google
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.type === 'cancelled' || userInfo.type !== 'success') {
                this.setState({
                    errorEmail: lang['error-signin-server'].replace('{}', `Google sign-in cancelled - ${userInfo.type}`)
                });
                return;
            }

            user.interface.console?.AddLog('info', 'Google Sign-In Success:', userInfo);

            if (userInfo && userInfo.user && userInfo.user.email) {
                const email = userInfo.user.email;

                // Use the existing login function with the Google email
                await Login.call(this, email);
            } else {
                this.setState({
                    errorEmail: lang['error-signin-server'].replace('{}', 'Google sign-in failed')
                });
            }
        } catch (error) {
            console.log('Google Sign-In Error:', error);
            let errorMessage = 'Google sign-in failed';

            if (error && typeof error === 'object' && 'code' in error) {
                if (error.code === 'SIGN_IN_CANCELLED') {
                    errorMessage = 'Sign-in cancelled';
                } else if (error.code === 'IN_PROGRESS') {
                    errorMessage = 'Sign-in in progress';
                } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                    errorMessage = 'Play Services not available';
                } else if (error.code === 'DEVELOPER_ERROR') {
                    errorMessage = 'Configuration error - SHA-1 fingerprint missing in Google Cloud Console';

                    // Show detailed error for debugging
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: 'Configuration Google Sign-In',
                            message: `Erreur de configuration détectée.\n\nSHA-1 Debug: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25\n\nSHA-1 Prod: 32:A6:81:E5:43:6D:F2:E8:5D:AE:4C:83:51:AF:39:56:0A:5D:D1:EC\n\nAjoutez ces SHA-1 dans Google Cloud Console > APIs & Services > Credentials`
                        }
                    });
                }
            }

            this.setState({
                errorEmail: lang['error-signin-server'].replace('{}', errorMessage)
            });
        } finally {
            this.setState({ googleLoading: false });
        }
    };
}

export default BackLogin;

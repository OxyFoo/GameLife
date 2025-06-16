import { Animated, Linking } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Login, Signin } from './login';
import { IsEmail } from 'Utils/String';
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
}

export default BackLogin;

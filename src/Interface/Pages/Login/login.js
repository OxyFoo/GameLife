import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('./back').default} LoginPage
 */

/**
 * Login, return true if success (& next page loading) or false if error
 * @this {LoginPage}
 * @param {string} email
 * @returns {Promise<void>}
 */
async function Login(email) {
    const lang = langManager.curr['login'];

    this.setState({ loading: true });
    const { status } = await user.server.Connect(email);
    await new Promise((resolve) => this.setState({ loading: false }, () => resolve(null)));

    // Logged in
    if (status === 'ok') {
        user.settings.email = email;
        user.settings.connected = true;
        await user.settings.Save();
        user.interface.ChangePage('loading', undefined, true);
    }

    // No account, go to signin
    else if (status === 'free') {
        this.goToSignin();
    } 

    // Too many devices
    else if (status === 'limitDevice') {
        const title = lang['alert-limitDevice-title'];
        const text = lang['alert-limitDevice-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ]);
    }

    // New device or mail unconfirmed
    else if (status === 'waitMailConfirmation' || status === 'newDevice') {
        user.settings.email = email;
        await user.settings.Save();
        user.interface.ChangePage('waitmail', { email: email }, true);
    }

    // Error
    else if (status === 'error') {
        this.setState({ errorEmail: lang['error-signin-server'] }, () => {
            this.checkConnection();
        });
    }
}

/**
 * Signin, return true if success (& next page loading) or false if error
 * @this {LoginPage}
 * @param {string} email
 * @param {string} username
 * @returns {Promise<void>}
 */
async function Signin(email, username) {
    const lang = langManager.curr['login'];
    this.setState({ loading: true });
    const signinStatus = await user.server.Signin(email, username);
    await new Promise((resolve) => this.setState({ loading: false }, () => resolve(null)));

    // Signin success
    if (signinStatus === 'ok') {
        user.settings.email = email;
        await user.settings.Save();
        user.interface.ChangePage('waitmail', { email: email }, true);
        return;
    }

    // Too many devices
    else if (signinStatus === 'limitAccount') {
        const title = lang['alert-limitAccount-title'];
        const text = lang['alert-limitAccount-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    // Username already used
    else if (signinStatus === 'pseudoUsed') {
        this.setState({ errorUsername: lang['error-signin-pseudoUsed'] });
    }

    // Username incorrect
    else if (signinStatus === 'pseudoIncorrect') {
        this.setState({ errorUsername: lang['error-signin-pseudoIncorrect'] });
    }

    // Error
    else {
        this.setState({
            username: '',
            errorUsername: '',
            errorEmail: lang['error-signin-server']
        });
        this.backToLogin();
    }
}

export { Login, Signin };

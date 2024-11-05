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
    const status = await user.server2.Login(email);
    await new Promise((resolve) => this.setState({ loading: false }, () => resolve(null)));

    // Logged in
    if (status === 'ok') {
        user.settings.email = email;
        await user.settings.IndependentSave();
        user.interface.ChangePage('loading', { storeInHistory: false });
    }

    // No account, go to signin
    else if (status === 'free') {
        this.goToSignin();
    }

    // New device or mail unconfirmed
    else if (status === 'waitMailConfirmation') {
        user.settings.email = email;
        await user.settings.IndependentSave();
        user.interface.ChangePage('waitmail', { storeInHistory: false });
    }

    // Error
    else {
        this.setState({ errorEmail: lang['error-signin-server'] });
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
    const signinStatus = await user.server2.Signin(username, email);
    await new Promise((resolve) => this.setState({ loading: false }, () => resolve(null)));

    // Signin success
    if (signinStatus === 'ok') {
        await Login.call(this, email);
        return;
    }

    // Too many devices
    else if (signinStatus === 'limitAccount') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-limitAccount-title'],
                message: lang['alert-limitAccount-message']
            }
        });
    }

    // Username already used
    else if (signinStatus === 'usernameAlreadyUsed') {
        this.setState({ errorUsername: lang['error-signin-pseudoUsed'] });
    }

    // Username incorrect
    else if (signinStatus === 'invalidUsername' || signinStatus === 'usernameIsBlacklisted') {
        this.setState({ errorUsername: lang['error-signin-pseudoIncorrect'] });
    }

    // Error
    else {
        user.interface.console?.AddLog('error', 'Signin error:', signinStatus);
        this.setState({
            username: '',
            errorUsername: '',
            errorEmail: lang['error-signin-server']
        });
        this.backToLogin();
    }
}

export { Login, Signin };

import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

const REFRESH_DELAY = 10; // seconds

class BackWaitmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: null
        }
    }

    componentDidMount() {
        this.tick = setInterval(this.onTick, 1000);
        this.login = setInterval(this.Login, REFRESH_DELAY * 1000);
        this.Login();
    }

    componentWillUnmount() {
        clearInterval(this.tick);
        clearInterval(this.login);
    }

    onTick = () => {
        if (typeof(this.state.time) === 'number' && this.state.time > 0) {
            this.setState({ time: Math.max(0, this.state.time - 1) });
        }
    }

    onBack = () => {
        user.settings.email = '';
        user.settings.Save();
        user.interface.ChangePage('login', undefined, true);
    }

    Login = async () => {
        const email = user.settings.email;

        // Login
        const { status, remainMailTime } = await user.server.Connect(email);

        if (status === 'limitDevice') {
            // Too many devices
            const title = langManager.curr['login']['alert-limitDevice-title'];
            const text = langManager.curr['login']['alert-limitDevice-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], this.onBack);
        } else if (status === 'ok' || status === 'ban') {
            user.settings.connected = true;
            await user.settings.Save();
            user.interface.ChangePage('loading', undefined, true);
        }
        else if (status === 'free') {
            // Error, account not exists
            this.onBack();
        } else if (status === 'newDevice') {
            this.setState({ time: true });
        } else if (status === 'waitMailConfirmation') {
            this.setState({ time: remainMailTime });
        } else if (status === 'remDevice') {
            await this.Login();
        }
    }
}

export default BackWaitmail;
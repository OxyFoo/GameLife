import * as React from 'react';

import user from '../../Managers/UserManager';

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
        this.interval = setInterval(this.Login, REFRESH_DELAY * 1000);
        this.Login();
    }

    componentWillUnmount() {
        clearInterval(this.tick);
        clearInterval(this.interval);
    }

    onTick = () => {
        if (this.state.time !== null) {
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
        this.setState({ time: remainMailTime });

        if (status === 'free') {
            // Error, account not exists
            this.onBack();
        } else if (status === 'ok' || status === 'ban') {
            user.settings.connected = true;
            await user.settings.Save();
            user.interface.ChangePage('loading', undefined, true);
        } else if (status === 'newDevice') {
            // TODO - Mail sent
            console.log('Mail sent');
        }
    }
}

export default BackWaitmail;
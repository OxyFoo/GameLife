import * as React from 'react';

import user from '../../Managers/UserManager';

const REFRESH_DELAY = 10; // seconds

class BackWaitmail extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.interval = setInterval(this.Login, REFRESH_DELAY * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onBack = () => {
        user.settings.email = '';
        user.settings.Save();
        user.interface.changePage('login', undefined, true);
    }

    Login = async () => {
        const { email } = this.props.args;

        // Login
        const status = await user.server.Connect(email);
        if (status === 'free') {
            // Error, account not exists
            this.onBack();
        } else if (status === 'ok' || status === 'ban') {
            user.settings.connected = true;
            await user.settings.Save();
            user.interface.changePage('loading', undefined, true);
        } else if (status === 'newDevice') {
            // TODO - Mail sent
            console.log('Mail sent');
        }
    }
}

export default BackWaitmail;
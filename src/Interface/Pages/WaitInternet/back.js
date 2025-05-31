import { Linking } from 'react-native';

import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';

const REFRESH_DELAY_SECONDS = 30;

class BackWaitinternet extends PageBase {
    state = {
        /** @type {'not-connected' | 'maintenance' | 'authenticated-failed' | 'error'} */
        currentStatus: 'not-connected',

        /** @type {string | null} */
        lastError: user.server2.tcp.GetLastError()
    };

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY_SECONDS * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    Loop = async () => {
        const status = await user.server2.Initialize();
        if (status === 'authenticated' || status === 'already-authenticated') {
            user.interface.ChangePage('login', { storeInHistory: false });
        } else if (status === 'update') {
            user.interface.ChangePage('loading', { storeInHistory: false });
        } else if (status === 'maintenance' || status === 'not-connected' || status === 'authenticated-failed') {
            const lastError = user.server2.tcp.GetLastError();
            this.setState({
                currentStatus: status,
                lastError: lastError === null ? 'Unknown error' : lastError
            });
        } else {
            this.setState({
                currentStatus: 'error',
                lastError: status
            });
        }
    };

    goToWebsite = () => {
        Linking.openURL('https://oxyfoo.fr');
    };
}

export default BackWaitinternet;

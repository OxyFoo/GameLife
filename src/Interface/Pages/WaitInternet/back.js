import { Linking } from 'react-native';

import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';

const REFRESH_DELAY_SECONDS = 30;

class BackWaitinternet extends PageBase {
    state = {
        loading: false,

        /** @type {'not-connected' | 'maintenance' | 'error'} */
        currentStatus: 'not-connected'
    };

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY_SECONDS * 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        const status = await user.server2.Connect();
        if (status === 'success' || status === 'already-connected') {
            user.interface.ChangePage('login', { storeInHistory: false });
        } else {
            this.setState({ currentStatus: status });
        }
    };

    goToWebsite = () => {
        Linking.openURL('https://oxyfoo.com');
    };
}

export default BackWaitinternet;

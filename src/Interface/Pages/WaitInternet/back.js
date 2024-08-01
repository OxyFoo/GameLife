import { Linking } from 'react-native';

import user from 'Managers/UserManager';

import PageBase from 'Interface/FlowEngine/PageBase';

const REFRESH_DELAY_SECONDS = 30;

class BackWaitinternet extends PageBase {
    state = {
        loading: false
    };

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY_SECONDS * 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        await user.server.Ping();
        if (user.server.online) {
            user.interface.ChangePage('login', { storeInHistory: false });
        }
    };

    goToWebsite = () => {
        Linking.openURL('https://oxyfoo.com');
    };
}

export default BackWaitinternet;

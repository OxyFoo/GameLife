import { Linking } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';

import { PageBase } from 'Interface/Components';

const REFRESH_DELAY_SECONDS = 30;

class BackWaitinternet extends PageBase {
    state = {
        loading: false
    }

    image = require('../../../../res/logo/login_circles.png');

    componentDidMount() {
        super.componentDidMount();
        this.interval = window.setInterval(this.Loop, REFRESH_DELAY_SECONDS * 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        await user.server.Ping();
        if (user.server.online) {
            if (this.props.args.force) {
                RNExitApp.exitApp();
                return;
            }
            user.interface.ChangePage('login', undefined, true);
        }
    }

    goToWebsite = () => {
        Linking.openURL('https://oxyfoo.com');
    }
}

export default BackWaitinternet;

import * as React from 'react';
import { Platform, Animated } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { isEmail, random, sleep } from '../../Functions/Functions';
import { OptionsAnimation } from '../../Functions/Animations';
import { enableMorningNotifications } from '../../Functions/Notifications';

const REFRESH_DELAY = 2; // seconds

class BackWaitinternet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY * 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        await user.server.Ping();
    }
}

export default BackWaitinternet;
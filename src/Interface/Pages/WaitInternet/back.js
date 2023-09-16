import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';

const REFRESH_DELAY_SECONDS = 2;

class BackWaitinternet extends PageBack {
    state = {
        loading: false
    };

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
            user.interface.ChangePage('login', undefined, true);
        }
    }
}

export default BackWaitinternet;
import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';

const REFRESH_DELAY_SECONDS = 2;

class BackWaitinternet extends PageBack {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.Loop, REFRESH_DELAY_SECONDS * 1000);
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
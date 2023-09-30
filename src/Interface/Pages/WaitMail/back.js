import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

const REFRESH_DELAY = 10; // seconds

class BackWaitmail extends PageBack {
    state = {
        /** @type {number|'sent'|null} */
        time: null
    };

    image = require('../../../../res/logo/login_circles.png');

    componentDidMount() {
        super.componentDidMount();

        this.tick = window.setInterval(this.onTick, 1000);
        this.login = window.setInterval(this.Login, REFRESH_DELAY * 1000);
        this.Login();
    }

    componentWillUnmount() {
        clearInterval(this.tick);
        clearInterval(this.login);
    }

    onBack = () => {
        user.settings.email = '';
        user.settings.Save();
        user.interface.ChangePage('login', undefined, true);
    }

    onTick = () => {
        const { time } = this.state;
        if (typeof(time) === 'number' && time > 0) {
            this.setState({ time: Math.max(0, time - 1) });
        }
    }

    getTimeText = () => {
        const { time } = this.state;
        const langWait = langManager.curr['wait'];

        let timeText = '';
        if (time === 'sent') {
            timeText = langWait['wait-email-send'];
        } else if (typeof(time) === 'number') {
            const SS = time % 60;
            const MM = (time - SS) / 60;
            timeText = langWait['wait-email-remain'].replace('{}', MM).replace('{}', SS);
        }
        return timeText;
    }

    Login = async () => {
        const email = user.settings.email;
        const { status, remainMailTime } = await user.server.Connect(email);

        // Connected or banned (banned is connected too but in offline mode)
        if (status === 'ok' || status === 'ban') {
            user.settings.connected = true;
            await user.settings.Save();
            user.interface.ChangePage('loading', undefined, true);
            return;
        }

        // Too many devices
        if (status === 'limitDevice') {
            const title = langManager.curr['login']['alert-limitDevice-title'];
            const text = langManager.curr['login']['alert-limitDevice-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ], user.interface.BackHandle);

            user.settings.email = '';
            user.settings.Save();
        }

        // Error, account not exists
        else if (status === 'free') {
            user.settings.email = '';
            user.settings.Save();
            user.interface.BackHandle();
        }

        else if (status === 'newDevice') {
            this.setState({ time: 'sent' });
        }

        else if (status === 'waitMailConfirmation') {
            this.setState({ time: remainMailTime });
        }

        else if (status === 'remDevice') {
            await this.Login();
        }
    }
}

export default BackWaitmail;
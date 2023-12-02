import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

class BackMultiplayer extends PageBase {
    state = {
        server: ''
    }

    componentDidMount() {
        super.componentDidMount();
        return;

        this.setState({ server: 'connected' });
        return;
        if (!user.server.online) {
            this.setState({ server: 'offline' });
            return;
        }
        user.multiplayer.onChangeState = (state) => {
            this.setState({ server: state });
        };
        user.multiplayer.Connect();
    }
    componentWillUnmount() {
        return;
        user.multiplayer.onChangeState = () => {};
        user.multiplayer.Disconnect();
    }

    Reconnect = () => {
        this.setState({ server: '' });
        user.multiplayer.Connect();
    }

    ConnectToServer = user.multiplayer.Connect;
    Send = () => user.multiplayer.Send('test');
    Disconnect = user.multiplayer.Disconnect;
}

export default BackMultiplayer;

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';

class BackMultiplayer extends PageBase {
    state = {
        server: ''
    }

    componentDidMount() {
        if (!user.server.online) {
            this.setState({ server: 'offline' });
            return;
        }
        this.listener = user.multiplayer.state.AddListener((state) => {
            this.setState({ server: state });
        });
    }
    componentWillUnmount() {
        user.multiplayer.state.RemoveListener(this.listener);
    }

    Reconnect = () => {
        console.log('Reconnect');
    }
}

export default BackMultiplayer;

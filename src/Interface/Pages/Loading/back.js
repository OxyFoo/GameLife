import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';

import { Initialisation } from '../../../App/Loading';

class BackLoading extends PageBack {
    state = {
        icon: 0
    };

    startY = 0;

    componentDidMount() {
        super.componentDidMount();
        Initialisation(this.nextStep);
    }

    nextStep = () => {
        this.setState({ icon: this.state.icon + 1 });
    }

    onToucheStart = (event) => {
        this.startY = event.nativeEvent.pageY;
    }
    onToucheEnd = (event) => {
        // Check if the user is offline and if he has scrolled up to open the console
        if (event.nativeEvent.pageY - this.startY < -200 && !user.server.online) {
            user.interface.console.Enable();
        }
    }
}

export default BackLoading;
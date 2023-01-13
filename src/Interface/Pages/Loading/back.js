import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';

import { Initialisation } from '../../../App/Loading';

class BackLoading extends PageBack {
    state = {
        icon: 0
    }

    componentDidMount() {
        Initialisation(this.nextStep);
    }

    nextStep = () => this.setState({ icon: this.state.icon + 1 });
    onToucheStart = (event) => { this.startY = event.nativeEvent.pageY; }
    onToucheEnd = (event) => { if (event.nativeEvent.pageY - this.startY < -200 && !user.server.online) user.interface.console.Enable(); }
}

export default BackLoading;
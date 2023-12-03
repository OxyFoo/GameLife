import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Initialisation } from '../../../App/Loading';

class BackLoading extends PageBase {
    state = {
        icon: 0,
        displayedSentence: ''
    }

    startY = 0;
    intervalId = null;

    componentDidMount() {
        super.componentDidMount();
        Initialisation(this.nextStep);

        this.pickRandomSentence();
        this.intervalId = setInterval(this.pickRandomSentence, 3 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    pickRandomSentence = () => {
        const sentences = langManager.curr['loading'];
        const randomIndex = Math.floor(Math.random() * sentences.length);
        this.setState({ displayedSentence: sentences[randomIndex] });
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

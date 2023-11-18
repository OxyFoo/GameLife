import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Initialisation } from '../../../App/Loading';

class BackLoading extends PageBack {
    state = {
        icon: 0,
        displayedSentence: "",
    };

    startY = 0;

    sentences = langManager.curr.loading 
    intervalId = null;
    intervalCounter = 0;
    maxIntervalCount = 5;
    
    pickRandomSentence() {
        if (this.intervalCounter >= this.maxIntervalCount) {
            clearInterval(this.intervalId);
            return;
        }
        //const index = this.intervalCounter % this.sentences.length
        const randomIndex = Math.floor(Math.random() * this.sentences.length);
        this.setState({ displayedSentence: this.sentences[randomIndex] });

        this.intervalCounter += 1;
    }

    componentDidMount() {
        super.componentDidMount();
        Initialisation(this.nextStep);
        this.pickRandomSentence();

        this.pickRandomSentence = this.pickRandomSentence.bind(this);
        this.intervalId = setInterval(this.pickRandomSentence, 2 * 1000);
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
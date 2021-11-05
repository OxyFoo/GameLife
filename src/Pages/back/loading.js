import * as React from 'react';
import { BackHandler, Platform } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import DataStorage, { STORAGE } from '../../Class/DataStorage';

class Loading extends React.Component {
    POINTS = [ '.', '..', '...', '..', '.', ' ' ];
    state = {
        textPoints: 0,
        quote: '',
        author: '',
        loaded: false
    }

    componentDidMount() {
        this.interval = setInterval(this.loop, 500);

        if (Platform.OS === "android") {
            try {
                SoundPlayer.playSoundFile('appli', 'mp3');
            } catch (e) {
                console.warn('Cannot play the sound file');
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidUpdate() {
        if (this.state.quote === '' && user.quotes.length > 0) {
            const random = user.random(0, user.quotes.length - 1);
            const quote = user.quotes[random];
            this.setState({ quote: quote['Quote'], author: quote['Author'] });
        }
        if (this.props.args.hasOwnProperty('state') && this.props.args.state === 4 && !this.state.loaded) {
            this.setState({ loaded: true });
            clearInterval(this.interval);
        }
    }

    loop = () => {
        this.setState({ textPoints: this.state.textPoints + 0.5 });
    }

    async screenPress() {
        let started = false;
        const data = await DataStorage.Load(STORAGE.APPSTATE, false);
        if (typeof(data) !== 'undefined' && data.hasOwnProperty('started')) {
            started = data['started'];
        }

        if (this.state.loaded) {
            if (started) {
                user.changePage('home');
            } else {
                this.welcome();
            }
        }
    }

    welcome = () => {
        const event = (button) => {
            if (button === 'refuse') {
                BackHandler.exitApp();
            } else if (button === 'accept') {
                setTimeout(() => {
                    user.closePopup();
                    DataStorage.Save(STORAGE.APPSTATE, { started: true }, false);
                    user.changePage('home');
                }, 100);
            }
        }
        const title = langManager.curr['home']['alert-first-title'];
        const text = langManager.curr['home']['alert-first-text'];
        user.openPopup('acceptornot', [ title, text ], event, false);
    }
}

export default Loading;
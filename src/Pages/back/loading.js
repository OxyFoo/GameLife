import * as React from 'react';
import { Platform } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

import user from '../../Managers/UserManager';
import { random } from '../../Functions/Functions';

class BackLoading extends React.Component {
    state = {
        quote: '',
        author: '',
        loaded: false
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            try {
                SoundPlayer.playSoundFile('appli', 'mp3');
            } catch (e) {
                console.warn('Cannot play the sound file');
            }
        }
    }

    componentDidUpdate() {
        if (this.state.quote === '' && user.quotes.length > 0) {
            const rnd = random(0, user.quotes.length - 1);
            const quote = user.quotes[rnd];
            this.setState({ quote: quote['Quote'], author: quote['Author'] });
        }
        if (this.props.args.hasOwnProperty('state') && this.props.args.state === 4 && !this.state.loaded) {
            this.setState({ loaded: true });
        }
    }
}

export default BackLoading;
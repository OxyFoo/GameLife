import * as React from 'react';
import { Platform } from 'react-native';
import SoundPlayer from 'react-native-sound-player';

import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';
import { random, sleep } from '../../Functions/Functions';
import { disableMorningNotifications, enableMorningNotifications } from '../../Functions/Notifications';

class BackLoading extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            icon: 0,
            quote: '',
            author: ''
        }
    }

    componentDidMount() {
        this.LoadData();
        // TODO - IOS
        if (Platform.OS === "android") {
            try {
                SoundPlayer.playSoundFile('appli', 'mp3');
            } catch (e) {
                console.warn('Cannot play the sound file');
            }
        }
    }

    async LoadData() {
        // Loading : Internal data
        const online = user.server.online;
        if (online) await dataManager.onlineLoad();
        else        await dataManager.localLoad();
        await user.localLoad();

        // TODO - Check data (if it doesn't empty)

        // Define quote
        const quote = dataManager.quotes.getRandomQuote();
        if (quote !== null) {
            this.setState({
                quote: quote.Quote,
                author: quote.Author
            });
        }

        // Connect
        if (user.server.token === '') {
            const email = user.settings.email;
            const status = await user.server.Connect(email);
            if (status === 'newDevice' || status === 'waitMailConfirmation') {
                while (!user.changePage('waitmail', { email: email })) await sleep(100);
                return;
            }
        }

        // Loading : User data
        await sleep(500); this.setState({ icon: 1 });
        if (online) {
            await user.localLoad();
            const saved = await user.saveUnsavedData();
            if (saved) await user.onlineLoad();
            else console.error('saveUnsavedData failed');
        }

        // Loading : Notifications
        await sleep(250); this.setState({ icon: 2 });
        if (user.settings.morningNotifications) {
            await enableMorningNotifications();
        } else {
            disableMorningNotifications();
        }

        await sleep(250); this.setState({ icon: 3 });
        await sleep(500);
        //while (!user.changePage('home')) await sleep(100);

        // TODO - Remove temp loading page
        while (!user.changePage('calendar')) await sleep(100);
    }
}

export default BackLoading;
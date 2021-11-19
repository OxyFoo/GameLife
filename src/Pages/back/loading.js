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

    DefineQuote() {
        const quotes = dataManager.quotes;
        if (quotes.length > 0) {
            const rnd = random(0, quotes.length - 1);
            this.setState({
                quote: quotes[rnd]['Quote'],
                author: quotes[rnd]['Author']
            });
        }
    }

    async LoadData() {
        // Loading : Internal data
        const online = user.server.online;
        if (online) await dataManager.onlineLoad();
        else        await dataManager.localLoad();
        await user.loadData(false);
        this.DefineQuote();

        // Loading : User data
        await sleep(500); this.setState({ icon: 1 });
        if (online) {
            await user.loadData(false);
            const saved = await user.saveUnsavedData();
            if (saved) await user.loadData(true);
            else console.error('saveUnsavedData failed');
        }

        // Loading : Notifications
        await sleep(250); this.setState({ icon: 2 });
        if (user.settings.morningNotifications) {
            await enableMorningNotifications();
        } else {
            disableMorningNotifications();
        }
        console.log(user.settings.morningNotifications);

        await sleep(250); this.setState({ icon: 3 });
        await sleep(500);
        while (!user.changePage('home')) await sleep(100);

    }
}

export default BackLoading;
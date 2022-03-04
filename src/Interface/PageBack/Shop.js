import * as React from 'react';
import { FirebaseAdMobTypes } from '@react-native-firebase/admob';

import user from '../../Managers/UserManager';

class BackShop extends React.Component {
    state = {
        adLoaded: false
    }

    constructor(props) {
        super(props);

        this.rewardedShop = user.admob.GetRewardedAd('shop', this.onAdEvent);
        this.state.adLoaded = this.rewardedShop.loaded;
    }
    componentWillUnmount() {
        user.admob.ClearEvents('shop');
    }

    watchAd = () => {
        if (this.rewardedShop === null) {
            user.interface.console.AddLog('warn', 'Ad not created');
            return;
        }
        if (!this.rewardedShop.loaded) {
            user.interface.console.AddLog('warn', 'Ad not loaded');
            return;
        }

        this.rewardedShop.show();
    }

    /** @type {FirebaseAdMobTypes.AdEventListener} */
    onAdEvent = async (type, error, data) => {
        if (!!error) {
            user.interface.console.AddLog('error', 'Ad error: ' + error);
            return;
        }

        switch (type) {
            case 'rewarded_loaded':
                this.setState({ adLoaded: true });
                break;
            case 'rewarded_earned_reward':
                const response = await user.server.AdWatched();
                if (response.status === 200 && response.content['status'] === 'ok') {
                    user.informations.ox = response.content['ox'];
                    this.forceUpdate();
                }
                break;
            case 'opened':
                this.setState({ adLoaded: false });
                break;
            case 'closed':
                this.rewardedShop.load();
                break;
        }
    }
}

export default BackShop;
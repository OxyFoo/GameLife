import * as React from 'react';
import { FirebaseAdMobTypes } from '@react-native-firebase/admob';

import user from '../../Managers/UserManager';

class BackShop extends React.Component {
    constructor(props) {
        super(props);

        this.unsubscriber = user.admob.ads.rewarded.shop.onAdEvent(this.onWatchAd);
        user.admob.ads.rewarded.shop.load();
    }
    componentWillUnmount() {
        this.unsubscriber();
    }

    watchAd = () => {
        if (user.admob.ads.rewarded.shop.loaded) {
            user.admob.ads.rewarded.shop.show();
        } else {
            console.log('Ad not loaded');
        }
    }
    /** @type {FirebaseAdMobTypes.AdEventListener} */
    onWatchAd = (type, error, data) => {
        console.log(type, error, data);
    }
}

export default BackShop;
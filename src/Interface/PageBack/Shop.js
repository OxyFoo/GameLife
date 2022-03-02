import * as React from 'react';
import { FirebaseAdMobTypes } from '@react-native-firebase/admob';

import user from '../../Managers/UserManager';

class BackShop extends React.Component {
    constructor(props) {
        super(props);

        this.rewardedShop = user.admob.GetRewardedAd('shop', this.onAdEvent);
    }
    componentWillUnmount() {
        user.admob.ClearEvents('shop');
    }

    watchAd = () => {
        if (this.rewardedShop === null) {
            console.log('Ad not created');
            return;
        }
        if (!this.rewardedShop.loaded) {
            console.log('Ad not loaded');
            return;
        }

        this.rewardedShop.show();
    }
    /** @type {FirebaseAdMobTypes.AdEventListener} */
    onAdEvent = (type, error, data) => {
        console.log(type, error, data);
    }
}

export default BackShop;
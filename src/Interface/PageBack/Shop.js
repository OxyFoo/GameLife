import * as React from 'react';

import user from '../../Managers/UserManager';

/**
 * @typedef {import('../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../Class/Admob').AdTypes['add10Ox']} AdEvent
 */

class BackShop extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait'
    }

    constructor(props) {
        super(props);
        this.rewardedShop = user.admob.GetRewardedAd('shop', 'add10Ox', this.onAdStateChange);
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

    /** @type {AdEvent} */
    onAdStateChange = (state) => this.setState({ adState: state });
}

export default BackShop;
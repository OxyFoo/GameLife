import * as React from 'react';

import user from '../../../Managers/UserManager';
import renderGiftCodePopup from './giftCodePopup';

/**
 * @typedef {import('../../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../../Class/Admob').AdTypes['add30Ox']} AdEvent
 */

class BackShop extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait'
    }

    componentDidMount() {
        this.rewardedShop = user.admob.GetRewardedAd('shop', 'add30Ox', this.onAdStateChange);
    }
    componentWillUnmount() {
        user.admob.ClearEvents('shop');
    }

    watchAd = () => this.rewardedShop.show();
    openShopItems = () => user.interface.ChangePage('shopitems');
    openPopupCode = () => user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));

    /** @type {AdEvent} */
    onAdStateChange = (state) => this.setState({ adState: state });
}

export default BackShop;
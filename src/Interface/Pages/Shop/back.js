import * as React from 'react';

import user from '../../../Managers/UserManager';
import renderGiftCodePopup from './giftCodePopup';

class BackShop extends React.Component {
    openShopItems = () => user.interface.ChangePage('shopitems');
    openPopupCode = () => user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));
}

export default BackShop;
import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import renderGiftCodePopup from './giftCodePopup';

class BackShop extends PageBack {
    openShopItems = () => user.interface.ChangePage('shopitems');
    openPopupCode = () => user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));
}

export default BackShop;
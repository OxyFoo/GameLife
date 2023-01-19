import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import renderGiftCodePopup from './giftCodePopup';

class BackShop extends PageBack {
    componentDidMount() {
        this.oxListener = user.informations.ox.AddListener(this.forceUpdate.bind(this));
    }
    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
    }

    openShopItems = () => user.interface.ChangePage('shopitems');
    openPopupCode = () => user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));
}

export default BackShop;
import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import renderGiftCodePopup from './popupGiftCode';

class BackShop extends PageBack {
    state = {
        oxAmount: user.informations.ox.Get()
    };

    componentDidMount() {
        super.componentDidMount();
        const updateOx = () => this.setState({ oxAmount: user.informations.ox.Get() });
        this.oxListener = user.informations.ox.AddListener(updateOx);
    }
    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
    }

    openShopItems = () => user.interface.ChangePage('shopitems');
    openPopupCode = () => user.interface.popup.Open('custom', renderGiftCodePopup.bind(this));
}

export default BackShop;
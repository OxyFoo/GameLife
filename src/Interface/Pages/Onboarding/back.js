import RNExitApp from 'react-native-exit-app';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { PageBack, Swiper } from '../../Components';

class BackOnboarding extends PageBack {
    state = {
        last: false,
        swiperHeight: 0
    };

    /** @type {Swiper} */
    refSwiper = null;

    onLayoutSwiper = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ swiperHeight: height });
    }

    selectEnglish = () => {
        langManager.SetLangage('en');
        this.forceUpdate();
    }
    selectFrench = () => {
        langManager.SetLangage('fr');
        this.forceUpdate();
    }
    next = async () => {
        if (this.refSwiper.posX === 3) {
            user.settings.onboardingWatched = true;
            const saved = await user.settings.Save();
            if (!saved) RNExitApp.exitApp();
            else user.interface.ChangePage('loading', undefined, true);
            return;
        }
        this.refSwiper.Next();
    }
    onSwipe = (index) => {
        this.setState({ last: index === 3 });
    }
}

export default BackOnboarding;
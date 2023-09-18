import { Animated } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageBack, Swiper } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

class BackOnboarding extends PageBack {
    state = {
        animButtonNext: new Animated.Value(1),
        animButtonStart: new Animated.Value(0)
    };

    last = false;

    /** @type {Swiper} */
    refSwiper = null;

    selectEnglish = () => {
        langManager.SetLangage('en');
        this.forceUpdate();
        this.next();
    }
    selectFrench = () => {
        langManager.SetLangage('fr');
        this.forceUpdate();
        this.next();
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

    /** @param {number} index */
    onSwipe = (index) => {
        // Define if the last page is reached
        if (this.last === true && index !== 3) {
            SpringAnimation(this.state.animButtonNext, 1).start();
            SpringAnimation(this.state.animButtonStart, 0).start();
            this.last = false;
        } else if (this.last === false && index === 3) {
            SpringAnimation(this.state.animButtonNext, 0).start();
            SpringAnimation(this.state.animButtonStart, 1).start();
            this.last = true;
        }
    }
}

export default BackOnboarding;
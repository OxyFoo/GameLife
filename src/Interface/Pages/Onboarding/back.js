import * as React from 'react';
import { BackHandler } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { Swiper } from '../../Components';

class BackOnboarding extends React.Component {
    constructor(props) {
        super(props);

        /** @type {Swiper} */
        this.refSwiper = null;
    }

    state = {
        last: false
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
            if (!saved) BackHandler.exitApp();
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
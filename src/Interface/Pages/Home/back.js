import React from 'react';
import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticScrollEvent
 *
 * @typedef {import('Managers/UserManager').UserManager} UserManager
 */

const BackHomeProps = {
    args: {
        /** @type {number} */
        tuto: 0
    }
};

class BackHome extends PageBase {
    static feKeepMounted = true;
    static feShowUserHeader = true;
    static feShowNavBar = true;

    state = {
        showDayRecap: false
    };

    /** @type {React.RefObject<ScrollView | null>} */
    refScrollView = React.createRef();

    /** @type {React.RefObject<View | null>} */
    refQuestsTitle = React.createRef();

    /** Scroll Y for parallax effect */
    scrollY = new Animated.Value(0);

    /** @param {NativeSyntheticScrollEvent} event */
    handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        this.scrollY.setValue(y);
    };

    openProfile = () => {
        user.interface.ChangePage('profile');
    };

    openStatistics = () => {
        user.interface.ChangePage('statistics');
    };

    newTodo = () => {
        user.interface.ChangePage('todo');
    };

    openDayRecap = () => {
        this.setState({ showDayRecap: true });
    };

    closeDayRecap = () => {
        this.setState({ showDayRecap: false });
    };
}

BackHome.defaultProps = BackHomeProps;
BackHome.prototype.props = BackHomeProps;

export default BackHome;

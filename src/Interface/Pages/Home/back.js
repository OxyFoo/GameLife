import React from 'react';
import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import { DayRecap } from 'Interface/Widgets';
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

    /** @type {React.RefObject<ScrollView | null>} */
    refScrollView = React.createRef();

    /** @type {React.RefObject<View | null>} */
    refSkillsTags = React.createRef();

    /** Current scroll offset of the page, used by the tutorial to bring a widget into view */
    scrollOffsetY = 0;

    /** Scroll Y for parallax effect */
    scrollY = new Animated.Value(0);

    /** @param {NativeSyntheticScrollEvent} event */
    handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        this.scrollY.setValue(y);
        this.scrollOffsetY = y;
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
        user.interface.popup?.Open({
            content: <DayRecap date={new Date()} />,
            cancelable: true
        });
    };
}

BackHome.defaultProps = BackHomeProps;
BackHome.prototype.props = BackHomeProps;

export default BackHome;

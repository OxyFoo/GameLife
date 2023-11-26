import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const BottomBarProps = {
    show: false,
    selectedIndex: -1
};

class BottomBarBack extends React.Component {
    state = {
        show: false,
        height: 0,
        animPosY: new Animated.Value(128),

        selectedIndex: 0,
        barWidth: 0,
        animBarX: new Animated.Value(0)
    }

    refButtons = Array(5).fill(null);

    componentDidUpdate() {
        // Show / Hide
        const newState = this.props.show;
        if (newState !== this.state.show) {
            this.setState({ show: newState });
            const toValue = newState ? 0 : 128;
            SpringAnimation(this.state.animPosY, toValue).start();
        }

        // Selectection bar
        const newIndex = this.props.selectedIndex;
        if (newIndex !== this.state.selectedIndex) {
            this.setState({ selectedIndex: newIndex });
            SpringAnimation(this.state.animBarX, newIndex * .2 * this.state.barWidth).start();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height: height + 24 }); // 24 = height of the half middle button
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutBody = (event) => {
        const { width } = event.nativeEvent.layout;
        this.setState({ barWidth: width });
    }

    goToHome = () => user.interface.ChangePage('home');
    goToCalendar = () => user.interface.ChangePage('calendar');
    goToActivity = () => user.interface.ChangePage('activity', undefined, true);
    goToMultiplayer = () => user.interface.ChangePage('multiplayer');
    goToShop = () => user.interface.ChangePage('shop');
}

BottomBarBack.prototype.props = BottomBarProps;
BottomBarBack.defaultProps = BottomBarProps;

export default BottomBarBack;

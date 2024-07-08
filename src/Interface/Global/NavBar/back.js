import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { AddActivity } from 'Interface/Widgets';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Managers/LangManager').Lang} Lang
 * @typedef {import('Interface/Components').Button} Button
 */

const NavBarProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class NavBarBack extends React.Component {
    state = {
        height: 0,
        animation: new Animated.Value(0),
        animationAddActivity: new Animated.Value(0)
    };

    show = false;

    /** @type {Record<keyof Lang['navbar'] | 'addActivity', React.RefObject<Button>>} */
    refButtons = {
        home: React.createRef(),
        calendar: React.createRef(),
        addActivity: React.createRef(),
        multiplayer: React.createRef(),
        shop: React.createRef()
    };

    Show = () => {
        if (this.show) {
            return;
        }

        this.show = true;
        SpringAnimation(this.state.animation, 1).start();
    };

    Hide = () => {
        if (!this.show) {
            return;
        }

        this.show = false;
        SpringAnimation(this.state.animation, 0).start();
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;

        this.setState({ height });
    };

    openHome = () => user.interface.ChangePage('home');
    openCalendar = () => user.interface.ChangePage('calendar');
    openAddActivity = () => {
        if (user.interface.bottomPanel.IsOpened()) {
            user.interface.bottomPanel.Close();
            SpringAnimation(this.state.animationAddActivity, 0).start();
            return;
        }
        user.interface.bottomPanel.Open({
            content: <AddActivity />,
            movable: false,
            onClose: () => {
                SpringAnimation(this.state.animationAddActivity, 0).start();
            }
        });
        SpringAnimation(this.state.animationAddActivity, 1).start();
    };
    openMultiplayer = () => user.interface.ChangePage('multiplayer');
    openShop = () => user.interface.ChangePage('shop');
}

NavBarBack.prototype.props = NavBarProps;
NavBarBack.defaultProps = NavBarProps;

export default NavBarBack;

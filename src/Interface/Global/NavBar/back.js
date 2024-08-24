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
 * @typedef {'home' | 'calendar' | 'multiplayer' | 'shop'} MainPages
 */

const NavBarProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class NavBarBack extends React.Component {
    state = {
        height: 100, // Hide navbar before layout is done
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

    onOpenBottomPanel = () => {
        SpringAnimation(this.state.animationAddActivity, 1).start();
    };

    onCloseBottomPanel = () => {
        SpringAnimation(this.state.animationAddActivity, 0).start();
    };

    openHome = () => this.openPageWithTransition('home');
    openCalendar = () => this.openPageWithTransition('calendar');
    openAddActivity = () => {
        if (user.interface.bottomPanel?.IsOpened()) {
            user.interface.bottomPanel?.Close();
            return;
        }

        user.interface.bottomPanel?.Open({
            content: <AddActivity />
        });
    };
    openMultiplayer = () => this.openPageWithTransition('multiplayer');
    openShop = () => this.openPageWithTransition('shop');

    /** @param {MainPages} page */
    openPageWithTransition = (page) => {
        /** @type {MainPages[]} */
        const pageList = ['home', 'calendar', 'multiplayer', 'shop'];
        const currentPage = user.interface.GetCurrentPageName();
        // @ts-ignore
        const fromIndex = pageList.indexOf(currentPage);
        const toIndex = pageList.indexOf(page);
        if (fromIndex === -1 || toIndex === -1) {
            return;
        }
        user.interface.ChangePage(page, { transition: fromIndex < toIndex ? 'fromRight' : 'fromLeft' });
    };
}

NavBarBack.prototype.props = NavBarProps;
NavBarBack.defaultProps = NavBarProps;

export default NavBarBack;

import * as React from 'react';
import { Animated } from 'react-native';

import Scrolling from './scrolling';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

const PageProps = {
    /** @type {Array<React.JSX.Element | React.JSX.Element[] | false | null> | React.JSX.Element | null} */
    children: null,

    /** @type {StyleProp} */
    style: {},

    /** @type {boolean} If true, user can vertical scroll the page */
    scrollable: true,

    /** @type {boolean} If true, user can scroll a little over the page for add a smooth effect */
    canScrollOver: true,

    /** @type {boolean} Define page as "home page" (Set offsets to top & bottom) */
    isHomePage: false,

    /** @type {number} */
    topOffset: 0,

    /** @type {number} */
    bottomOffset: 0,

    /** @type {React.JSX.Element | false | null} */
    overlay: null,

    /** @type {React.JSX.Element | false | null} */
    topOverlay: null,

    /** @type {number} */
    topOverlayHeight: 64,

    /** @type {React.JSX.Element | false | null} */
    footer: null,

    /** @param {LayoutChangeEvent} event */
    onLayout: (event) => {},

    /** @param {GestureResponderEvent} event */
    onStartShouldSetResponder: (event) => false
};

// TODO - Auto scroll if height change

class PageBack extends React.Component {
    scrolling = new Scrolling(this);

    opacity = new Animated.Value(0);
    positionY = new Animated.Value(0);
    topOverlayPosition = new Animated.Value(1);

    state = {
        /** @type {'box-none' | 'none' | 'box-only' | 'auto'} */
        pointerEvents: 'none',
        visible: false,

        height: 0,
        topOverlayShow: false
    }

    Show = () => {
        this.setState({ visible: true, pointerEvents: 'auto' });
        TimingAnimation(this.opacity, 1, 50).start();
    };
    Hide = () => {
        this.setState({ visible: false, pointerEvents: 'none' });
        TimingAnimation(this.opacity, 0, 50).start();
    };

    EnableEvents = () => {
        this.setState({ pointerEvents: this.state.visible ? 'auto' : 'none' });
    }
    DisableEvents = () => {
        this.setState({ pointerEvents: 'none' });
    }

    /** @param {number} y */
    GotoY = (y) => {
        this.posY = this.scrolling.limitValues(-y, this.props.canScrollOver);
        SpringAnimation(this.positionY, this.posY).start();
    }

    /** @param {number} y */
    GoToYRelative = (y) => {
        this.posY = this.scrolling.limitValues(this.posY + y, this.props.canScrollOver);
        SpringAnimation(this.positionY, this.posY).start();
    }

    EnableScroll = () => this.scrolling.scrollEnabled = true;
    DisableScroll = () => this.scrolling.scrollEnabled = false;
}

PageBack.prototype.props = PageProps;
PageBack.defaultProps = PageProps;

export default PageBack;

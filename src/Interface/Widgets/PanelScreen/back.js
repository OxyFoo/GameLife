import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Interface/Components/KeyboardSpacerView').KeyboardChangeStateEvent} KeyboardChangeStateEvent
 */

const PanelScreenProps = {
    /** @type {Array<React.JSX.Element | false | null> | null} */
    children: null,

    /** @type {StyleProp} */
    containerStyle: {},

    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0,

    /** @type {number} Offset to scroll down without closing panel */
    backOffset: 200,

    /** @type {boolean} No background when panel is opened */
    disableBackground: false,

    /** @type {() => void} */
    onClose: () => {}
};

class PanelScreenBack extends React.Component {
    state = {
        opened: false,
        height: 0,
        positionY: new Animated.Value(user.interface.screenHeight),

        anim: new Animated.Value(0)
    }

    /** @type {number} Top distance of the panel when it's opened */
    posY = user.interface.screenHeight;

    /** @type {boolean} Disable panel moving */
    scrollEnabled = true;

    /** Open the screen list */
    Open = () => {
        if (this.state.opened) return;

        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({ opened: true });

        this.posY = this.props.topOffset;
        SpringAnimation(this.state.positionY, this.posY).start();
    }

    /** Close the screen list */
    Close = () => {
        if (!this.state.opened) return;

        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({ opened: false });

        this.posY = user.interface.screenHeight;
        SpringAnimation(this.state.positionY, this.posY).start();
    }

    EnableScroll = () => this.scrollEnabled = true;
    DisableScroll = () => this.scrollEnabled = false;
    GotoY = (y) => {
        const { height } = this.state;
        this.posY = Math.min(y, this.props.topOffset);
        this.posY = Math.max(this.posY, user.interface.screenHeight - height);
        SpringAnimation(this.state.positionY, this.posY).start();
    }
    RefreshPosition = () => {
        const { height } = this.state;
        this.posY = Math.min(this.posY, this.props.topOffset);
        this.posY = Math.max(this.posY, user.interface.screenHeight - height);
        this.GotoY(this.posY);
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height });
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        event.stopPropagation();
        if (!this.scrollEnabled) return;

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;

        this.tickTime = Date.now();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        event.stopPropagation();
        if (!this.scrollEnabled) return;

        // Position
        const posY = event.nativeEvent.pageY;
        const deltaY = this.lastY - posY;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.accY = deltaY / deltaTime;
        this.tickTime = Date.now();

        // Update
        this.lastY = posY;
        this.posY -= deltaY;

        // Overscroll, smooth animation
        const maxTop = user.interface.screenHeight - this.state.height;
        if (this.posY < maxTop) {
            this.posY = maxTop - (maxTop - this.posY) / 8;
        }

        // Animation
        TimingAnimation(this.state.positionY, this.posY, 0).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (!this.scrollEnabled) return;

        const { positionY } = this.state;
        const { topOffset, backOffset } = this.props;

        const posY = this.posY;
        this.posY -= this.accY * .25;
        this.posY = Math.max(this.posY, user.interface.screenHeight - this.state.height);

        if (posY > topOffset && this.accY < -2000 ||
            posY > topOffset + backOffset)
        {
            this.Close();
            setTimeout(this.props.onClose, 100);
            return;
        }

        if (this.posY > topOffset) {
            this.posY = topOffset;
        }

        SpringAnimation(positionY, this.posY).start();
    }

    /** @type {KeyboardChangeStateEvent} */
    onKeyboardChangeState = (state, height) => {
        if (state === 'opened') {
            // Wait layout on first keyboard opening
            setTimeout(() => {
                this.GotoY(this.posY - height);
            }, 100);
        } else if (state === 'closed') {
            this.GotoY(this.posY + height);
        }
    }
}

PanelScreenBack.prototype.props = PanelScreenProps;
PanelScreenBack.defaultProps = PanelScreenProps;

export default PanelScreenBack;

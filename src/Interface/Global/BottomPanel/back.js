import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';
import { MinMax, Sleep } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 */

/**
 * @typedef {object} BottomPanelParamsType
 * @property {React.ReactNode} content
 * @property {number} [openOffset] If not set, it will be calculated automatically based on the content height
 * @property {boolean} [movable] Can the panel be moved by the user ? Default is true
 * @property {number} [zIndex] Default is 0
 * @property {(state: 'full-opened' | 'semi-opened' | 'low-opened') => void} [onChangeState] Default is false
 * @property {() => void} [onClose]
 */

/**
 * @callback BottomPanelRenderType
 * @param {Object} props
 * @param {() => void} props.close
 * @returns {React.ReactNode}
 */

class BottomPanelBack extends React.Component {
    state = {
        /** @type {'opened' | 'opening' | 'closed'} */
        state: 'closed',

        /** @type {BottomPanelParamsType | null} */
        current: null,

        height: Dimensions.get('window').height, // Default height to avoid glitch on mount
        animPosY: new Animated.Value(0),
        animOpacity: new Animated.Value(0)
    };

    /**
     * @type {boolean} Is panel opened, to avoid multiple opening
     * @private
     */
    opened = false;

    /**
     * @type {number} Panel Y position, 0 is closed (at the bottom of the screen) and + is opened
     * @private
     */
    posY = Dimensions.get('window').height;

    posYextremum = {
        min: 300,
        max: Dimensions.get('window').height
    };

    /**
     * @type {number} Last Y position
     * @private
     */
    lastY = 0;

    /**
     * @type {number} Accumulated Y
     * @private
     */
    accY = 0;

    /**
     * @type {number} Last tick time
     * @private
     */
    tickTime = 0;

    /**
     * @type {boolean} Disable panel moving
     * @private
     */
    scrollEnabled = true;

    /**
     * Open the screen list
     * @param {BottomPanelParamsType} params
     */
    Open = (params) => {
        if (this.opened || this.state.state !== 'closed') return;
        this.opened = true;

        user.interface.navBar?.onOpenBottomPanel();
        TimingAnimation(this.state.animOpacity, 1, 200).start();
        this.setState({ state: 'opening', current: params }, () => {
            this.opened = false;
        });
    };

    /** Close the screen list */
    Close = async () => {
        if (this.state.state === 'closed') {
            return;
        } else if (this.state.state === 'opening') {
            while (this.state.state === 'opening') {
                await Sleep(100);
            }
        }

        await new Promise((resolve) => {
            // Close state to enable click through
            this.setState({ state: 'closed' }, () => {
                // Close animation
                Animated.parallel([
                    SpringAnimation(this.state.animPosY, 0),
                    TimingAnimation(this.state.animOpacity, 0, 200)
                ]).start();

                this.state.current?.onClose?.();
                user.interface.navBar?.onCloseBottomPanel();

                setTimeout(() => {
                    // Reset state
                    this.setState({ current: null }, () => resolve(null));
                }, 150);
            });
        });
    };

    IsOpened = () => this.state.state === 'opened' || this.state.state === 'opening';

    EnableScroll = () => (this.scrollEnabled = true);

    DisableScroll = () => (this.scrollEnabled = false);

    /** @type {'full-opened' | 'semi-opened' | 'low-opened'} */
    lastState = 'semi-opened';

    /**
     * @param {number} y
     * @param {boolean} [animation] Default is true (smooth animation)
     */
    GotoY = (y, animation = true, checkValue = true) => {
        const { height, current } = this.state;

        const maxScroll = Math.min(this.posYextremum.max, height);
        const minScroll = Math.max(0, this.posYextremum.min);
        if (checkValue) {
            this.posY = MinMax(minScroll, y, maxScroll);
        } else {
            this.posY = y;
        }

        if (this.posY <= minScroll && this.lastState !== 'low-opened') {
            this.lastState = 'low-opened';
            current?.onChangeState?.('low-opened');
        } else if (this.posY >= maxScroll && this.lastState !== 'full-opened') {
            this.lastState = 'full-opened';
            current?.onChangeState?.('full-opened');
        } else if (this.lastState !== 'semi-opened' && this.posY > minScroll && this.posY < maxScroll) {
            this.lastState = 'semi-opened';
            current?.onChangeState?.('semi-opened');
        }

        if (animation) {
            SpringAnimation(this.state.animPosY, -this.posY).start();
        } else {
            this.state.animPosY.setValue(-this.posY);
        }
    };

    RefreshPosition = () => {
        this.GotoY(this.posY);
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;

        if (this.state.state === 'opening') {
            this.setState({ height, state: 'opened' }, () => {
                this.GotoY(height);
            });
        }
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        //event.stopPropagation();
        //event.preventDefault();

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;
        this.tickTime = Date.now();
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        //event.stopPropagation();
        //event.preventDefault();

        // Position
        const posY = event.nativeEvent.pageY;
        const deltaY = this.lastY - posY;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.accY = deltaY / deltaTime;
        this.tickTime = Date.now();

        const movable = this.state.current?.movable ?? true;
        if (!this.scrollEnabled || !movable) return;

        // Update
        this.lastY = posY;
        this.posY += deltaY;

        // Overscroll, smooth animation
        //const maxTop = Dimensions.get('window').height - this.state.height;
        //if (this.posY < maxTop) {
        //    this.posY = maxTop - (maxTop - this.posY) / 8;
        //}

        // Animation
        this.GotoY(this.posY, false, false);
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        if (!this.scrollEnabled) return;

        const { current } = this.state;

        const movable = this.state.current?.movable ?? true;
        if (!this.scrollEnabled || current === null || !movable) return;

        const posY = this.posY + this.accY * 0.25;

        // Big swipe down
        if (this.accY < -1000 && posY < this.posYextremum.max / 2) {
            this.Close();
            return;
        }

        this.GotoY(posY);
    };

    /** @param {GestureResponderEvent} event */
    onTouchEndBackground = (event) => {
        // Short click on background
        if (event.target === event.currentTarget && Date.now() - this.tickTime < 300 && Math.abs(this.accY) < 5) {
            this.Close();
            return;
        }

        this.onTouchEnd(event);
    };
}

export default BottomPanelBack;

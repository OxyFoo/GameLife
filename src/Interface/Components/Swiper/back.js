import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import { MinMax } from 'Utils/Functions';
import { TimingAnimation, SpringAnimation } from 'Utils/Animations';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const SwiperProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number | string} If undefined, height equals to max height of pages content */
    height: undefined,

    /** @type {number} */
    borderRadius: 16,

    /** @type {boolean} If true, automatically swipe to the next page */
    enableAutoNext: true,

    /** @type {boolean} */
    disableCircular: false,

    /** @type {number} Number of seconds to automatically swipe to the next page, if "enableAutoNext" is true */
    delayNext: 10,

    /** @type {Array<React.Component | React.ReactElement>} */
    pages: [],

    /** @type {number} */
    initIndex: 0,

    /** @type {ThemeColor} */
    backgroundColor: 'backgroundTransparent',

    /** @type {(index: number) => void} Callback is called when page index change */
    onSwipe: (index) => {},

    /** @type {(event: LayoutChangeEvent) => void} Callback is called when page layout change */
    onLayout: (event) => {},

    /** @type {boolean} */
    disableSwipe: false
};

class SwiperBack extends React.Component {
    posX = this.props.initIndex;

    state = {
        width: 0,
        maxHeight: 0,
        positionX: new Animated.Value(this.props.initIndex),
        positionDots: new Animated.Value(this.props.initIndex)
    }

    /** @type {'none' | 'vertical' | 'horizontal'} */
    scroll = 'none';

    componentDidMount() {
        this.startTimer();
    }
    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer = () => {
        if (!this.props.enableAutoNext) return;

        const { delayNext } = this.props;
        clearInterval(this.interval);
        this.interval = window.setInterval(this.Next, delayNext * 1000);
    }
    stopTimer = () => {
        clearInterval(this.interval);
    }

    Next = () => {
        const nextIndex = (this.posX + 1) % this.props.pages.length;
        this.posX = nextIndex;
        SpringAnimation(this.state.positionX, nextIndex).start();
        SpringAnimation(this.state.positionDots, nextIndex, false).start();
        this.props.onSwipe(nextIndex);
    }
    Prev = () => {
        const prevIndex = this.posX === 0 ? this.props.pages.length - 1 : this.posX - 1;
        this.posX = prevIndex;
        SpringAnimation(this.state.positionX, prevIndex).start();
        SpringAnimation(this.state.positionDots, prevIndex, false).start();
        this.props.onSwipe(prevIndex);
    }
    /** @param {number} index */
    GoTo = (index) => {
        this.posX = MinMax(0, index, this.props.pages.length - 1);
        SpringAnimation(this.state.positionX, index).start();
        SpringAnimation(this.state.positionDots, index, false).start();
        this.props.onSwipe(index);
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.stopTimer();
        this.firstPosX = this.posX;
        this.firstTouchX = event.nativeEvent.pageX;
        this.firstTouchY = event.nativeEvent.pageY;

        this.tickPos = 0;
        this.tickTime = Date.now();
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        if (this.props.disableSwipe) return;

        // Prevent vertical scroll when horizontal swipe
        if (this.scroll === 'none') {
            const deltaX = Math.abs(event.nativeEvent.pageX - this.firstTouchX);
            const deltaY = Math.abs(event.nativeEvent.pageY - this.firstTouchY);
            this.scroll = deltaX > deltaY ? 'horizontal' : 'vertical';
        }

        if (this.scroll === 'horizontal') {
            event.stopPropagation();
        } else if (this.scroll === 'vertical') {
            return;
        }

        // Position
        const currPosX = event.nativeEvent.pageX;
        const deltaPosX = this.firstTouchX - currPosX;
        const newPosX = this.firstPosX + deltaPosX / SCREEN_WIDTH;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.acc = (newPosX - this.tickPos) / deltaTime;
        this.tickTime = Date.now();
        this.tickPos = newPosX;

        // Update
        this.posX = newPosX;
        const newDotPos = MinMax(0, newPosX, this.props.pages.length - 1);
        TimingAnimation(this.state.positionX, newPosX, 0).start();
        TimingAnimation(this.state.positionDots, newDotPos, 0, false).start();
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.scroll = 'none';

        // Define the next page index
        let newIndex = 0;
        const dec = (this.posX % 1) + this.acc;
        if (dec > 0.5) newIndex = Math.ceil(this.posX);
        else           newIndex = Math.floor(this.posX);

        // Go to the first page if swipe to the last page & vice versa
        if (!this.props.disableCircular) {
            if (newIndex < 0) newIndex = this.props.pages.length - 1;
            else if (newIndex >= this.props.pages.length) newIndex = 0;
        }
        newIndex = MinMax(0, newIndex, this.props.pages.length - 1);

        // Update
        this.posX = newIndex;
        SpringAnimation(this.state.positionX, newIndex).start();
        SpringAnimation(this.state.positionDots, newIndex, false).start();
        this.props.onSwipe(newIndex);

        this.startTimer();
    }
    /** @param {GestureResponderEvent} event */
    onTouchCancel = (event) => {
        // Prevent vertical scroll when horizontal swipe
        event.stopPropagation();
        this.startTimer();
        const newIndex = Math.round(this.posX);
        SpringAnimation(this.state.positionX, newIndex).start();
        SpringAnimation(this.state.positionDots, newIndex, false).start();
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPage = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const { maxHeight } = this.state;

        if (height > maxHeight) {
            this.setState({ width: width, maxHeight: height });
        }
    }
}

SwiperBack.prototype.props = SwiperProps;
SwiperBack.defaultProps = SwiperProps;

export default SwiperBack;

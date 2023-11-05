import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation, SpringAnimation } from 'Utils/Animations';
import { MinMax } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 * 
 * @typedef {(name: string, index: number) => void} DigitCallback
 */

const DigitProps = {
    /** @type {StyleViewProp} */
    containerStyle: {},

    /** @type {number} */
    containerWidth: 46,

    /** @type {number} */
    minDigitWidth: 0,

    /** @type {string} - The text to get in callback */
    name: 'index',

    /** @type {ColorTheme|ColorThemeText} */
    color: 'primary',

    /** @type {boolean} If true, value can't be changed */
    lock: false,

    /** @type {number} */
    initValue: 0,

    /** @type {number} */
    minValue: 0,

    /** @type {number} */
    maxValue: 6,

    /** @type {number} */
    stepValue: 1,

    /** @type {number} Multiplier of the animation speed */
    velocity: 1,

    /** @type {ColorTheme|ColorThemeText} */
    fadeColor: 'background',

    /** @type {DigitCallback} */
    callback: (name, index) => {}
}

/**
 * Size of digit (width):
 *      component width + 2 * margin
 * Size of total container horizontal padding:
 *      Container size - borders - digit width
 *      46             - 2 * 2   - 28
 * PaddingLeft = (46 - 4 - 28) / 2 = 14 / 2 = 7
 */

class DigitBack extends React.Component {
    /** @type {number} Position of X scroll */
    scrollX = 0;

    state = {
        paddingLeft: 0,
        digitWidth: 0,
        animLeft: new Animated.Value(0)
    }

    componentDidMount() {
        const { initValue, minValue, maxValue, stepValue } = this.props;
        const newValue = MinMax(minValue, initValue, maxValue);
        const interval = setInterval(() => {
            const { digitWidth } = this.state;
            if (digitWidth > 0) {
                this.SetDigitsPosX((newValue / stepValue) * digitWidth);
                clearInterval(interval);
            }
        }, 200);
    }

    componentDidUpdate(prevProps) {
        const { digitWidth } = this.state;
        const { name, minValue, maxValue, stepValue, callback, } = this.props;

        // If maxValue is decreased, we need to update the position of digits
        if (prevProps.maxValue > maxValue && maxValue / stepValue < this.scrollX / digitWidth) {
            this.SetDigitsPosX((maxValue / stepValue) * digitWidth);
            callback(name, maxValue / stepValue);
        }

        // If minValue is increased, we need to update the position of digits
        if (prevProps.minValue < minValue && minValue / stepValue > this.scrollX / digitWidth) {
            this.SetDigitsPosX((minValue / stepValue) * digitWidth);
            callback(name, minValue / stepValue);
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { minDigitWidth, containerWidth } = this.props;
        const { width } = event.nativeEvent.layout;
        const margins = 4; // 2 * 2
        const digitWidth = Math.max(minDigitWidth, width) + margins;

        // Init
        if (digitWidth > this.state.digitWidth) {
            const containerBorders = 4; // 2 * 2
            const paddingLeft = (containerWidth - containerBorders - digitWidth) / 2;
            this.setState({ digitWidth, paddingLeft });
        }
    }

    /** @param {number} x Scroll position */
    SetDigitsPosX = (x) => {
        this.scrollX = x;
        SpringAnimation(this.state.animLeft, x).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.firstX = event.nativeEvent.pageX;
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        event.stopPropagation();

        const posX = event.nativeEvent.pageX;
        const delta = (this.firstX - posX) / 2;
        this.newPosX = this.scrollX + delta * this.props.velocity;
        TimingAnimation(this.state.animLeft, this.newPosX, 0).start();
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (this.props.lock) {
            this.SetDigitsPosX(this.scrollX);
            return;
        }

        const { digitWidth } = this.state;
        const { name, stepValue, minValue, maxValue, callback } = this.props;

        let min_index = -1;
        let min_delta = -1;
        for (let i = 0; i <= maxValue / stepValue; i++) {
            const delta = Math.abs(this.newPosX - i * digitWidth);
            if (min_delta == -1 || delta < min_delta) {
                min_index = i;
                min_delta = delta;
            }
        }

        const newIndex = Math.max(min_index, minValue / stepValue);
        this.SetDigitsPosX(newIndex * digitWidth);
        callback(name, newIndex);
    }
}

DigitBack.prototype.props = DigitProps;
DigitBack.defaultProps = DigitProps;

export default DigitBack;
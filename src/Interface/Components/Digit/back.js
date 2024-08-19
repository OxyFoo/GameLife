import * as React from 'react';
import { Animated } from 'react-native';

import { TimingAnimation, SpringAnimation } from 'Utils/Animations';
import { MinMax, Round } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {Object} DigitPropsType
 * @property {StyleViewProp} style
 * @property {number} minDigitWidth
 * @property {ThemeColor | ThemeText} color
 * @property {boolean} lock If true, value can't be changed
 * @property {number} value
 * @property {number} minValue
 * @property {number} maxValue
 * @property {number} stepValue
 * @property {number} velocity Multiplier of the animation speed
 * @property {number} fontSize
 * @property {ThemeColor | ThemeText} fadeColor
 * @property {(index: number) => void} onChangeValue
 */

/** @type {DigitPropsType} */
const DigitProps = {
    style: {},
    minDigitWidth: 0,
    color: 'primary',
    lock: false,
    value: 0,
    minValue: 0,
    maxValue: 6,
    stepValue: 1,
    velocity: 1,
    fontSize: 16,
    fadeColor: 'ground1',
    onChangeValue: () => {}
};

/**
 * Size of digit (width):
 *      component width + 2 * margin
 * Size of total container horizontal padding:
 *      Container size - borders - digit width
 *      46             - 2 * 2   - 28
 * PaddingLeft = (46 - 4 - 28) / 2 = 14 / 2 = 7
 */

class DigitBack extends React.Component {
    /** @type {number} Position of X scroll in pixels */
    scrollX = 0;

    state = {
        containerWidth: 0,
        digitWidth: 0,
        animLeft: new Animated.Value(0)
    };

    componentDidMount() {
        const { value, minValue, maxValue, stepValue } = this.props;

        // Set initial value
        const newValue = MinMax(minValue, value, maxValue);
        const interval = setInterval(() => {
            if (this.state.digitWidth > 0) {
                this.SetDigitsIndex(newValue / stepValue);
                clearInterval(interval);
            }
        }, 200);
    }

    /** @param {DigitPropsType} prevProps */
    componentDidUpdate(prevProps) {
        const { digitWidth } = this.state;
        const { minValue, maxValue, stepValue, onChangeValue } = this.props;

        // If maxValue is decreased, we need to update the position of digits
        if (prevProps.maxValue > maxValue && maxValue / stepValue < this.scrollX / digitWidth) {
            this.SetDigitsIndex(maxValue / stepValue);
            onChangeValue(maxValue / stepValue);
        }

        // If minValue is increased, we need to update the position of digits
        if (prevProps.minValue < minValue && minValue / stepValue > this.scrollX / digitWidth) {
            this.SetDigitsIndex(minValue / stepValue);
            onChangeValue(minValue / stepValue);
        }

        // If value is changed, we need to update the position of digits
        if (prevProps.value !== this.props.value) {
            this.SetDigitsIndex(this.props.value / stepValue);
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        this.setState({ containerWidth: width });
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutDigit = (event) => {
        const { width } = event.nativeEvent.layout;
        if (width > this.state.digitWidth) {
            this.setState({ digitWidth: width });
        }
    };

    /** @param {number} index Scroll position index */
    SetDigitsIndex = (index) => {
        const { digitWidth } = this.state;
        const { minValue, maxValue, stepValue, onChangeValue } = this.props;

        const _min = Math.floor(minValue / stepValue);
        const _max = Math.floor(maxValue / stepValue);
        const _index = MinMax(_min, index, _max);
        const _width = digitWidth + 4;
        this.SetDigitsPosX(_index * _width);
        onChangeValue(_index);
    };

    /** @param {number} posX Scroll position in pixels */
    SetDigitsPosX = (posX) => {
        this.scrollX = posX;
        this.newPosX = posX;
        SpringAnimation(this.state.animLeft, this.scrollX).start();
    };

    firstX = 0;
    newPosX = 0;

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        event.stopPropagation();
        this.firstX = event.nativeEvent.pageX;
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        event.stopPropagation();
        const posX = event.nativeEvent.pageX;
        const delta = (this.firstX - posX) / 2;
        this.newPosX = this.scrollX + delta * this.props.velocity;
        TimingAnimation(this.state.animLeft, this.newPosX, 0).start();
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        const { digitWidth } = this.state;
        const { lock } = this.props;

        if (lock) {
            this.SetDigitsPosX(this.scrollX);
            return;
        }

        const newIndex = Round((this.newPosX + (digitWidth + 4) / 2) / (digitWidth + 4));
        this.SetDigitsIndex(newIndex);
    };
}

DigitBack.prototype.props = DigitProps;
DigitBack.defaultProps = DigitProps;

export default DigitBack;

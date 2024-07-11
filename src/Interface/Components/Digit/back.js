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
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {Object} DigitPropsType
 * @property {StyleViewProp} style
 * @property {number} containerWidth
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
    containerWidth: 46,
    minDigitWidth: 0,
    color: 'primary',
    lock: false,
    value: 0,
    minValue: 0,
    maxValue: 6,
    stepValue: 1,
    velocity: 1,
    fontSize: 16,
    fadeColor: 'background',
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

/**
 * @TODO Disable parent vertical scroll when dragging
 */

class DigitBack extends React.Component {
    /** @type {number} Position of X scroll in pixels */
    scrollX = 0;

    state = {
        paddingLeft: 0,
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
    };

    /** @param {number} index Scroll position index */
    SetDigitsIndex = (index) => {
        const { digitWidth } = this.state;
        const { maxValue, stepValue } = this.props;

        const _index = MinMax(0, index, maxValue / stepValue);
        this.SetDigitsPosX(_index * digitWidth);
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
        if (this.props.lock) {
            this.SetDigitsPosX(this.scrollX);
            return;
        }

        const { digitWidth } = this.state;
        const { stepValue, minValue, maxValue, onChangeValue } = this.props;

        let min_index = -1;
        let min_delta = -1;
        for (let i = 0; i <= maxValue / stepValue; i++) {
            const delta = Math.abs(this.newPosX - i * digitWidth);
            if (min_delta === -1 || delta < min_delta) {
                min_index = i;
                min_delta = delta;
            }
        }

        const newIndex = Math.max(min_index, minValue / stepValue);
        this.SetDigitsIndex(newIndex);
        onChangeValue(newIndex);
    };
}

DigitBack.prototype.props = DigitProps;
DigitBack.defaultProps = DigitProps;

export default DigitBack;

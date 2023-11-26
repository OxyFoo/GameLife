import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { MinMax, Sleep } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const XPBarProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    value: 0,

    /** @type {number} */
    maxValue: 10,

    /** @type {number} */
    supValue: 0,

    /** @type {number} To set the delay of the animation (delay * 200ms) */
    delay: 0
};

class XPBarBack extends React.Component {
    state = {
        width: 0,
        animation: new Animated.Value(0),
        animCover: new Animated.Value(0)
    }

    componentDidMount() {
        setTimeout(this.startAnimations, this.props.delay * 200);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value || prevProps.maxValue !== this.props.maxValue) {
            this.startAnimations();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        this.setState({ width: width });
    }

    startAnimations = async () => {
        const { maxValue } = this.props;
        const value = MinMax(0, this.props.value, maxValue);
        const valueInt = value / maxValue;
        const valueCover = this.props.supValue / maxValue;

        await Sleep(300);
        SpringAnimation(this.state.animation, valueInt).start();
        await Sleep(300);
        SpringAnimation(this.state.animCover, valueCover).start();
    }
}

XPBarBack.prototype.props = XPBarProps;
XPBarBack.defaultProps = XPBarProps;

export default XPBarBack;

import * as React from 'react';
import { Animated } from 'react-native';

import { MinMax, Sleep } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const ProgressBarProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    value: 0,

    /** @type {number} */
    maxValue: 10,

    /** @type {number} */
    supValue: 0,

    /** @type {'gradient' | ThemeColor} */
    color: 'gradient',

    /** @type {number} */
    height: 8,

    /** @type {number} To set the delay of the animation in seconds */
    delay: 0.2
};

class ProgressBarBack extends React.Component {
    state = {
        width: 0,
        animation: new Animated.Value(0),
        animCover: new Animated.Value(0)
    }

    /**
     * @param {ProgressBarProps} nextProps
     * @param {ProgressBarBack['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.value !== this.props.value ||
            nextProps.maxValue !== this.props.maxValue ||
            nextState.width !== this.state.width;
    }

    /** @param {ProgressBarProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value || prevProps.maxValue !== this.props.maxValue) {
            this.startAnimations();
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        this.setState({ width }, () => {
            const time = Math.max(0, this.props.delay * 1000);
            setTimeout(this.startAnimations, time);
        });
    }

    startAnimations = async () => {
        const { value, maxValue, supValue } = this.props;
        const valueInt = MinMax(0, value, maxValue) / maxValue;
        const valueCover = MinMax(0, supValue, maxValue - value) / maxValue;

        await Sleep(300);
        SpringAnimation(this.state.animation, valueInt).start();
        await Sleep(300);
        SpringAnimation(this.state.animCover, valueCover).start();
    }
}

ProgressBarBack.prototype.props = ProgressBarProps;
ProgressBarBack.defaultProps = ProgressBarProps;

export default ProgressBarBack;

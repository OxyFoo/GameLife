import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {Object} SwitchPropsType
 * @property {StyleProp} style
 * @property {number} throttleTime
 * @property {ThemeColor} color
 * @property {boolean} value State of switch component
 * @property {(newValue: boolean) => void} onChangeValue
 */

/** @type {SwitchPropsType} */
const SwitchProps = {
    style: {},
    throttleTime: 250,
    color: 'main1',
    value: false,
    onChangeValue: () => {}
};

class SwitchBack extends React.Component {
    state = {
        animSpring: new Animated.Value(0),
        animLinear: new Animated.Value(0)
    };

    last = 0;

    componentDidMount() {
        if (this.props.value) {
            SpringAnimation(this.state.animSpring, 1).start();
            TimingAnimation(this.state.animLinear, 1).start();
        }
    }

    /** @param {SwitchProps} nextProps */
    shouldComponentUpdate(nextProps) {
        return this.props.value !== nextProps.value || this.props.color !== nextProps.color;
    }

    /** @param {SwitchProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            Animated.parallel([
                SpringAnimation(this.state.animSpring, this.props.value ? 1 : 0),
                TimingAnimation(this.state.animLinear, this.props.value ? 1 : 0)
            ]).start();
        }
    }

    onPress = () => {
        // Throttle the event
        const now = Date.now();
        if (now - this.last < this.props.throttleTime) {
            return;
        }

        this.last = now;
        this.props.onChangeValue(!this.props.value);
    };
}

SwitchBack.prototype.props = SwitchProps;
SwitchBack.defaultProps = SwitchProps;

export default SwitchBack;

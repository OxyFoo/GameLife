import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const SwitchProps = {
    /** @type {StyleProp} Style of switch component */
    style: {},

    /** @type {ThemeColor} */
    color: 'main1',

    /** @type {boolean} State of switch component */
    value: false,

    /** @type {(newValue: boolean) => void} Is called when state change */
    onChangeValue: (value) => {}
};

class SwitchBack extends React.Component {
    state = {
        anim: new Animated.Value(0),
        animBackground: new Animated.Value(0)
    }

    componentDidMount() {
        if (this.props.value) {
            SpringAnimation(this.state.anim, 1).start();
            TimingAnimation(this.state.animBackground, 1).start();
        }
    }

    /** @param {SwitchProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            SpringAnimation(this.state.anim, this.props.value ? 1 : 0).start();
            TimingAnimation(this.state.animBackground, this.props.value ? 1 : 0).start();
        }
    }

    onPress = () => {
        this.props.onChangeValue(!this.props.value);
    }
}

SwitchBack.prototype.props = SwitchProps;
SwitchBack.defaultProps = SwitchProps;

export default SwitchBack;

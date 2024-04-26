import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const CheckBoxProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ThemeColor} */
    color: 'main1',

    /** @type {boolean} */
    value: false,

    /** @type {(newValue: boolean) => void} Event called when checkbox is pressed */
    onChangeValue: () => {}
};

class CheckBoxBack extends React.Component {
    state = {
        anim: new Animated.Value(0)
    }

    componentDidMount() {
        if (this.props.value) {
            SpringAnimation(this.state.anim, 1).start();
        }
    }

    /** @param {CheckBoxProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            const newValue = this.props.value ? 1 : 0;
            SpringAnimation(this.state.anim, newValue).start();
        }
    }

    onPress = () => {
        this.props.onChangeValue(!this.props.value);
    }
}

CheckBoxBack.prototype.props = CheckBoxProps;
CheckBoxBack.defaultProps = CheckBoxProps;

export default CheckBoxBack;

import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {Object} CheckBoxPropsType
 * @property {StyleProp} style
 * @property {number} throttleTime Time in ms to throttle the press event
 * @property {ThemeColor} color
 * @property {boolean} value
 * @property {(newValue: boolean) => void} onChangeValue Event called when checkbox is pressed
 */

/** @type {CheckBoxPropsType} */
const CheckBoxProps = {
    style: {},
    throttleTime: 250,
    color: 'main1',
    value: false,
    onChangeValue: () => {}
};

class CheckBoxBack extends React.Component {
    state = {
        anim: new Animated.Value(0)
    };

    last = 0;

    componentDidMount() {
        if (this.props.value) {
            SpringAnimation(this.state.anim, 1).start();
        }
    }

    /** @param {CheckBoxPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return nextProps.value !== this.props.value || nextProps.color !== this.props.color;
    }

    /** @param {CheckBoxPropsType} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            const newValue = this.props.value ? 1 : 0;
            SpringAnimation(this.state.anim, newValue).start();
        }
    }

    onPress = () => {
        // Throttle the press event
        if (Date.now() - this.last < this.props.throttleTime) {
            return;
        }

        this.last = Date.now();
        this.props.onChangeValue(!this.props.value);
    };
}

CheckBoxBack.prototype.props = CheckBoxProps;
CheckBoxBack.defaultProps = CheckBoxProps;

export default CheckBoxBack;

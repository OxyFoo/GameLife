import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const CheckboxProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ThemeColor} */
    color: 'main1',

    /** @type {boolean} */
    checked: false,

    /** @type {() => void} Event called when checkbox is pressed */
    onChange: null
};

class CheckboxBack extends React.Component {
    isChecked = false;

    state = {
        animScale: new Animated.Value(0)
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        return this.update();
    }

    update = () => {
        if (this.props.checked === this.isChecked) {
            return false;
        }

        this.isChecked = this.props.checked;
        const newValue = this.props.checked ? 1 : 0;
        SpringAnimation(this.state.animScale, newValue).start();
        return true;
    }

    onPress = () => {
        if (typeof(this.props.onChange) === 'function') {
            this.props.onChange();
        }
    }
}

CheckboxBack.prototype.props = CheckboxProps;
CheckboxBack.defaultProps = CheckboxProps;

export default CheckboxBack;

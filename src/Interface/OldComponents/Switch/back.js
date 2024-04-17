import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';

const SwitchProps = {
    /** @type {boolean} State of switch component */
    value: false,

    /** @type {(value: boolean) => void} Is called when state change */
    onValueChanged: (value) => {}
};

class SwitchBack extends React.Component {
    state = {
        anim: new Animated.Value(0)
    }

    componentDidMount() {
        if (this.props.value) {
            SpringAnimation(this.state.anim, 28).start();
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            SpringAnimation(this.state.anim, this.props.value ? 28 : 0).start();
        }
    }

    onPress = () => {
        const newVal = !this.props.value;
        this.props.onValueChanged(newVal);
        SpringAnimation(this.state.anim, newVal ? 28 : 0).start();
    }
}

SwitchBack.prototype.props = SwitchProps;
SwitchBack.defaultProps = SwitchProps;

export default SwitchBack;

import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Button from './Button';
import { SpringAnimation } from '../../Utils/Animations';

const SwitchProps = {
    /** @type {boolean} State of switch component */
    value: false,

    /** @type {Function} Is called when state change */
    onValueChanged: (value) => {}
}

class Switch extends React.Component {
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

    render() {
        const color = this.props.value ? themeManager.GetColor('main1') : themeManager.GetColor('backgroundCard');

        const barStyle = [ styles.bar, {
            borderColor: color,
            backgroundColor: themeManager.GetColor('background')
        } ];
        const btnStyle = [ styles.circle, {
            backgroundColor: color, transform: [{ translateX: this.state.anim }]
        } ];

        return (
            <View>
                <View style={barStyle} onTouchStart={this.onPress} />
                <Button styleAnimation={btnStyle} color='main1' onPress={this.onPress} />
            </View>
        );
    }
}

Switch.prototype.props = SwitchProps;
Switch.defaultProps = SwitchProps;

const styles = StyleSheet.create({
    circle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 28,
        height: 'auto',
        paddingHorizontal: 0,
        aspectRatio: 1,
        borderRadius: 48
    },
    bar: {
        width: 56,
        height: 28,
        borderRadius: 14,
        borderWidth: 1
    }
});

export default Switch;
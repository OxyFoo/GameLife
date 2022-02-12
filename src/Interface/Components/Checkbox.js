import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Icon from './Icon';
import { SpringAnimation } from '../../Utils/Animations';

const CheckboxProps = {
    color: 'main1',
    style: {},
    checked: false,
    onChange: undefined
}

class Checkbox extends React.Component {
    state = {
        animScale: new Animated.Value(0)
    }

    componentDidUpdate() {
        const newValue = this.props.checked ? 1 : 0;
        SpringAnimation(this.state.animScale, newValue).start();
    }

    onPress = () => {
        if (typeof(this.props.onChange) === 'function') {
            this.props.onChange();
        }
    }

    render() {
        const activeColor = themeManager.GetColor(this.props.color);
        const emptyColor = themeManager.GetColor('border');

        return (
            <View style={this.props.style}>
                <Icon onPress={this.onPress} icon={'checkboxOff'} color={emptyColor} />
                <Animated.View style={[styles.check, { transform: [{ scale: this.state.animScale }] }]} pointerEvents={'none'}>
                    <Icon icon={'checkboxOn'} color={activeColor}></Icon>
                </Animated.View>
            </View>
        );
    }
}

Checkbox.prototype.props = CheckboxProps;
Checkbox.defaultProps = CheckboxProps;

const styles = StyleSheet.create({
    check: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export default Checkbox;
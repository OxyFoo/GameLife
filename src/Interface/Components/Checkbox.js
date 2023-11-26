import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import Icon from './Icon';
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

class Checkbox extends React.Component {
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

    render() {
        const styleCheck = {
            transform: [{ scale: this.state.animScale }]
        };

        return (
            <View style={this.props.style}>
                <Icon onPress={this.onPress} icon={'checkboxOff'} color={'border'} />
                <Animated.View style={[styles.check, styleCheck]} pointerEvents={'none'}>
                    <Icon icon={'checkboxOn'} color={this.props.color}></Icon>
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

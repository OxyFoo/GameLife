import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import CheckboxBack from './back';

import Icon from '../Icon';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

class Checkbox extends CheckboxBack {
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

const styles = StyleSheet.create({
    check: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export default Checkbox;

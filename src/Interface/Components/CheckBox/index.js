import * as React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

import CheckBoxBack from './back';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class CheckBox extends CheckBoxBack {
    render() {
        const { color } = this.props;

        /** @type {ViewStyle} */
        const checkStyle = {
            transform: [{ scale: this.state.anim }],
            backgroundColor: themeManager.GetColor(color)
        };

        /** @type {ViewStyle} */
        const borderColorStyle = {
            borderColor: themeManager.GetColor(color)
        };

        return (
            <TouchableOpacity
                style={[styles.parent, borderColorStyle, this.props.style]}
                onPress={this.onPress}
                activeOpacity={0.6}
            >
                <Animated.View style={[styles.check, checkStyle]} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        width: 28,
        aspectRatio: 1,
        padding: 5,
        borderWidth: 2,
        borderRadius: 8
    },
    check: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 3
    }
});

export { CheckBox };

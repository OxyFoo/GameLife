import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const SeparatorProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ThemeColor} */
    color: 'white'
};

class Separator {
    static Horizontal(props) {
        const background = { backgroundColor: themeManager.GetColor(props.color) };
        return (
            <View style={[styles.horizontal, background, props.style]} />
        );
    }

    static Vertical(props) {
        const background = { backgroundColor: themeManager.GetColor(props.color) };
        return (
            <View style={[styles.vertical, background, props.style]} />
        );
    }
}

Separator.Horizontal.prototype.props = SeparatorProps;
Separator.Horizontal.defaultProps = SeparatorProps;

Separator.Vertical.prototype.props = SeparatorProps;
Separator.Vertical.defaultProps = SeparatorProps;

const styles = StyleSheet.create({
    horizontal: { width: '100%', height: 1 },
    vertical: { width: 1, height: '100%' },
});

export default Separator;

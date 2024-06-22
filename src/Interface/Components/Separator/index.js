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
    color: 'white',

    /** @type {boolean} */
    vertical: false
};

class Separator extends React.Component {
    render() {
        const { style, color, vertical } = this.props;

        const background = { backgroundColor: themeManager.GetColor(color) };

        if (vertical) {
            return <View style={[styles.vertical, background, style]} />;
        }

        // Horizontal
        return <View style={[styles.horizontal, background, style]} />;
    }
}

Separator.prototype.props = SeparatorProps;
Separator.defaultProps = SeparatorProps;

const styles = StyleSheet.create({
    horizontal: {
        width: '100%',
        height: 1
    },
    vertical: {
        width: 1,
        height: '100%'
    }
});

export { Separator };

import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

/**
 * @param {Object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {StyleViewProp} [param0.containerStyle]
 * @param {string[]} [param0.colors]
 * @param {number} [param0.angle]
 * @param {React.ReactNode} [param0.children]
 * @returns {JSX.Element}
 */

function Gradient({ style, containerStyle, colors, angle, children }) {
    return (
        <LinearGradient
            style={containerStyle}
            colors={colors ?? [themeManager.GetColor('main3'), themeManager.GetColor('main2')]}
            useAngle={true}
            angle={angle ?? 267}
        >
            <View style={style}>{children}</View>
        </LinearGradient>
    );
}

export { Gradient };

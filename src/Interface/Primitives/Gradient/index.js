import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

/**
 * @param {Object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {string[]} [param0.colors]
 * @param {number} [param0.angle]
 * @param {React.ReactNode} [param0.children]
 * @returns {JSX.Element}
 */

function Gradient({ style, colors, angle, children }) {
    return (
        <LinearGradient
            style={style}
            colors={colors ?? [themeManager.GetColor('main3'), themeManager.GetColor('main2')]}
            useAngle={true}
            angle={angle ?? 267}
            children={children}
        />
    );
}

export { Gradient };

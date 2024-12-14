import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';

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
            colors={colors ?? ['#8CF7FF', '#DBA1FF']}
            useAngle={true}
            angle={angle ?? 267}
            children={children}
        />
    );
}

export { Gradient };

import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

/**
 * @param {Object} param0
 * @param {StyleViewProp} param0.style
 * @returns {JSX.Element}
 */

function Gradient({ style }) {
    return <LinearGradient style={style} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={267} />;
}

export { Gradient };

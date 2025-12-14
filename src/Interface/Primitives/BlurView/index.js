import * as React from 'react';
import { View, Platform, requireNativeComponent } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

/**
 * @typedef {object} BlurViewProps
 * @property {StyleProp} [style] - Style for the blur view
 * @property {number} [blurAmount=10] - Blur intensity (iOS only)
 * @property {'light' | 'dark' | 'xlight'} [blurType='dark'] - Blur type (iOS only)
 * @property {string} [fallbackColor='rgba(0, 0, 0, 0.5)'] - Fallback color for Android
 * @property {React.ReactNode} [children] - Children components
 */

/**
 * Cross-platform BlurView component
 * - iOS: Uses native UIVisualEffectView for real blur
 * - Android: Falls back to semi-transparent View
 *
 * @param {BlurViewProps} props
 * @returns {React.ReactElement}
 */
function BlurView({ style, blurAmount = 10, blurType = 'dark', fallbackColor, children }) {
    if (Platform.OS === 'ios') {
        // Use native iOS blur
        const NativeBlurView = requireNativeComponent('BlurView');
        return (
            <NativeBlurView style={style} blurAmount={blurAmount} blurType={blurType}>
                {children}
            </NativeBlurView>
        );
    }

    // Android fallback: semi-transparent view
    const androidFallbackColor = fallbackColor || 'rgba(16, 20, 36, 0.75)';

    return <View style={[style, { backgroundColor: androidFallbackColor }]}>{children}</View>;
}

export { BlurView };

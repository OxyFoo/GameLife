import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native-linear-gradient').LinearGradientProps} LinearGradientProps
 */

/**
 * A view with a linear gradient background. Same API as `LinearGradient`, but the children live in
 * a plain `View` and the gradient is only a background layer: with the new architecture on iOS,
 * `BVLinearGradient` breaks the measurement of the texts it contains (they are laid out shorter and
 * narrower than they render, so their last line or character gets clipped). Never put children
 * directly inside a `LinearGradient` — wrap them here instead.
 */

/** The gradient layer hugs the corners of the container */
const RADIUS_KEYS = /** @type {const} */ ([
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius'
]);

/**
 * @param {LinearGradientProps} props
 * @returns {React.JSX.Element}
 */
function GradientView({ style, colors, start, end, locations, useAngle, angle, children, ...viewProps }) {
    const flatStyle = StyleSheet.flatten(style) ?? {};

    /** @type {ViewStyle} */
    const radiusStyle = {};
    for (const key of RADIUS_KEYS) {
        if (typeof flatStyle[key] === 'number') {
            radiusStyle[key] = flatStyle[key];
        }
    }

    return (
        <View style={style} {...viewProps}>
            <LinearGradient
                style={[StyleSheet.absoluteFill, radiusStyle]}
                pointerEvents='none'
                colors={colors}
                start={start}
                end={end}
                locations={locations}
                useAngle={useAngle}
                angle={angle}
            />
            {children}
        </View>
    );
}

export { GradientView };

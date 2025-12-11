import * as React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {object} AreaInsets
 * @property {number} top
 * @property {number} left
 * @property {number} right
 * @property {number} bottom
 *
 * @typedef {object} ResponsiveSettings
 * @property {number} scale - Scale factor for responsive design
 * @property {number} paddingVertical - Vertical padding for responsive design
 * @property {number} paddingHorizontal - Horizontal padding for responsive design
 */

/** @type {ResponsiveSettings} */
const DEFAULT_responsive = {
    scale: 1,
    paddingVertical: 0,
    paddingHorizontal: 0
};

/**
 * @param {object} props
 * @param {string} [props.testID]
 * @param {StyleProp} [props.style]
 * @param {React.ReactNode} props.children
 * @param {(event: LayoutChangeEvent) => void} [props.onLayout]
 * @param {ResponsiveSettings} [props.customResponsive] - Custom responsive settings
 * @returns {React.ReactNode}
 */
const DynamicArea = ({ testID, style, children, onLayout, customResponsive }) => {
    const responsive = { ...DEFAULT_responsive, ...customResponsive };
    const neededOffset =
        responsive.scale !== 1 || responsive.paddingVertical !== 0 || responsive.paddingHorizontal !== 0;
    const insets = useSafeAreaInsets();

    /** @type {StyleProp} */
    let offsetStyle = {
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom
    };

    if (neededOffset) {
        const screenSize = Dimensions.get('window');
        const responsiveOffsetHalf = (100 - 100 / responsive.scale) / 2;
        offsetStyle = {
            paddingTop: responsive.paddingVertical + insets.top,
            paddingBottom: responsive.paddingVertical + insets.bottom,
            paddingLeft: responsive.paddingHorizontal + insets.left,
            paddingRight: responsive.paddingHorizontal + insets.right,
            width: `${100 / responsive.scale}%`,
            height: `${100 / responsive.scale}%`,
            transform: [
                { translateX: (responsiveOffsetHalf * screenSize.width) / 100 },
                {
                    translateY:
                        (responsiveOffsetHalf * screenSize.height) / 100 +
                        (responsive.scale < 1 ? 24 * (1 - responsive.scale) : -8 * (responsive.scale - 1)) // TODO: Offset needed ?
                },
                { scale: responsive.scale }
            ]
        };
    }

    return (
        <View testID={testID} style={[styles.safeView, offsetStyle, style]} onLayout={onLayout} children={children} />
    );
};

const styles = StyleSheet.create({
    safeView: {
        width: '100%',
        height: '100%'
    }
});

export default DynamicArea;

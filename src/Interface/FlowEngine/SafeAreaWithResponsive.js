import * as React from 'react';
import { SafeAreaView, Dimensions, StyleSheet } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {object} ResponsiveSettings
 * @property {number} scale - Scale factor for responsive design
 * @property {number} paddingVertical - Vertical padding for responsive design
 * @property {number} paddingHorizontal - Horizontal padding for responsive design
 *
 * @typedef {object} SafeAreaInsets
 * @property {number} top - Top inset
 * @property {number} left - Left inset
 * @property {number} right - Right inset
 * @property {number} bottom - Bottom inset
 */

/** @type {ResponsiveSettings} */
const DEFAULT_responsive = {
    scale: 1,
    paddingVertical: 0,
    paddingHorizontal: 0
};

/** @type {SafeAreaInsets} */
const DEFAULT_insets = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
};

/**
 * @param {object} props
 * @param {string} [props.testID]
 * @param {StyleProp} [props.style]
 * @param {JSX.Element} props.children
 * @param {(event: LayoutChangeEvent) => void} [props.onLayout]
 * @param {ResponsiveSettings} [props.customResponsive] - Custom responsive settings
 * @param {SafeAreaInsets} [props.insets] - Safe area insets, automatically detected if not provided
 * @returns {JSX.Element}
 */
const SafeAreaWithResponsive = ({ testID, style, children, onLayout, customResponsive, insets }) => {
    const responsive = { ...DEFAULT_responsive, ...customResponsive };
    const finalInsets = { ...DEFAULT_insets, ...insets };
    const neededOffset =
        responsive.scale !== 1 || responsive.paddingVertical !== 0 || responsive.paddingHorizontal !== 0;

    /** @type {StyleProp} */
    let offsetStyle = {
        paddingTop: finalInsets.top,
        paddingBottom: finalInsets.bottom,
        paddingLeft: finalInsets.left,
        paddingRight: finalInsets.right
    };

    if (neededOffset) {
        const screenSize = Dimensions.get('window');
        const responsiveOffsetHalf = (100 - 100 / responsive.scale) / 2;
        offsetStyle = {
            paddingTop: responsive.paddingVertical + finalInsets.top,
            paddingBottom: responsive.paddingVertical + finalInsets.bottom,
            paddingLeft: responsive.paddingHorizontal + finalInsets.left,
            paddingRight: responsive.paddingHorizontal + finalInsets.right,
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
        <SafeAreaView
            style={[styles.safeView, style, offsetStyle]}
            testID={testID}
            onLayout={onLayout}
            children={children}
        />
    );
};

const styles = StyleSheet.create({
    safeView: {
        width: '100%',
        height: '100%'
        // backgroundColor: '#000000'
    }
});

export default SafeAreaWithResponsive;

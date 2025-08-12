import * as React from 'react';
import { SafeAreaView, Dimensions, StyleSheet, Platform } from 'react-native';
import SafeArea from 'react-native-safe-area';
import SafeAreaNative, { DEFAULT_INSETS } from 'Utils/SafeAreaNative';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Utils/SafeAreaNative').SafeAreaInsets} SafeAreaInsets
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
 * @param {JSX.Element} props.children
 * @param {(event: LayoutChangeEvent) => void} [props.onLayout]
 * @param {ResponsiveSettings} [props.customResponsive] - Custom responsive settings
 * @param {SafeAreaInsets} [props.customInsets] - Safe area insets, automatically detected if not provided
 * @returns {JSX.Element}
 */
const SafeAreaWithResponsive = ({ testID, style, children, onLayout, customResponsive, customInsets }) => {
    const [nativeInsets, setNativeInsets] = React.useState(DEFAULT_INSETS);

    React.useEffect(() => {
        // Get native insets
        if (Platform.OS === 'android' && SafeAreaNative.isAvailable()) {
            SafeAreaNative.getSafeAreaInsets()
                .then((detailedInsets) => {
                    console.log('Native Safe Area Insets:', detailedInsets);
                    setNativeInsets({
                        top: detailedInsets.top,
                        left: detailedInsets.left,
                        right: detailedInsets.right,
                        bottom: detailedInsets.bottom
                    });
                })
                .catch((error) => {
                    console.warn('Failed to get native insets:', error);
                });
        }

        // Fallback to the old method for iOS or if the native module is not available
        else {
            SafeArea.getSafeAreaInsetsForRootView().then((fallbackInsets) => {
                setNativeInsets(fallbackInsets.safeAreaInsets);
            });
        }
    }, [customInsets]);

    const insets = { ...nativeInsets, ...customInsets };
    const responsive = { ...DEFAULT_responsive, ...customResponsive };
    const neededOffset =
        responsive.scale !== 1 || responsive.paddingVertical !== 0 || responsive.paddingHorizontal !== 0;

    /** @type {StyleProp} */
    let offsetStyle = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
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

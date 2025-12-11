import * as React from 'react';
import { Animated, Text as RNText, TouchableOpacity, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

const MAIN_FONT_NAME = 'Hind Vadodara';

/**
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle | TextStyle>} TextStyleProp
 * @typedef {import('react-native').Animated.AnimatedProps<TextStyle>} AnimatedTextStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import('react-native').TextProps} TextProps
 * @typedef {import('react-native').StyleProp<TextStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {Object} TextPropsType
 * @property {TextStyleProp} style
 * @property {AnimatedTextStyle} [animatedStyle]
 * @property {ViewStyleProp} containerStyle Style of touchable opacity for onPress text
 * @property {number} fontSize
 * @property {ThemeColor | ThemeText} color
 * @property {boolean} bold
 * @property {'300' | '400' | '500' | '600' | '700'} [fontWeight] Custom font weight (Light=300, Regular=400, Medium=500, SemiBold=600, Bold=700)
 */

const AnimatedRNText = Animated.createAnimatedComponent(RNText);

/** @type {TextProps & TextPropsType} */
const TextProps = {
    style: {},
    animatedStyle: undefined,
    containerStyle: {},
    fontSize: 18,
    color: 'primary',
    bold: false,
    fontWeight: undefined
};

class Text extends React.Component {
    /** @param {TextProps & TextPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            this.props.style !== nextProps.style ||
            this.props.animatedStyle !== nextProps.animatedStyle ||
            this.props.children !== nextProps.children ||
            this.props.color !== nextProps.color ||
            this.props.fontSize !== nextProps.fontSize ||
            this.props.fontWeight !== nextProps.fontWeight ||
            this.props.onPress !== nextProps.onPress
        );
    }

    render() {
        const { style, animatedStyle, containerStyle, color, fontSize, onPress, children, bold, fontWeight, ...props } =
            this.props;

        /** @type {StyleProp} */
        const fontStyle = {
            fontSize,
            fontFamily: MAIN_FONT_NAME,
            fontWeight: fontWeight || (bold ? '700' : '400'),
            color: typeof color === 'string' ? themeManager.GetColor(color) : color
        };

        let component = animatedStyle ? (
            <AnimatedRNText style={[styles.text, fontStyle, style, animatedStyle]} {...props}>
                {children}
            </AnimatedRNText>
        ) : (
            <RNText style={[styles.text, fontStyle, style]} {...props}>
                {children}
            </RNText>
        );

        if (onPress) {
            component = (
                <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.5}>
                    {component}
                </TouchableOpacity>
            );
        }

        return component;
    }
}

Text.prototype.props = TextProps;
Text.defaultProps = TextProps;

const styles = StyleSheet.create({
    text: {
        margin: 0,
        padding: 0,
        textAlign: 'center'
    }
});

export { Text, MAIN_FONT_NAME };

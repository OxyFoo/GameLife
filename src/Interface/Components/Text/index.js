import * as React from 'react';
import { Animated, Text as RNText, TouchableOpacity, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

const MAIN_FONT_NAME = 'Hind Vadodara';

/**
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').Animated.AnimatedProps<TextStyle>} AnimatedTextStyle
 * @typedef {import('react-native').StyleProp<ViewStyle | TextStyle | AnimatedTextStyle>} TextStyleProp
 * @typedef {import('react-native').StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import('react-native').TextProps} TextProps
 * @typedef {import('react-native').StyleProp<TextStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {Object} TextPropsType
 * @property {TextStyleProp} style
 * @property {ViewStyleProp} containerStyle Style of touchable opacity for onPress text
 * @property {number} fontSize
 * @property {ThemeColor | ThemeText} color
 * @property {boolean} animated
 */

const AnimatedRNText = Animated.createAnimatedComponent(RNText);

/** @type {TextProps & TextPropsType} */
const TextProps = {
    style: {},
    containerStyle: {},
    fontSize: 18,
    color: 'primary',
    animated: false
};

class Text extends React.Component {
    /** @param {TextProps & TextPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return (
            this.props.style !== nextProps.style ||
            this.props.children !== nextProps.children ||
            this.props.color !== nextProps.color ||
            this.props.fontSize !== nextProps.fontSize ||
            this.props.animated !== nextProps.animated ||
            this.props.onPress !== nextProps.onPress
        );
    }

    render() {
        const { style, animated, containerStyle, color, fontSize, onPress, children, ...props } = this.props;

        /** @type {StyleProp} */
        const basicColor = {
            fontSize,
            color: typeof color === 'string' ? themeManager.GetColor(color) : color
        };

        const RawText = animated ? AnimatedRNText : RNText;
        let component = (
            <RawText style={[styles.text, basicColor, style]} {...props}>
                {children}
            </RawText>
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
        textAlign: 'center',
        fontFamily: MAIN_FONT_NAME
    }
});

export { Text, MAIN_FONT_NAME };

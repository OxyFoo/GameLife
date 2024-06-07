import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';

import themeManager from 'Managers/ThemeManager';

const MAIN_FONT_NAME = 'Hind Vadodara';

/**
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle | TextStyle>} TextStyleProp
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
 */

/** @type {TextProps & TextPropsType} */
const TextProps = {
    style: {},
    containerStyle: {},
    fontSize: 18,
    color: 'primary'
};

class Text extends React.Component {
    /** @param {TextProps & TextPropsType} nextProps */
    shouldComponentUpdate(nextProps) {
        return this.props.children !== nextProps.children ||
            this.props.color !== nextProps.color ||
            this.props.fontSize !== nextProps.fontSize;
    }

    render() {
        const {
            style, containerStyle, color, fontSize, onPress, children, ...props
        } = this.props;

        if (typeof children !== 'string') {
            return null;
        }

        /** @type {StyleProp} */
        const textStyle = {
            ...styles.text,
            color: themeManager.GetColor(color),
            fontSize: fontSize
        };

        if (!!onPress) {
            return (
                <TouchableOpacity
                    style={containerStyle}
                    onPress={onPress}
                    activeOpacity={.5}
                >
                    <RNText style={[textStyle, style]} {...props}>
                        {children}
                    </RNText>
                </TouchableOpacity>
            );
        }

        return (
            <RNText style={[textStyle, style]} {...props}>
                {children}
            </RNText>
        );
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

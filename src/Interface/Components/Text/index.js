import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';

import themeManager from 'Managers/ThemeManager';

const MAIN_FONT_NAME = 'Hind Vadodara';

/**
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle | TextStyle>} TextStyleProp
 * @typedef {import('react-native').StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

const TextProps = {
    /** @type {string | JSX.Element | null} */
    children: null,

    /** @type {TextStyleProp} */
    style: {},
    
    /** @type {ViewStyleProp} Style of touchable opacity for onPress text */
    containerStyle: {},

    /** @type {number} */
    fontSize: 18,

    /** @type {ThemeColor | ThemeText} */
    color: 'primary',

    /** @type {((event: GestureResponderEvent) => void) | null} */
    onPress: null,

    /** @type {boolean} */
    bold: false
};

class Text extends React.Component {
    render() {
        const {
            style, containerStyle, color, onPress, fontSize, bold, children
        } = this.props;
        const _color = themeManager.GetColor(color);

        if (typeof children !== 'string') {
            return null;
        }

        if (onPress !== null) {
            return (
                <TouchableOpacity
                    style={containerStyle}
                    onPress={onPress}
                    activeOpacity={.5}
                    disabled={onPress === null}
                >
                    <RNText
                        style={[
                            styles.text,
                            {
                                color: _color,
                                fontSize: fontSize,
                                fontWeight: this.props.bold ? 'bold' : 'normal'
                            },
                            style
                        ]}
                    >
                        {children}
                    </RNText>
                </TouchableOpacity>
            );
        }

        return (
            <RNText
                style={[
                    styles.text,
                    {
                        color: _color,
                        fontSize: fontSize,
                        fontWeight: this.props.bold ? 'bold' : 'normal'
                    },
                    style
                ]}
            >
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

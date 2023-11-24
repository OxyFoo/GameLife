import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';

import themeManager from 'Managers/ThemeManager';

const MAIN_FONT_NAME = 'Hind Vadodara';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').TextStyle} TextStyle
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle|TextStyle>} TextStyleProp
 * @typedef {import('react-native').StyleProp<ViewStyle>} ViewStyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const TextProps = {
    /** @type {string|JSX.Element|null} */
    children: null,

    /** @type {TextStyleProp} */
    style: {},
    
    /** @type {ViewStyleProp} */
    containerStyle: {},

    /** @type {number} */
    fontSize: 18,

    /** @type {ColorTheme|ColorThemeText} */
    color: 'primary',

    /** @type {(event: GestureResponderEvent) => void|null} */
    onPress: null,

    /** @type {(event: LayoutChangeEvent) => void} */
    onLayout: (event) => {},

    /** @type {boolean} */
    bold: false,

    /** @type {number?} */
    numberOfLines: undefined
};

class Text extends React.Component {
    render() {
        const onPress = this.props.onPress;
        const color = themeManager.GetColor(this.props.color);

        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                onPress={onPress}
                activeOpacity={.5}
                disabled={onPress === null}
            >
                <RNText
                    numberOfLines={this.props.numberOfLines}
                    style={[
                        styles.text,
                        {
                            color: color,
                            fontSize: this.props.fontSize,
                            fontWeight: this.props.bold ? 'bold' : 'normal'
                        },
                        this.props.style
                    ]}
                    onLayout={this.props.onLayout}
                >
                    {this.props.children}
                </RNText>
            </TouchableOpacity>
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

export default Text;
export { MAIN_FONT_NAME };

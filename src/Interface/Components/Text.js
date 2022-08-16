import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';
import { StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import { IsUndefined } from '../../Utils/Functions';

const MAIN_FONT_NAME = 'Hind Vadodara';

/**
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const TextProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},
    
    /** @type {StyleProp<ViewStyle>} */
    containerStyle: {},

    /** @type {number} */
    fontSize: 18,

    /** @type {ColorTheme|ColorThemeText} */
    color: 'primary',

    /** @type {Function?} */
    onPress: undefined,

    /** @type {LayoutChangeEvent?} */
    onLayout: undefined,

    bold: undefined,

    numberOfLines: undefined
}

class Text extends React.Component {
    render() {
        const onPress = this.props.onPress;
        const color = themeManager.GetColor(this.props.color);

        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                onPress={onPress}
                activeOpacity={.5}
                disabled={IsUndefined(onPress)}
            >
                <RNText
                    numberOfLines={this.props.numberOfLines}
                    style={[
                        styles.text,
                        {
                            color: color,
                            fontSize: this.props.fontSize,
                            fontWeight: IsUndefined(this.props.bold) ? 'normal' : 'bold'
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
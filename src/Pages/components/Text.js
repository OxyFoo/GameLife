import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

const MAIN_FONT_NAME = 'Hind Vadodara';

function Text(props) {
    let opacity = 1;

    const COLORS = themeManager.colors['text'];
    let color = props.color;
    if (typeof(color) === 'undefined' || !COLORS.hasOwnProperty(color)) {
        if (color === 'transparent') {
            opacity = 0;
        }
        color = 'main';
    }

    let output = (
        <RNText
            style={[
                styles.text, props.style, {
                    color: COLORS[color],
                    opacity: opacity
                }
            ]}
        >
            {props.children}
        </RNText>
    )

    const onPress = props.onPress;
    return typeof(onPress) !== 'undefined' ? (
        <TouchableOpacity activeOpacity={.5} onPress={onPress} style={props.containerStyle}>
            {output}
        </TouchableOpacity>
    ) : (output);
}

const styles = StyleSheet.create({
    text: {
        margin: 0,
        padding: 0,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: MAIN_FONT_NAME
    }
});

export default Text;
export { MAIN_FONT_NAME };
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import user from '../../../../Managers/UserManager';

const MAIN_FONT_NAME = 'Quantum';
const COLORS = {
    'main': '#ECECEC',
    'secondary': '#C2C2C2',
    'dark': '#808080'
}

function GLText(props) {
    const title = props.title;
    const value = props.value;
    const onPress = props.onPress;
    
    let opacity = 1;
    let color = props.color;
    const COLORS = user.themeManager.colors['text'];
    if (typeof(color) === 'undefined' || !COLORS.hasOwnProperty(color)) {
        if (color === 'transparent') {
            opacity = 0;
        }
        color = 'main';
    }

    let output = typeof(value) !== 'undefined' ? (
        <View style={[styles.row, props.style]}>
            <Text style={[styles.titleLeft, props.styleText, { color: COLORS['secondary'] }]}>{title}</Text>
            <Text style={[styles.valueRight, props.styleText, { color: COLORS['main'] }]}>{value}</Text>
        </View>
    ) : (
        <Text style={[ styles.text, props.style, { color: COLORS[color], opacity: opacity } ]}>{title}</Text>
    )

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
    },
    row: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleLeft: {
        color: COLORS.main,
        fontSize: 24,
        fontFamily: MAIN_FONT_NAME
    },
    valueRight: {
        color: COLORS.secondary,
        fontSize: 24,
        fontFamily: MAIN_FONT_NAME
    }
});

export default GLText;
export { MAIN_FONT_NAME };
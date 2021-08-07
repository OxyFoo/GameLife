import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAIN_FONT_NAME = 'Laffayette Comic Pro';

function GLText(props) {
    const title = props.title;
    const value = props.value;
    const onPress = props.onPress;
    const icon = props.icon;

    let output = typeof(value) !== 'undefined' ? (
        <View style={[Style.row, props.style]}>
            <Text style={[Style.titleLeft, props.styleText]}>{title}</Text>
            <Text style={[Style.valueRight, props.styleText]}>{value}</Text>
        </View>
    ) : (
        <Text style={[ Style.text, props.style ]}>{title}</Text>
    )

    return typeof(onPress) !== 'undefined' ? (
        <TouchableOpacity activeOpacity={.5} onPress={onPress}>
            {output}
        </TouchableOpacity>
    ) : (output);
}

const Style = StyleSheet.create({
    text: {
        textAlign: 'center',

        padding: 12,
        
        color: '#CAE6F4',
        fontSize: 18,
        fontFamily: MAIN_FONT_NAME
    },
    row: {
        paddingVertical: 6,
        paddingHorizontal: 24,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleLeft: {
        color: '#CAE6F4',
        fontSize: 24,
        fontFamily: MAIN_FONT_NAME
    },
    valueRight: {
        color: '#CAE6F4',
        fontSize: 24,
        fontFamily: MAIN_FONT_NAME
    }
});

export default GLText;
export { MAIN_FONT_NAME };
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function GLText(props) {
    const title = props.title;
    const value = props.value;

    return typeof(value) !== 'undefined' ? (
        <View style={[Style.row, props.style]}>
            <Text style={Style.titleLeft}>{title}</Text>
            <Text style={Style.valueRight}>{value}</Text>
        </View>
    ) : (
        <Text style={[ Style.text, props.style ]}>{title}</Text>
    )
}

const Style = StyleSheet.create({
    text: {
        textAlign: 'center',

        padding: 12,
        
        color: '#CAE6F4',
        fontSize: 18,
        fontFamily: "SquareFont"
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
        fontFamily: "SquareFont"
    },
    valueRight: {
        color: '#CAE6F4',
        fontSize: 24,
        fontFamily: "SquareFont"
    }
});

export default GLText;
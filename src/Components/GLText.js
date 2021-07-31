import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

function GLText(props) {
    const title = props.title;
    const style = [ Style.text, props.style ];

    return (
        <Text style={style}>{title}</Text>
    )
}

const Style = StyleSheet.create({
    text: {
        textAlign: 'center',

        padding: 12,

        color: '#fff',
        fontSize: 18,
        fontFamily: "Square"
    }
});

export default GLText;
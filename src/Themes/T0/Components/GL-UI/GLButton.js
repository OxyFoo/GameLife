import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import GLText from './GLText';

function GLButton(props) {
    const value = props.value;
    const onPress = props.onPress;
    const style = [ styles.containerStyle, props.containerStyle ];
    const color = props.color || 'main';

    return (
        <TouchableOpacity activeOpacity={.5} onPress={onPress} style={[style, { borderColor: color }]}>
            <GLText title={value} style={styles.textButton} color={color} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        width: 112,
        height: 32,

        alignItems: 'center',
        justifyContent: 'center',

        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    textButton: {
    }
});

export default GLButton;
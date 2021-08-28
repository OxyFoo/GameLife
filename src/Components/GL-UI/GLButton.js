import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import GLText from './GLText';

function GLButton(props) {
    const value = props.value;
    const onPress = props.onPress;
    const style = [ styles.containerStyle, props.containerStyle ];

    return (
        <TouchableOpacity activeOpacity={.5} onPress={onPress} style={style}>
            <GLText title={value} style={styles.textButton} />
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
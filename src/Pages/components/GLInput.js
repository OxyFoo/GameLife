import * as React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import GLText from './GLText';

function GLInput(props) {
    const name = props.name;
    const multiline = props.multiline || false;
    const inputWidth = multiline ? { width: '80%' } : { width: '60%' };

    return (
        <View style={[styles.containerSelection, props.style, multiline && styles.containerSelectionMultiline]}>
            {typeof(name) !== 'undefined' && <GLText style={multiline ? styles.nameMultiline : styles.name} title={multiline ? name : name + ' :'} />}
            <TextInput style={[styles.input, props.styleInput, inputWidth, { color: themeManager.colors['text']['main'] }]} multiline={multiline} onChangeText={props.onChangeText} value={props.value} />
        </View>
    )
}

const styles = StyleSheet.create({
    containerSelection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerSelectionMultiline: {
        flexDirection: 'column'
    },
    name: {
        color: '#5AB4F0',
        fontSize: 20,
        textAlign: 'left',
        paddingLeft: 0
    },
    nameMultiline: {
        color: '#5AB4F0',
        fontSize: 26,
        marginVertical: 24,
        textAlign: 'left',
        paddingLeft: 0
    },
    input: {
        maxHeight: 96,
        margin: 0,
        paddingVertical: 0,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        color: '#FFFFFF'
    }
});

export default GLInput;
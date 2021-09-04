import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';

import GLText from './GLText';

function GLInput(props) {
    const name = props.name || 'Name';

    //onChangeText={this.setStateMail}
    //autoCompleteType="email"
    return (
        <View style={[props.style, styles.containerSelection]}>
            <GLText style={styles.name} title={name + ' :'} />
            <TextInput style={styles.input} />
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
    name: {
        color: '#5AB4F0',
        fontSize: 20,
        textAlign: 'left',
        paddingLeft: 0
    },
    input: {
        width: '60%',
        margin: 0,
        paddingVertical: 0,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: '#3E99E7',
        color: '#FFFFFF'
    }
});

export default GLInput;
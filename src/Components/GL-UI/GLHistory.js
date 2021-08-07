import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import GLIconButton from './GLIconButton';
import GLText from './GLText';

function GLHistory(props) {
    const title = props.title;
    return (
        <View style={Style.history}>
            <View style={Style.header}>
                <GLText style={Style.titleHeader} title='Historique' />
                <GLIconButton style={Style.iconHeader} icon='chevronTop' />
            </View>
            <View style={Style.content}>
                <GLText title="BLA BLA BLA" />
            </View>
        </View>
    )
}

const Style = StyleSheet.create({
    history: {
        position: 'absolute',
        left: 0,
        top: '65%',
        width: '100%',
        height: '35%'
    },
    header: {
        backgroundColor: '#000020'
    },
    titleHeader: {
        textAlign: 'center',
        color: '#55AFF0',
        fontSize: 30,

        borderTopColor: '#F2F4F4',
        borderTopWidth: 2,
        borderBottomColor: '#F2F4F4',
        borderBottomWidth: 2,
    },
    iconHeader: {
        position: 'absolute',
        top: '20%',
        right: 0
    },
    content: {
    }
});

export default GLHistory;
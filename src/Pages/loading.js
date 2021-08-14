import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { GLText, GLLoading } from '../Components/GL-Components';
import user from '../Managers/UserManager';

class Loading extends React.Component {
    render() {
        return (
            <View style={styles.content}>
                <GLText style={styles.title} title='Chargement...' />
                <GLLoading />
                <GLText style={styles.title} title='Citation random' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        paddingTop: 24,

        display: 'flex',
        justifyContent: 'space-evenly'
    },
    title: {
        color: '#3E99E7',
        fontSize: 42,
        marginBottom: 12
    }
});

export default Loading;
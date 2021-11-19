import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackLoading from '../back/loading';
import { GLText, GLLoading } from '../Components';

class Loading extends BackLoading {
    render() {
        const { icon, quote, author } = this.state;
        // TODO - Add date

        return (
            <View style={styles.content}>
                <GLLoading state={icon} />
                <GLText style={styles.citation} title={quote} />
                <GLText style={styles.author} title={author} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    citation: {
        maxWidth: '80%',
        marginVertical: 24
    },
    author: {
        fontWeight: 'bold'
    }
});

export default Loading;
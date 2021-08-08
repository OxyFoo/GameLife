import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import GLText from './GLText';

function GLXPBar(props) {
    const style = props.style;
    return (
        <View>
            <View style={styles.containerXP}>
                <GLText title="XX / YY XP" style={[styles.textXP, style]} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerXP: {
        //backgroundColor: 'red',
        margin: 12
    },
    textXP: {
        textAlign: 'right',
        padding: 0,
        paddingTop: 6,
        paddingBottom: 2,
        paddingRight: 8,
        marginVertical: 12,
        marginHorizontal: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }
});

export default GLXPBar;
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import GLText from './GLText';

function GLXPBar(props) {
    const style = props.style;
    return (
        <View>
            <GLText title="XX / YY XP" style={[Style.textXP, style]} />
        </View>
    )
}

const Style = StyleSheet.create({
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
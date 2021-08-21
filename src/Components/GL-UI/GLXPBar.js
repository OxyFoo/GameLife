import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import GLText from './GLText';

function GLXPBar(props) {
    const style = props.style;
    const valueMax = parseInt(props.max) || 10;
    const value = Math.min(parseInt(props.value), valueMax) || 0;

    const valueText = value + ' / ' + valueMax + ' XP';
    const valueInt = value / valueMax * 100 + '%';

    return (
        <View style={style}>
            <View style={styles.containerXP}>
                <View style={styles.background}>
                    <View style={[styles.fill, { width: valueInt }]} />
                    <GLText style={styles.textXP} title={valueText} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerXP: {
    },
    background: {
        width: '100%',
        padding: 0,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    textXP: {
        paddingVertical: 6,
        paddingRight: 4,
        fontSize: 14,
        textAlign: 'right'
    },
    fill: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',

        paddingVertical: 3,
        paddingHorizontal: 0,
        backgroundColor: '#C2C2C2'
    }
});

export default GLXPBar;
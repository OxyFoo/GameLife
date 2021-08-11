import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import GLText from './GLText';

function GLXPSmallBar(props) {
    const title = props.title;
    const style = props.style;
    const valueMax = props.max || 10;
    const value = Math.min(props.value, valueMax) || 0;

    const valueText = value + '/' + valueMax;
    const valueInt = value / valueMax * 100 + '%';

    return (
        <View style={style}>
            <View style={styles.containerXP}>

                <View style={styles.row}>
                    <GLText style={styles.textXPTitle} title={title} color='grey' />
                    <GLText style={styles.textXP} title={'LVL X'} color='grey' />
                </View>
                <View style={styles.background}>
                    <View style={[styles.fill, { width: valueInt }]} />
                </View>
                <GLText style={styles.textXP} title={valueText} color='grey' />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerXP: {
        marginVertical: 6,
    },
    background: {
        width: '100%',
        padding: 0,
        borderBottomWidth: 3,
        borderColor: '#343434'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textXP: {
        paddingVertical: 6,
        paddingRight: 4,
        fontSize: 10,
        textAlign: 'right'
    },
    textXPTitle: {
        marginLeft: 8,
        fontSize: 18
    },
    fill: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 3,
        backgroundColor: '#FFFFFF'
    }
});

export default GLXPSmallBar;
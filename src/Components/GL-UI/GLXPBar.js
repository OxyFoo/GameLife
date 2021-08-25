import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import GLText from './GLText';

function GLXPBar(props) {
    const style = props.style;
    const small = props.small || false;
    const styleText = small ? [styles.textXP, styles.textXPSmall] : styles.textXP;

    const valueMax = parseInt(props.max) || 10;
    const value = Math.min(parseInt(props.value), valueMax) || 0;
    const valueText = value + ' / ' + valueMax + ' XP';
    const valueInt = value / valueMax * 100 + '%';

    return (
        <View style={style}>
            <View style={styles.containerXP}>
                <View style={styles.background}>
                    <View style={[styles.fill, { width: valueInt }]}>
                        <View style={styles.corner} />
                        <View style={styles.cornerBorder} />
                    </View>
                    <GLText style={styleText} title={valueText} color='darkgrey' />
                </View>
            </View>
        </View>
    )
}

const borderSize = 20;

const styles = StyleSheet.create({
    containerXP: {
    },
    background: {
        width: '100%',
        padding: 0,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        overflow: 'hidden',
        backgroundColor: '#000000'
    },
    textXP: {
        margin: 0,
        paddingVertical: 6,
        paddingRight: 4,
        fontSize: 14,
        textAlign: 'right'
    },
    textXPSmall: {
        paddingVertical: 4,
        fontSize: 12
    },
    fill: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',

        paddingVertical: 3,
        paddingHorizontal: 0,
        backgroundColor: '#C2C2C2'
    },

    corner: {
        position: 'absolute',
        right: 0,
        bottom: 0,

        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderRightWidth: borderSize*.5,
        borderTopWidth: borderSize,
        borderRightColor: "transparent",
        borderTopColor: "#000022",

        transform: [{ rotate: "180deg" }]
    },
    cornerBorder: {
        position: 'absolute',
        right: -5 + borderSize/2,
        bottom: (-8 + borderSize/5)*5,
        width: 3,
        height: (((borderSize**2)*2)**0.5)*2, // Pythagore
        transform: [{ rotate: "22deg" }],
        backgroundColor: '#FFFFFF'
    }
});

export default GLXPBar;
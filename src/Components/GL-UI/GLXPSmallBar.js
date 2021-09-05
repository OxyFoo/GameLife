import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import langManager from '../../Managers/LangManager';

import GLText from './GLText';

function GLXPSmallBar(props) {
    const title = props.title;
    const style = props.style;
    const level = props.level || 0;
    const total = props.total || 0;

    const valueMax = parseInt(props.max) || 10;
    
    const value = Math.min(parseInt(props.value), valueMax) || 0;
    const valueText = value + '/' + valueMax;
    const valueInt = (value / valueMax) * 100;

    const sup = typeof(props.sup) !== 'undefined' ? parseInt(props.sup) : null;
    const supInt = Math.min(value + (sup || 0), valueMax);
    const valueSup = (supInt / valueMax) * 100;
    const textSup = '+' + sup + ' ' + langManager.curr['skill']['text-' + (sup > 1 ? 'points' : 'point')];

    return (
        <View style={style}>
            <View style={styles.containerXP}>

                <View style={styles.row}>
                    <View style={styles.titleContainer}>
                        <GLText style={styles.textXPTitle} title={title} color='grey' />
                        {sup !== null && sup !== 0 && (<GLText style={styles.textXPSup} title={textSup} color='grey' />)}
                    </View>
                    <GLText style={styles.textXP} title={langManager.curr['level']['level-small'] + ' ' + level} color='grey' />
                </View>
                <View style={styles.background}>
                    <View style={[styles.fill, styles.sup, { width: valueSup + '%' }]} />
                    <View style={[styles.fill, { width: valueInt + '%' }]} />
                </View>
                <GLText style={styles.textXP} title={valueText + ' - ' + total + ' ' + langManager.curr['level']['xp']} color='grey' />
                <GLText style={styles.totalXP} title={total + ' ' + langManager.curr['level']['xp']} color='grey' />

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
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    textXP: {
        paddingVertical: 5,
        paddingRight: 4,
        fontSize: 10,
        textAlign: 'right'
    },
    totalXP: {
        position: 'absolute',
        left: 12,
        bottom: 0,
        paddingVertical: 5,
        paddingRight: 4,
        fontSize: 10,
        textAlign: 'left'
    },
    titleContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    textXPTitle: {
        maxWidth: '80%',
        textAlign: 'left',
        marginLeft: 8,
        marginBottom: 4,
        fontSize: 18
    },
    textXPSup: {
        padding: 4,
        textAlign: 'left',
        fontSize: 12
    },
    fill: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 3,
        backgroundColor: '#FFFFFF'
    },
    sup: {
        backgroundColor: '#888888'
    }
});

export default GLXPSmallBar;
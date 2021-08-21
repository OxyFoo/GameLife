import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import langManager from '../../Managers/LangManager';
import GLXPSmallBar from './GLXPSmallBar';

function statComponent(item, index) {
    const title = langManager.curr['statistics']['names'][item.key];
    const value = item.value;

    return (
        <GLXPSmallBar key={'skill_' + index} style={styles.stat} title={title} value={value} max={10} />
    )
}

function GLStats(props) {
    const stats = props.stats || [];
    const output = stats.map((item, i) => statComponent(item, i));

    return (
        <View style={styles.container}>
            {output}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly'
    },
    stat: {
        width: '100%'
    }
});

export default GLStats;
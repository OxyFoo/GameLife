import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import langManager from '../../Managers/LangManager';
import user from '../../Managers/UserManager';
import GLXPSmallBar from './GLXPSmallBar';

function statComponent(item, sup, index) {
    const statKey = item;

    const stat = user.experience.getStatExperience(statKey);
    const title = langManager.curr['statistics']['names'][statKey];
    const total = Math.round(stat.totalXP);

    const pressEvent = () => {
        user.interface.changePage('statistic', { 'stat': statKey });
    };

    return (
        <TouchableOpacity style={styles.stat} key={'skill_' + index} activeOpacity={.5} onPress={pressEvent}>
            <GLXPSmallBar title={title} value={stat.xp} max={stat.next} sup={sup} level={stat.lvl} total={total} />
        </TouchableOpacity>
    )
}

function GLStats(props) {
    const keys = Object.keys(props.data || defaultStatsKeys);
    const sup = Object.values(props.data || defaultStatsKeys);
    const output = keys.map((item, i) => statComponent(item, sup[i], i));
    const containerStyle = [ styles.container, props.containerStyle ];

    return (
        <View style={containerStyle}>
            {output}
        </View>
    );
}

const defaultStatsKeys = {
    'sag': undefined,
    'int': undefined,
    'con': undefined,
    'for': undefined,
    'end': undefined,
    'agi': undefined,
    'dex': undefined
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
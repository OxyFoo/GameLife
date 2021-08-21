import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import langManager from '../../Managers/LangManager';
import user from '../../Managers/UserManager';
import GLXPSmallBar from './GLXPSmallBar';

function statComponent(item, index) {
    const statKey = item.key;
    const value = item.value;
    const title = langManager.curr['statistics']['names'][statKey];

    const pressEvent = () => {
        user.changePage('statistic', { 'stat': statKey });
    };

    return (
        <TouchableOpacity style={styles.stat} key={'skill_' + index} activeOpacity={.5} onPress={pressEvent}>
            <GLXPSmallBar title={title} value={value} max={10} />
        </TouchableOpacity>
    )
}

function GLStats(props) {
    const stats = props.stats || [];
    const output = stats.map((item, i) => statComponent(item, i));
    const containerStyle = [ styles.container, props.containerStyle ];

    return (
        <View style={containerStyle}>
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
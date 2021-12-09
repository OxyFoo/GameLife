import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Text, XPBar } from '../Components';
import { isUndefined } from '../../Functions/Functions';

const StatsBarsProps = {
    style: {},
    data: undefined
}

function statComponent(item, sup, index) {
    const statKey = item;

    const stat = user.experience.getStatExperience(statKey);
    const title = langManager.curr['statistics']['names'][statKey];
    const total = Math.round(stat.totalXP);

    const pressEvent = () => {
        // TODO - Popup
        //user.changePage('statistic', { 'stat': statKey });
    };

    return (
        <TouchableOpacity style={styles.fullW} key={'skill_' + index} activeOpacity={.5} onPress={pressEvent}>
            <View style={styles.XPHeader}>
                <Text>{title}</Text>
                <View style={styles.headerText}>
                    <Text style={styles.headerLvl}>LVL {stat.lvl}</Text>
                    <Text>{stat.xp}/{stat.next} - {total}XP</Text>
                </View>
            </View>
            <XPBar
                style={styles.XPBar}
                value={stat.xp}
                maxValue={stat.next}
                supValue={sup}
            />
        </TouchableOpacity>
    )
}

function StatsBars(props) {
    let output = <></>;
    const containerStyle = [ styles.fullW, props.containerStyle ];

    if (!isUndefined(props.data)) {
        const keys = Object.keys(props.data);
        const sup = Object.values(props.data);
        output = keys.map((item, i) => statComponent(item, sup[i], i));
    }

    return (
        <View style={containerStyle}>
            {output}
        </View>
    );
}

StatsBars.prototype.props = StatsBarsProps;
StatsBars.defaultProps = StatsBarsProps;

const styles = StyleSheet.create({
    fullW: {
        width: '100%'
    },
    XPHeader: {
        marginBottom: 8,
        paddingHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    XPBar: {
        marginBottom: 16
    },
    headerText: {
        flexDirection: 'row'
    },
    headerLvl: {
        fontWeight: 'bold',
        marginRight: 12
    }
});

export default StatsBars;
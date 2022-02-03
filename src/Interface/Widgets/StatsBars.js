import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Icon, Swiper, Text, XPBar } from '../Components';
import { IsUndefined } from '../../Functions/Functions';

/**
 * @typedef {import('../../Managers/UserManager').Stats} Stats
 * @typedef {import('../../Class/Experience').XPInfo} XPInfo
 */

const StatsBarsProps = {
    style: {},

    /** @type {Stats} */
    data: undefined,

    /** @type {Array<Number>} - Optionnal, add secondary value, same length of user stats */
    supData: user.statsKey.map(() => 0)
}

function popupContent(initStatKey) {
    const statBox = (statKey) => {
        const statName = langManager.curr['statistics']['names'][statKey];
        const statDescription = langManager.curr['statistics']['descriptions'][statKey];
        const stats = user.experience.GetExperience().stats;
        const bar = statComponent(statKey, stats[statKey], 0, 0, false);

        return (
            <>
                <Text fontSize={24}>{statName}</Text>
                <View style={{ padding: '5%', paddingHorizontal: '10%' }}>{bar}</View>
                <Text fontSize={14}>{statDescription}</Text>
            </>
        )
    }

    let swiperRef;
    const bars = Object.keys(user.stats).map(statBox);
    const initIndex = Object.keys(user.stats).indexOf(initStatKey);

    return (
        <View style={{ padding: '5%' }}>
            <Swiper
                ref={ref => { if (ref !== null) swiperRef = ref}}
                pages={bars}
                height={256}
                enableAutoNext={false}
                initIndex={initIndex}
                backgroundColor='transparent'
            />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '5%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Icon onPress={() => { swiperRef.Prev() }} icon='chevron' angle={180} />
                <Icon onPress={() => { swiperRef.Next() }} icon='chevron' />
            </View>
        </View>
    );
}

/**
 * @param {String} statKey - Stat key
 * @param {XPInfo} stat - Stat info
 * @param {Number} sup
 * @param {Number} index
 * @param {Boolean} clickable
 * @returns {React.ReactElement}
 */
function statComponent(statKey, stat, sup, index, clickable = true) {
    const statName = clickable ? langManager.curr['statistics']['names'][statKey] : '';
    const langLevel = langManager.curr['level'];

    const popupRender = () => popupContent(statKey);
    const pressEvent = !clickable ? undefined : () => {
        user.interface.popup.Open('custom', popupRender, undefined, true);
    };

    return (
        <TouchableOpacity style={styles.fullW} key={'skill_' + index} activeOpacity={IsUndefined(pressEvent) ? 1 : .5} onPress={pressEvent}>
            <View style={styles.XPHeader}>
                <Text>{statName}</Text>
                <View style={styles.headerText}>
                    <Text style={styles.headerLvl}>{langLevel['level-small']} {stat.lvl}</Text>
                    <Text>{stat.xp}/{stat.next} - {stat.totalXP}{langLevel['xp']}</Text>
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

class StatsBars extends React.PureComponent {
    render() {
        let output = <></>;
        const { data, supData, style } = this.props;
        if (IsUndefined(data)) return output;

        const addStatBar = (item, i) => statComponent(item, data[item], supData[i], i);
        output = Object.keys(data).map(addStatBar);

        return (
            <View style={[ styles.fullW, style ]}>
                {output}
            </View>
        );
    }
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
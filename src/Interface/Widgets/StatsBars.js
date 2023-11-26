import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Icon, Swiper, Text, XPBar } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/UserManager').Stats} Stats
 * @typedef {import('../../Class/Experience').XPInfo} XPInfo
 */

const StatsBarsProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Stats | null} */
    data: null,

    /** @type {Array<number>} Optionnal, add secondary value, same length of user stats */
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
 * @param {string} statKey Stat key
 * @param {XPInfo} stat Stat info
 * @param {number} sup
 * @param {number} index
 * @param {boolean} clickable
 * @returns {React.ReactElement}
 */
function statComponent(statKey, stat, sup, index, clickable = true) {
    const langLevel = langManager.curr['level'];

    const popupRender = () => popupContent(statKey);
    const pressEvent = !clickable ? null : () => {
        user.interface.popup.Open('custom', popupRender, undefined, true);
    };

    let textXP = langLevel['level'] + ' ' + stat.lvl;
    let textLevel = langManager.curr['statistics']['names'][statKey];
    if (!clickable) {
        textLevel = langLevel['level-small'] + ' ' + stat.lvl;
        textXP = `${stat.xp}/${stat.next} - ${stat.totalXP}${langLevel['xp']}`;
    }

    return (
        <TouchableOpacity style={styles.fullW} key={'skill_' + index} activeOpacity={pressEvent === null ? 1 : .5} onPress={pressEvent}>
            <View style={styles.XPHeader}>
                <Text>{textLevel}</Text>
                <Text>{textXP}</Text>
            </View>
            <XPBar
                style={styles.XPBar}
                value={stat.xp}
                maxValue={stat.next}
                supValue={sup}
            />
        </TouchableOpacity>
    );
}

class StatsBars extends React.PureComponent {
    render() {
        const { data, supData, style } = this.props;
        if (data === null) return null;

        const output = Object.keys(data).map((item, i) =>
            statComponent(item, data[item], supData[i], i)
        );

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
    }
});

export default StatsBars;
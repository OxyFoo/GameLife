import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Icon, Swiper, Text, XPBar } from '../Components';
import { IsUndefined } from '../../Functions/Functions';

const StatsBarsProps = {
    style: {},
    data: undefined,
    supData: undefined,
    /**
     * @type {'all'|'int'|'soc'|'for'|'end'|'agi'|'dex'}
     */
    bars: 'all'
}

function popupContent(initStatKey) {
    const statBox = (statKey) => {
        const statName = langManager.curr['statistics']['names'][statKey];
        const statDescription = langManager.curr['statistics']['descriptions'][statKey];
        const bar = statComponent(statKey, 0, 0, false);

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

function statComponent(item, sup, index, clickable = true) {
    const statKey = item;

    const stat = user.experience.GetStatExperience(statKey);
    const statName = langManager.curr['statistics']['names'][statKey];
    const total = Math.round(stat.totalXP);

    const popupRender = () => popupContent(statKey);
    const pressEvent = !clickable ? undefined : () => {
        user.interface.popup.Open('custom', popupRender, undefined, true);
    };

    return (
        <TouchableOpacity style={styles.fullW} key={'skill_' + index} activeOpacity={IsUndefined(pressEvent) ? 1 : .5} onPress={pressEvent}>
            <View style={styles.XPHeader}>
                <Text>{clickable ? statName : ''}</Text>
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

    if (!IsUndefined(props.data)) {
        const keys = Object.keys(props.data);
        const supData = IsUndefined(props.supData) ? Array(keys.length).fill(0) : Object.values(props.supData);
        if (props.bars === 'all') {
            output = keys.map((item, i) => statComponent(item, supData[i], i));
        } else {
            output = statComponent(props.bars, props.data[props.bars], 0);
        }
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
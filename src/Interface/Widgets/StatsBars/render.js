import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Icon, Swiper, Text, XPBar } from 'Interface/Components';

/**
 * @typedef {import('Class/Experience').Stats} Stats
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 */

/**
 * @param {keyof Stats} initStatKey
 * @param {Stats} [stats]
 */
function popupContent(initStatKey, stats = user.experience.GetExperience().stats) {
    /** @param {keyof Stats} statKey */
    const statBox = (statKey) => {
        const statName = langManager.curr['statistics']['names'][statKey];
        const statDescription = langManager.curr['statistics']['descriptions'][statKey];

        return (
            <View style={styles.popupContentStatPage}>
                <Text fontSize={24}>{statName}</Text>
                <View style={styles.popupContentStat}>
                    {statComponent(statKey, stats[statKey], 0, 0, false)}
                </View>
                <Text fontSize={14}>{statDescription}</Text>
            </View>
        )
    };

    /** @type {React.MutableRefObject<Swiper | null>} */
    const swiperRef = React.useRef(null);
    const bars = user.statsKey.map(statBox);
    const initIndex = user.statsKey.indexOf(initStatKey);

    return (
        <View style={styles.popupContent}>
            <Swiper
                ref={swiperRef}
                style={styles.popupContentSwiper}
                verticalAlign='flex-start'
                pages={bars}
                enableAutoNext={false}
                initIndex={initIndex}
                backgroundColor='transparent'
            />
            <View style={styles.popupContentHeader}>
                <Icon onPress={swiperRef.current?.Prev} icon='chevron' angle={180} />
                <Icon onPress={swiperRef.current?.Next} icon='chevron' />
            </View>
        </View>
    );
}

/**
 * @param {keyof Stats} statKey Stat key
 * @param {XPInfo} stat Stat info
 * @param {number} sup
 * @param {number} index
 * @param {boolean} simplifiedDisplay
 * @param {(() => void) | null} [callback]
 * @returns {React.ReactElement}
 */
function statComponent(statKey, stat, sup, index, simplifiedDisplay = false, callback = null) {
    const langLevel = langManager.curr['level'];
    const langStats = langManager.curr['statistics']['names-min'];

    const pressEvent = () => {
        if (callback !== null) {
            callback();
        }
    };

    let textXP = langLevel['level'] + ' ' + stat.lvl;
    let textLevel = langManager.curr['statistics']['names'][statKey];
    if (callback === null) {
        textLevel = langLevel['level-small'] + ' ' + stat.lvl;
        textXP = `${Math.floor(stat.xp)}/${Math.ceil(stat.next)} - ${stat.totalXP}${langLevel['xp']}`;
    }

    if (simplifiedDisplay) {
        return (
            <TouchableOpacity
                style={styles.fullW}
                key={'skill_' + index}
                activeOpacity={pressEvent === null ? 1 : .5}
                onPress={pressEvent}
            >
                <View style={styles.XPHeaderSimplified}>
                    <Text>{langStats[statKey]}</Text>
                    <Text fontSize={20} bold={true}>{stat.lvl.toString()}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.fullW}
            key={'skill_' + index}
            activeOpacity={pressEvent === null ? 1 : .5}
            onPress={pressEvent}
        >
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

export { statComponent, popupContent };

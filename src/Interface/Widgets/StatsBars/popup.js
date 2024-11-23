import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Icon, ProgressBar, Swiper, Text } from 'Interface/Components';

/**
 * @typedef {import('Class/Experience').Stats} Stats
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 */

/**
 * @param {Object} props
 * @param {keyof Stats} props.initStatKey
 * @param {Stats} [props.stats]
 */
function PopupContent({ initStatKey, stats = user.experience.experience.Get().stats }) {
    /** @param {keyof Stats} statKey */
    const statBox = (statKey) => {
        const statName = langManager.curr['statistics']['names'][statKey];
        const statDescription = langManager.curr['statistics']['descriptions'][statKey];

        return (
            <View style={styles.popupContentStatPage}>
                <Text fontSize={24}>{statName}</Text>
                <View style={styles.popupContentStat}>{statComponent(statKey, stats[statKey], 0, 0, false)}</View>
                <Text fontSize={14}>{statDescription}</Text>
            </View>
        );
    };

    /** @type {React.RefObject<Swiper>} */
    const swiperRef = React.createRef();
    const bars = user.experience.statsKey.map(statBox);
    const initIndex = user.experience.statsKey.indexOf(initStatKey);

    return (
        <View style={styles.popupContent}>
            <Swiper
                ref={swiperRef}
                minHeight={300}
                verticalAlign='flex-start'
                pages={bars}
                enableAutoNext={false}
                initIndex={initIndex}
                backgroundColor='transparent'
            />
            <View style={styles.popupContentHeader}>
                <Button
                    style={styles.popupButtonNavigation}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => swiperRef.current?.Prev()}
                >
                    <Icon icon='chevron' angle={180} />
                </Button>
                <Button
                    style={styles.popupButtonNavigation}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => swiperRef.current?.Next()}
                >
                    <Icon icon='chevron' />
                </Button>
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
        textXP = `${Math.floor(stat.xp)}/${Math.floor(stat.next)} - ${stat.totalXP}${langLevel['xp']}`;
    }

    if (simplifiedDisplay) {
        return (
            <TouchableOpacity
                style={styles.fullW}
                key={'skill_' + index}
                activeOpacity={pressEvent === null ? 1 : 0.5}
                onPress={pressEvent}
            >
                <View style={styles.XPHeaderSimplified}>
                    <Text>{langStats[statKey]}</Text>
                    <Text fontSize={20}>{`${stat.lvl}`}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.fullW}
            key={'skill_' + index}
            activeOpacity={pressEvent === null ? 1 : 0.5}
            onPress={pressEvent}
        >
            <View style={styles.XPHeader}>
                <Text>{textLevel}</Text>
                <Text>{textXP}</Text>
            </View>
            <ProgressBar style={styles.XPBar} value={stat.xp} maxValue={stat.next} supValue={sup} />
        </TouchableOpacity>
    );
}

export { statComponent, PopupContent };

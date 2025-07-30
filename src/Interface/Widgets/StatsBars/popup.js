import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Icon, Swiper, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').StatsXP} StatsXP
 * @typedef {import('@oxyfoo/gamelife-types/Class/Experience').XPInfo} XPInfo
 */

/**
 * @param {Object} props
 * @param {keyof StatsXP} props.initStatKey
 * @param {StatsXP} [props.stats]
 */
function PopupContent({ initStatKey, stats = user.experience.experience.Get().stats }) {
    const lang = langManager.curr['statistics'];

    /** @param {keyof StatsXP} statKey */
    const statBox = (statKey) => {
        const statName = lang['names'][statKey];
        const statDescription = lang['descriptions'][statKey];

        return (
            <View style={styles.popupContentStatPage}>
                <Text fontSize={24}>{statName}</Text>

                <Text style={styles.popupContentStat} color='primary' fontSize={16}>
                    {`${stats[statKey]} ${lang['points']}`}
                </Text>

                <Text fontSize={14}>{statDescription}</Text>
            </View>
        );
    };

    /** @type {React.RefObject<Swiper | null>} */
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

export { PopupContent };

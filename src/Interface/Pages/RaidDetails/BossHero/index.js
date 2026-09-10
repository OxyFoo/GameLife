import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { ImageBackdrop, ProgressBar, Text } from 'Interface/Components';
import { useRaid } from 'Interface/Pages/Raids/RaidCard/useRaid';
import { FormatCompact } from 'Utils/Raids';

/** Fraction of the scroll the portrait follows, and how far it may travel before it stops */
const PARALLAX_TRAVEL = 90;
const PARALLAX_SCROLL = 540;

/**
 * Boss portrait as the background of the details page, same treatment as the season landscape of
 * the raid page. It is a backdrop, not a block in the flow: at its natural ratio and full width it
 * ate the whole screen.
 *
 * It drifts upwards as the page scrolls, like the avatar of the home page, so the portrait feels
 * behind the content rather than glued to it. The travel is clamped: on a long list of activities
 * an unbounded fraction of the scroll would drag the whole portrait off screen.
 *
 * @param {object} props
 * @param {Animated.Value} props.scrollY Scroll position of the page
 */
function BossBackground({ scrollY }) {
    const { images } = useRaid();

    const parallax = {
        transform: [
            {
                translateY: scrollY.interpolate({
                    inputRange: [0, PARALLAX_SCROLL],
                    outputRange: [0, -PARALLAX_TRAVEL],
                    extrapolate: 'clamp'
                })
            }
        ]
    };

    return (
        <Animated.View style={[StyleSheet.absoluteFill, parallax]} pointerEvents='none'>
            <ImageBackdrop source={images.boss} />
        </Animated.View>
    );
}

/**
 * Who is fought and how far the world is, over the portrait. The raid card says the rest one screen
 * back, so this only carries what the page needs to stand on its own — and the boss name, which is
 * shown nowhere else (the card carries the season name).
 */
function BossCaption() {
    const { season, status } = useRaid();
    const lang = langManager.curr['raids'];

    if (season === null) {
        return null;
    }

    const defeated = status === 'defeated' || season.defeatedAt !== null;

    return (
        <View style={styles.caption}>
            <Text style={styles.season} fontSize={12} color='raid'>
                {lang['season'].replace('{}', season.number.toString())}
            </Text>
            <Text style={styles.name} fontSize={26} bold numberOfLines={2}>
                {langManager.GetText(season.bossName)}
            </Text>
            <Text style={styles.subtitle} fontSize={13} color='secondary' numberOfLines={1}>
                {langManager.GetText(season.name)}
            </Text>

            {defeated ? (
                <Text style={styles.state} fontSize={13} color='success' bold>
                    {lang['status-defeated']}
                </Text>
            ) : (
                <>
                    <ProgressBar style={styles.bar} height={6} color='raid' value={season.hp} maxValue={season.maxHP} />
                    <Text style={styles.state} fontSize={12} color='secondary'>
                        {`${lang['card-progress']} · ${FormatCompact(season.hp)} / ${FormatCompact(season.maxHP)}`}
                    </Text>
                </>
            )}
        </View>
    );
}

export { BossBackground, BossCaption };

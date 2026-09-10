import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import { useRaid } from 'Interface/Pages/Raids/RaidCard/useRaid';

import { RAID_MIN_LEVEL } from 'Data/User/Raids';
import { Text, Icon, Button, ProgressDonut } from 'Interface/Components';
import { FormatCountdown } from 'Utils/Raids';

/**
 * Raid widget of the Home: outer ring = phase of the player (fight budget, or heal countdown),
 * inner ring = progress of the season (the month), centre = time left in the season
 * @param {object} props
 * @param {import('react-native').ViewStyle} [props.style]
 */
function RaidWidget({ style }) {
    const snapshot = useRaid();
    const lang = langManager.curr['home'];
    const { loaded, status, season, simulation, now, nextSeasonAt, seasonProgress, healRemaining } = snapshot;

    const open = () => {
        user.interface.ChangePage('raids');
    };

    /** @type {React.ReactNode} */
    let body;
    if (!loaded) {
        // Nothing is known yet: show the rings empty rather than a message that a later frame will
        // replace. That swap, and the height change it brings, is what made the widget blink while
        // the app was starting up — the cached payload and the server answer each triggered one.
        body = renderDonuts(0, 'main3', 0, null);
    } else if (status === 'locked') {
        body = renderText(lang['container-raid-locked'].replace('{}', RAID_MIN_LEVEL.toString()));
    } else if (status === 'update-required') {
        body = renderText(lang['container-raid-update']);
    } else if (status === 'no-season' || season === null) {
        body = renderText(lang['container-raid-none']);
    } else {
        const fighting = status === 'fighting';
        const healing = status === 'healing';
        const current = simulation?.current ?? null;

        /** @type {'main3' | 'success'} */
        const outerColor = fighting ? 'main3' : 'success';
        let outerValue = 1;
        if (fighting && current !== null && current.budgetTotal > 0) {
            outerValue = Math.min(1, current.budgetUsed / current.budgetTotal);
        } else if (healing && current !== null && current.end !== null) {
            const total = Math.max(1, current.end - current.start);
            outerValue = Math.min(1, Math.max(0, 1 - healRemaining / total));
        }

        const remaining =
            status === 'heroes-rest' || status === 'ended' ? (nextSeasonAt ?? now) - now : season.endTime - now;
        const label = fighting
            ? lang['container-raid-fighting']
            : healing
              ? lang['container-raid-healing']
              : lang['container-raid-rest'];

        body = renderDonuts(
            outerValue,
            outerColor,
            seasonProgress.ratio,
            <>
                <Text fontSize={16} bold>
                    {FormatCountdown(Math.max(0, remaining), 2)}
                </Text>
                <Text fontSize={10} color={outerColor}>
                    {label}
                </Text>
            </>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <Button
                style={styles.button}
                onPress={open}
                gradientColors={[
                    themeManager.GetColor('main1', { opacity: 0.25 }),
                    themeManager.GetColor('main1', { opacity: 0.08 })
                ]}
                gradientColorsAngle={90}
            >
                <View style={styles.header}>
                    <Text fontSize={16}>{lang['container-raid-title']}</Text>
                    <Icon color='gradient' size={24} icon='arrow-square-outline' angle={90} />
                </View>
                {body}
            </Button>
        </View>
    );
}

/**
 * The two rings and what sits at their centre. Extracted so the loading state shows the very same
 * geometry with empty rings, and the widget never changes height.
 * @param {number} outerValue Phase of the player [0-1]
 * @param {'main3' | 'success'} outerColor
 * @param {number} innerValue Progress of the season [0-1]
 * @param {React.ReactNode} children
 */
function renderDonuts(outerValue, outerColor, innerValue, children) {
    return (
        <View style={styles.body}>
            <ProgressDonut value={outerValue} size={104 + 16} strokeWidth={8} progressColor={outerColor} delay={0}>
                <ProgressDonut value={innerValue} size={78 + 16} strokeWidth={8} progressColor='raid' delay={200}>
                    <View style={styles.donutContent}>{children}</View>
                </ProgressDonut>
            </ProgressDonut>
        </View>
    );
}

/** @param {string} text */
function renderText(text) {
    return (
        <View style={styles.body}>
            <Text style={styles.message} fontSize={12} color='light'>
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    // Same structure as TodayActivitiesPieChart: a padding-free flex item, the padded Button inside.
    // Yoga adds the padding on top of a zero flex basis, so a padded flex item would end up wider.
    container: {
        flex: 1
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 2
    },
    // The Button lays its children out in a wrapping row: a full width block takes its own line
    body: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        paddingBottom: 8
    },
    // Keeps the countdown and its label off the inner ring
    donutContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4
    },
    message: {
        textAlign: 'center'
    }
});

export { RaidWidget };

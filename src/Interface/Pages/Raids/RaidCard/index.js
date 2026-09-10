import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { useRaid } from './useRaid';
import { Stat } from './Stat';
import { StatusRow } from './StatusRow';
import { RewardsRow } from './RewardsRow';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { RAID_MIN_LEVEL } from 'Data/User/Raids';
import { Icon, ProgressBar, Text } from 'Interface/Components';
import { ClaimRewardButton } from './ClaimRewardButton';
import { FormatCompact, FormatCountdown, FormatThousands } from 'Utils/Raids';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('Data/User/Raids').RaidSnapshot} RaidSnapshot
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHistoryEntry} RaidHistoryEntry
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidTrend} RaidTrend
 */

/**
 * Card of the current raid: boss life, contribution, participants, duration, current phase and
 * rewards. It carries no image of its own — the season visual is the banner it floats over
 * (`RaidBanner`) — and stays a dark translucent panel wherever it is used. Its other faces:
 * locked (below level 10), update required, and heroes' rest (no boss).
 * @param {object} props
 * @param {StyleProp} [props.style]
 * @param {() => void} [props.onPress]
 * @param {RaidHistoryEntry | null} [props.lastSeason] Last closed season, for the heroes' rest face
 */
function RaidCard({ style, onPress, lastSeason = null }) {
    const snapshot = useRaid();
    const lang = langManager.curr['raids'];
    const { status } = snapshot;

    const borderColor = themeManager.GetColor(status === 'locked' ? 'border' : 'raid');
    // Opaque enough to stay readable over the season landscape, translucent enough to belong to it
    const overlay = [
        themeManager.GetColor('background', { opacity: 0.88 }),
        themeManager.GetColor('background', { opacity: 0.97 })
    ];

    /** @type {React.ReactNode} */
    let content;
    if (status === 'update-required') {
        content = renderMessage('update', lang['card-update-required']);
    } else if (status === 'locked') {
        content = (
            <View>
                <View style={styles.skeleton} pointerEvents='none'>
                    {renderFull(snapshot, true)}
                </View>
                <View style={styles.lockedOverlay}>
                    <Icon icon='lock' size={28} color='white' />
                    <Text style={styles.lockedText} fontSize={13} color='primary'>
                        {lang['card-locked'].replace('{}', RAID_MIN_LEVEL.toString())}
                    </Text>
                </View>
            </View>
        );
    } else if (status === 'no-season' || status === 'heroes-rest' || status === 'ended' || status === 'defeated') {
        // The boss is down: the raid is over for everyone until the 1st, the card rests with it
        content = renderRest(snapshot, lastSeason);
    } else {
        content = renderFull(snapshot, false);
    }

    const card = (
        <View style={[styles.card, style]}>
            <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={overlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            <View style={[styles.border, { borderColor }]}>{content}</View>
        </View>
    );

    if (typeof onPress === 'undefined' || status === 'locked' || status === 'update-required') {
        return card;
    }
    return (
        <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
            {card}
        </TouchableOpacity>
    );
}

/**
 * @param {import('Ressources/Icons').IconsName} icon
 * @param {string} text
 */
function renderMessage(icon, text) {
    return (
        <View style={styles.message}>
            <Icon icon={icon} size={32} color='main1' />
            <Text style={styles.messageText} fontSize={14} color='primary'>
                {text}
            </Text>
        </View>
    );
}

/**
 * @param {RaidSnapshot} snapshot
 * @param {RaidHistoryEntry | null} lastSeason
 */
function renderRest(snapshot, lastSeason) {
    const lang = langManager.curr['raids'];
    const { status, now, nextSeasonAt, season, self, rewardState } = snapshot;
    const defeated = status === 'defeated';

    /** @type {React.ReactNode} */
    let body;
    if (nextSeasonAt !== null && nextSeasonAt > now) {
        body = (
            <>
                <Text style={styles.restCountdown} fontSize={36} color='main2' bold>
                    {FormatCountdown(nextSeasonAt - now, 3)}
                </Text>
                <Text fontSize={12} color='secondary'>
                    {lang['card-rest-next']}
                </Text>
            </>
        );
    } else {
        body = (
            <Text style={styles.restText} fontSize={13} color='secondary'>
                {lang['card-rest-no-next']}
            </Text>
        );
    }

    // Score of the season that just ended: the running one when its boss went down, the last closed one otherwise
    const score = defeated && self !== null ? { damage: self.damage, rank: self.rank } : null;
    const last = lastSeason?.self ?? null;

    return (
        <View style={styles.rest}>
            <Text fontSize={22} bold>
                {lang['card-rest-title']}
            </Text>
            {season !== null && (defeated || status === 'ended') && (
                <View style={styles.restBoss}>
                    <Text fontSize={12} color='raid'>
                        {langManager.GetText(season.name)}
                    </Text>
                    {defeated && (
                        <>
                            <Icon icon='cup' size={14} color='raid' />
                            <Text fontSize={12} color='raid' bold>
                                {lang['status-defeated']}
                            </Text>
                        </>
                    )}
                </View>
            )}
            {body}
            {score !== null && score.rank !== null && (
                <Text style={styles.restLast} fontSize={11} color='light'>
                    {lang['card-last-contribution']
                        .replace('{}', FormatThousands(score.damage))
                        .replace('{}', score.rank.toString())}
                </Text>
            )}
            {score === null && last !== null && last.finalRank !== null && (
                <Text style={styles.restLast} fontSize={11} color='light'>
                    {lang['card-last-contribution']
                        .replace('{}', FormatThousands(last.damage))
                        .replace('{}', last.finalRank.toString())}
                </Text>
            )}
            {season !== null && (rewardState === 'claimable' || rewardState === 'claimed') && (
                <ClaimRewardButton style={styles.restClaim} seasonID={season.id} claimed={rewardState === 'claimed'} />
            )}
        </View>
    );
}

/**
 * @param {RaidSnapshot} snapshot
 * @param {boolean} skeleton Locked face: values shown, nothing interactive
 */
function renderFull(snapshot, skeleton) {
    const lang = langManager.curr['raids'];
    const { season, self, simulation, seasonProgress } = snapshot;

    const name = season !== null ? langManager.GetText(season.name) : '—';
    const number = season?.number ?? 0;
    const hp = season?.hp ?? 0;
    const maxHP = season?.maxHP ?? 1;
    const participants = season?.participantsCount ?? 0;
    const damage = skeleton ? 0 : Math.max(self?.damage ?? 0, simulation?.totals.damage ?? 0);
    /** @type {RaidTrend} */
    const trend = self === null ? 'same' : self.trend;

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.name} fontSize={22} bold numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.season} fontSize={12} color='raid'>
                    {lang['season'].replace('{}', number.toString())}
                </Text>
            </View>

            <View style={styles.row}>
                <Stat
                    style={styles.flex2}
                    label={lang['card-progress']}
                    value={`${FormatCompact(hp)} / ${FormatCompact(maxHP)}`}
                    valueColor='raid'
                    inline
                >
                    <ProgressBar style={styles.statBar} height={6} color='raid' value={hp} maxValue={maxHP} />
                </Stat>
                <Stat
                    style={styles.flex1}
                    label={lang['card-contribution']}
                    value={lang['points'].replace('{}', FormatThousands(damage))}
                    valueColor='main2'
                    right={
                        trend === 'up' ? (
                            <Icon icon='arrow-up' size={12} color='success' />
                        ) : trend === 'down' ? (
                            <Icon icon='arrow-up' size={12} angle={180} color='danger' />
                        ) : null
                    }
                />
            </View>

            <View style={styles.row}>
                <Stat
                    style={styles.flex1}
                    label={lang['card-participants']}
                    value={FormatCompact(participants)}
                    valueColor='main3'
                />
                <Stat
                    style={styles.flex2}
                    label={lang['card-duration']}
                    value={lang['card-duration-days']
                        .replace('{}', seasonProgress.elapsedDays.toString())
                        .replace('{}', seasonProgress.totalDays.toString())}
                    valueColor='main1'
                    inline
                >
                    <ProgressBar
                        style={styles.statBar}
                        height={6}
                        color='main1'
                        value={seasonProgress.elapsedDays}
                        maxValue={Math.max(1, seasonProgress.totalDays)}
                    />
                </Stat>
            </View>

            {!skeleton && <StatusRow snapshot={snapshot} />}

            <RewardsRow rewards={season?.rewards ?? []} unlocked={season?.defeatedAt !== null && season !== null} />
        </View>
    );
}

export { RaidCard };

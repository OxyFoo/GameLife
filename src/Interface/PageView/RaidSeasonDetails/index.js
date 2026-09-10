import * as React from 'react';
import { View, Image, ScrollView } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { ClaimRewardButton } from 'Interface/Pages/Raids/RaidCard/ClaimRewardButton';
import { KPI, Reward, Text } from 'Interface/Components';
import { FormatMinutes, FormatThousands } from 'Utils/Raids';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHistoryEntry} RaidHistoryEntry
 */

/**
 * A past raid opened from the history: outcome, your score, and the reward of that season, which
 * stays claimable here for as long as it has not been taken.
 * @param {object} props
 * @param {RaidHistoryEntry} props.entry
 */
const RaidSeasonDetails = ({ entry }) => {
    const lang = langManager.curr['raids'];
    const images = user.raids.GetRaidImages(entry.imageID);

    const end = new Date(entry.endTime * 1000);
    const endText = `${end.getDate()} ${langManager.curr['dates']['months-min'][end.getMonth()]}`;
    const self = entry.self;

    return (
        <ScrollView
            ref={user.interface.bottomPanel?.mover.SetScrollView}
            style={styles.page}
            onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
            onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
            scrollEnabled={false}
        >
            <View style={styles.header}>
                <Image style={styles.image} source={images.boss} resizeMode='cover' />
                <View style={styles.headerText}>
                    <Text style={styles.left} fontSize={22} bold numberOfLines={1}>
                        {langManager.GetText(entry.name)}
                    </Text>
                    <Text style={styles.left} fontSize={14} color='secondary' numberOfLines={1}>
                        {langManager.GetText(entry.bossName)}
                    </Text>
                    <View style={styles.badges}>
                        <View
                            style={[
                                styles.badge,
                                { backgroundColor: themeManager.GetColor('raid', { opacity: 0.25 }) }
                            ]}
                        >
                            <Text fontSize={10} color='raid'>
                                {lang['season'].replace('{}', entry.number.toString())}
                            </Text>
                        </View>
                        <Text fontSize={11} color={entry.defeated ? 'success' : 'light'}>
                            {entry.defeated ? lang['history-boss-defeated'] : lang['history-boss-survived']}
                        </Text>
                    </View>
                    <Text style={styles.left} fontSize={11} color='light'>
                        {lang['history-ended-on'].replace('{}', endText)}
                    </Text>
                </View>
            </View>

            {self === null ? (
                <Text style={styles.notParticipated} fontSize={14} color='secondary'>
                    {lang['history-not-participated']}
                </Text>
            ) : (
                <View style={styles.kpiContainer}>
                    <KPI
                        style={styles.kpi}
                        title={lang['kpi-rank']}
                        value={self.finalRank === null ? '—' : `#${self.finalRank}`}
                    />
                    <KPI
                        style={styles.kpi}
                        containerStyle={styles.kpiMiddle}
                        title={lang['kpi-points']}
                        value={FormatThousands(self.damage)}
                    />
                    <KPI style={styles.kpi} title={lang['kpi-activities']} value={self.hits} />
                </View>
            )}

            {self !== null && (
                <Text style={styles.duration} fontSize={12} color='light'>
                    {FormatMinutes(self.minutes)}
                </Text>
            )}

            <View style={styles.rewards}>
                {entry.rewards.length === 0 ? (
                    <Text fontSize={12} color='secondary'>
                        {lang['reward-none']}
                    </Text>
                ) : (
                    <>
                        <View style={styles.rewardList}>
                            {entry.rewards.map((reward, index) => (
                                <Reward key={`season-reward-${index}`} item={reward} size={40} />
                            ))}
                        </View>
                        {entry.rewardState !== 'none' && (
                            <ClaimRewardButton
                                style={styles.claim}
                                seasonID={entry.id}
                                claimed={entry.rewardState === 'claimed'}
                                rewardsCount={entry.rewards.length}
                            />
                        )}
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default RaidSeasonDetails;

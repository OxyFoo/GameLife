import * as React from 'react';
import { View, Image, Dimensions } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import RaidSeasonDetails from 'Interface/PageView/RaidSeasonDetails';
import { Button, Icon, Text } from 'Interface/Components';
import { FormatMinutes, FormatThousands } from 'Utils/Raids';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHistoryEntry} RaidHistoryEntry
 * @typedef {import('../back').LoadingState} LoadingState
 */

/**
 * @param {object} props
 * @param {RaidHistoryEntry} props.entry
 */
function HistoryRow({ entry }) {
    const lang = langManager.curr['raids'];
    const images = user.raids.GetRaidImages(entry.imageID);

    const end = new Date(entry.endTime * 1000);
    const endText = `${end.getDate()} ${langManager.curr['dates']['months-min'][end.getMonth()]}`;

    const self = entry.self;
    const detail =
        self === null
            ? lang['history-not-participated']
            : [
                  FormatMinutes(self.minutes),
                  lang['points'].replace('{}', FormatThousands(self.damage)),
                  self.finalRank !== null ? lang['rank'].replace('{}', self.finalRank.toString()) : null
              ]
                  .filter((part) => part !== null)
                  .join(' · ');

    const onPress = () => {
        const screen = Dimensions.get('window');
        user.interface.bottomPanel?.Open({
            content: <RaidSeasonDetails entry={entry} />,
            maxPosY: screen.height * 0.8
        });
    };

    return (
        <Button
            style={styles.historyRow}
            styleContent={styles.historyContent}
            appearance='uniform'
            color='transparent'
            onPress={onPress}
        >
            <Image style={styles.historyImage} source={images.boss} resizeMode='cover' />
            <View style={styles.historyText}>
                <Text style={styles.historyLeft} fontSize={16} bold numberOfLines={1}>
                    {langManager.GetText(entry.name)}
                </Text>
                <Text style={styles.historyLeft} fontSize={12} color={self === null ? 'secondary' : 'primary'}>
                    {detail}
                </Text>
                <Text style={styles.historyLeft} fontSize={11} color='light'>
                    {lang['history-ended-on'].replace('{}', endText)}
                </Text>
            </View>
            <View style={styles.historyRight}>
                <View style={[styles.badge, { backgroundColor: themeManager.GetColor('raid', { opacity: 0.25 }) }]}>
                    <Text fontSize={10} color='raid'>
                        {lang['season'].replace('{}', entry.number.toString())}
                    </Text>
                </View>
                {entry.rewardState === 'claimable' && <Icon icon='gift' size={18} color='raid' />}
            </View>
        </Button>
    );
}

/**
 * Settled seasons (closed, or still open with the boss down or the scoring over), newest first,
 * with the participation of the player
 * @param {object} props
 * @param {LoadingState} props.state
 * @param {RaidHistoryEntry[]} props.entries
 * @param {() => void} props.onRetry
 */
function History({ state, entries, onRetry }) {
    const lang = langManager.curr['raids'];

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} color='border'>
                    {lang['history-title']}
                </Text>
            </View>

            {(state === 'error-connection' || state === 'error-server') && (
                <View style={styles.centered}>
                    <Text color='white'>
                        {state === 'error-connection' ? lang['error-connection'] : lang['error-loading']}
                    </Text>
                    <Button style={styles.retryButton} appearance='outline' onPress={onRetry}>
                        {lang['retry']}
                    </Button>
                </View>
            )}

            {(state === 'loaded' || state === 'loading') && (
                <>
                    {state === 'loaded' && entries.length === 0 && (
                        <View style={styles.centered}>
                            <Text color='secondary'>{lang['history-empty']}</Text>
                        </View>
                    )}
                    {entries.map((entry) => (
                        <HistoryRow key={`raid-season-${entry.number}`} entry={entry} />
                    ))}
                </>
            )}
        </View>
    );
}

export { History };

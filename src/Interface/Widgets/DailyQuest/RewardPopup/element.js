import React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button, ProgressBar, Reward } from 'Interface/Components';
import { ACTIVITY_MINUTES_PER_DAY } from 'Data/User/DailyQuests';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Data/User/DailyQuests').DailyQuestDay} DailyQuestDay
 * @typedef {import('Data/User/DailyQuests').DailyQuestData} DailyQuestData
 */

/**
 * @param {Object} props
 * @param {StyleProp} [props.style] Style of the container
 * @param {DailyQuestDay} props.item DailyQuestDay object
 * @param {DailyQuestData | null} props.claimList Current claim list or null if not available yet
 * @param {(index: number) => Promise<void>} [props.handleClaim] Function called when the user press the button
 * @returns {JSX.Element}
 */
const DailyQuestDayItem = (props) => {
    const lang = langManager.curr['daily-quest'];
    const langD = langManager.curr['dates']['names'];

    const [loading, setLoading] = React.useState(false);

    const { item } = props;

    const handleEvent = async () => {
        if (loading || props.claimList === null) return;

        setLoading(true);
        const { claimList } = props;
        const result = await user.dailyQuest.ClaimReward(claimList.start, [item.index]);

        if (result !== 'success') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-claim-error-title'],
                    message: lang['alert-claim-error-message'].replace('{}', result)
                },
                callback: () => setLoading(false),
                cancelable: false,
                priority: true
            });
            return;
        }

        props.handleClaim && (await props.handleClaim(item.index));
        setLoading(false);
    };

    const currentDay = item.index + 1;

    /** @type {StyleProp} */
    const styleItem = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };

    /** @type {StyleProp} */
    const styleOpacity = {
        opacity: item.status === 'claimed' ? 0.5 : 1
    };

    return (
        <View style={[styles.item, styleItem, props.style]}>
            <View style={[styles.content, styleOpacity]}>
                <Text style={styles.itemDay}>{`${langD['day']} ${currentDay}`}</Text>

                {item.rewards.map((reward, index) => (
                    <Reward key={`dailyquest-reward-${index}`} item={reward} />
                ))}
            </View>

            <View style={styles.claimState}>
                {item.status === 'to-do' && (
                    <>
                        <Text style={styles.claimTomorrow}>{lang['container-todo']}</Text>
                        <ProgressBar
                            style={styles.claimTodayProgressbar}
                            height={6}
                            value={user.dailyQuest.currentQuest.Get().progression}
                            maxValue={ACTIVITY_MINUTES_PER_DAY}
                        />
                    </>
                )}
                {item.status === 'claim-tomorrow' && (
                    <Text style={styles.claimTomorrow}>{lang['container-tomorrow']}</Text>
                )}
                {(item.status === 'to-claim' || loading) && (
                    <Button style={styles.claimButton} color='transparent' onPress={handleEvent} loading={loading}>
                        {lang['popup']['claim']}
                    </Button>
                )}
                {item.status === 'claimed' && <Icon icon='check' color='success' />}
            </View>
        </View>
    );
};

export { DailyQuestDayItem };

import * as React from 'react';
import { View } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'achievement-pending'>} NotificationInAppAchievements
 */

/**
 * @param {object} props
 * @param {NotificationInAppAchievements} props.notif
 * @param {number} props.index
 * @returns {React.JSX.Element | null}
 */
function NIA_AchievementPending({ notif }) {
    const lang = langManager.curr['notifications']['in-app'];
    const [loading, setLoading] = React.useState(false);

    const achievement = dataManager.achievements.GetByID(notif.data.achievementID);
    if (achievement === null) {
        return null;
    }

    const achievementTitle = langManager.GetText(achievement.Name);

    const claimHandle = async () => {
        const langAch = langManager.curr['achievements'];

        // Claim the achievement
        setLoading(true);
        const claimRewards = await user.achievements.Claim(notif.data.achievementID);
        setLoading(false);

        // An error occurred
        if (claimRewards === null) {
            const title = langAch['alert-achievement-error-title'];
            const message = langAch['alert-achievement-error-message'];
            user.interface.notificationsInApp?.Close();
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        const executedRewards = await user.rewards.ExecuteRewards(claimRewards);
        if (!executedRewards) {
            user.interface.console?.AddLog(
                'error',
                `[NIA_AchievementPending] Failed to execute rewards for achievement ${notif.data.achievementID}`
            );
            this.claimAchievementLoading = false;
            return;
        }

        // Get popup content
        const title = langAch['alert-achievement-title'];
        const achievementName = langManager.GetText(achievement.Name);
        const message = langAch['alert-achievement-text'].replace('{}', achievementName);
        await user.rewards.ShowRewards(title, message, claimRewards);

        // Show popup
        user.interface.notificationsInApp?.Close();
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
    };

    return (
        <View style={styles.achievementPendingContainer}>
            <View style={styles.achievementPendingText}>
                <Text fontSize={16}>{lang['achievement-pending-text'].replace('{}', achievementTitle)}</Text>
            </View>

            <View style={styles.achievementPendingButtons}>
                <Button style={styles.achievementPendingButton} color='main1' onPress={claimHandle} loading={loading}>
                    {lang['achievement-pending-claim']}
                </Button>
            </View>
        </View>
    );
}

export default NIA_AchievementPending;

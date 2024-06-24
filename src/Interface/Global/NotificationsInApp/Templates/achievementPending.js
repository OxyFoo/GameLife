import * as React from 'react';
import { View } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'achievement-pending'>} NotificationInApp
 */

/**
 * @param {object} props
 * @param {NotificationInApp} props.notif
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
        setLoading(true);
        const claimText = await user.achievements.Claim(notif.data.achievementID);
        setLoading(false);

        if (claimText === null) {
            return;
        }

        if (claimText === false) {
            const title = langAch['alert-achievement-error-title'];
            const message = langAch['alert-achievement-error-message'];
            user.interface.notificationsInApp.Close();
            user.interface.popup.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        const title = langAch['alert-achievement-title'];
        user.interface.notificationsInApp.Close();
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message: claimText }
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

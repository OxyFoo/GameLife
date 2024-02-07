import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
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
 * @returns {JSX.Element}
 */
function NIA_AchievementPending({ notif, index }) {
    const [ loading, setLoading ] = React.useState(false);

    const achievement = dataManager.achievements.GetByID(notif.data.achievementID);
    const achievementTitle = dataManager.GetText(achievement.Name);

    const claimHandle = async () => {
        setLoading(true);
        const text = await user.achievements.Claim(notif.data.achievementID);
        setLoading(false);

        if (text === false) {
            return;
        }

        const lang = langManager.curr['achievements'];
        const title = lang['alert-achievement-title'];

        user.interface.notificationsInApp.Close();
        user.interface.popup.Open('ok', [ title, text ]);
    };

    return (
        <View style={styles.achievementPendingContainer}>
            <View style={styles.achievementPendingText}>
                <Text fontSize={16}>
                    {`[Succès dévérouillé: ] ${achievementTitle}`}
                </Text>
            </View>

            <View style={styles.achievementPendingButtons}>
                <Button
                    style={styles.achievementPendingButton}
                    color='main1'
                    onPress={claimHandle}
                    loading={loading}
                >
                    [Claim]
                </Button>
            </View>
        </View>
    );
}

export default NIA_AchievementPending;

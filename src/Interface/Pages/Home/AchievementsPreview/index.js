import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Achievements').Achievement} Achievement
 */

/**
 * @param {object} props
 * @param {import('react-native').ViewStyle} [props.style]
 * @param {number} [props.maxAchievements] Number of last unlocked achievements to display
 */
function AchievementsPreview({ style, maxAchievements = 3 }) {
    const [state, setState] = React.useState(() => getAchievementsState(maxAchievements));

    React.useEffect(() => {
        const listener = user.achievements.achievements.AddListener(() => {
            setState(getAchievementsState(maxAchievements));
        });
        return () => {
            user.achievements.achievements.RemoveListener(listener);
        };
    }, [maxAchievements]);

    const openAchievements = () => {
        user.interface.ChangePage('achievements');
    };

    const lang = langManager.curr['home'];
    const { lastAchievements, unlockedCount, totalCount } = state;

    /** @param {Achievement} achievement */
    const renderAchievement = (achievement) => (
        <View key={`achievement-preview-${achievement.ID}`} style={styles.achievement}>
            <Icon icon='success' size={14} color='main1' />
            <Text style={styles.achievementText} fontSize={12} numberOfLines={2}>
                {langManager.GetText(achievement.Name)}
            </Text>
        </View>
    );

    return (
        <Button
            style={[styles.button, style]}
            onPress={openAchievements}
            gradientColors={[
                themeManager.GetColor('main1', { opacity: 0.25 }),
                themeManager.GetColor('main1', { opacity: 0.08 })
            ]}
            gradientColorsAngle={90}
        >
            <View style={styles.header}>
                <View style={styles.title}>
                    <Text fontSize={16}>{lang['btn-achievements']}</Text>
                    <Text fontSize={12} color='light'>{`${unlockedCount}/${totalCount}`}</Text>
                </View>
                <Icon color='gradient' size={24} icon='arrow-square-outline' angle={90} />
            </View>

            {lastAchievements.length === 0 ? (
                <Text style={styles.emptyText} fontSize={12} color='light'>
                    {lang['container-achievements-empty']}
                </Text>
            ) : (
                <View style={styles.achievementsContainer}>{lastAchievements.map(renderAchievement)}</View>
            )}
        </Button>
    );
}

/**
 * @param {number} maxAchievements Number of last unlocked achievements to keep
 * @returns {{ lastAchievements: Achievement[], unlockedCount: number, totalCount: number }}
 */
function getAchievementsState(maxAchievements) {
    return {
        lastAchievements: user.achievements.GetLast(maxAchievements),
        unlockedCount: user.achievements.achievements.Get().length,
        totalCount: dataManager.achievements.Get().length
    };
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 8,
        paddingHorizontal: 2
    },
    title: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    achievementsContainer: {
        width: '100%',
        gap: 8
    },
    achievement: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    achievementText: {
        flexShrink: 1
    },
    emptyText: {
        textAlign: 'center'
    }
});

export { AchievementsPreview };

import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

/** @param {{ style?: import('react-native').ViewStyle }} props */
function AchievementPreview({ style }) {
    const [state, setState] = React.useState(() => {
        const lastAchievements = user.achievements.GetLast(1);
        const allAchievements = user.achievements.achievements.Get();
        return {
            lastAchievement: lastAchievements.length > 0 ? lastAchievements[0] : null,
            unlockedCount: allAchievements.length,
            totalCount: dataManager.achievements.Get().length
        };
    });

    React.useEffect(() => {
        const updateAchievements = () => {
            const lastAchievements = user.achievements.GetLast(1);
            const allAchievements = user.achievements.achievements.Get();
            setState({
                lastAchievement: lastAchievements.length > 0 ? lastAchievements[0] : null,
                unlockedCount: allAchievements.length,
                totalCount: dataManager.achievements.Get().length
            });
        };

        const listener = user.achievements.achievements.AddListener(updateAchievements);
        return () => {
            user.achievements.achievements.RemoveListener(listener);
        };
    }, []);

    const openAchievements = () => {
        user.interface.ChangePage('achievements');
    };

    const { lastAchievement, unlockedCount, totalCount } = state;
    const lang = langManager.curr['home'];

    return (
        <Button
            style={[styles.button, style]}
            onPress={openAchievements}
            gradientColors={[
                themeManager.GetColor('main1', { opacity: 0.25 }),
                themeManager.GetColor('main1', { opacity: 0.15 })
            ]}
            gradientColorsAngle={90}
        >
            {unlockedCount === 0 ? (
                <>
                    <Icon icon='success' size={24} color='main1' />
                    <Text style={styles.emptyText} fontSize={14} color='light'>
                        {lang['container-achievements-empty']}
                    </Text>
                </>
            ) : (
                <View style={styles.row}>
                    <View style={styles.countBadge}>
                        <Icon icon='success' size={14} color='main1' />
                        <Text style={styles.countText} fontSize={12} bold>
                            {`${unlockedCount}/${totalCount}`}
                        </Text>
                    </View>
                    {lastAchievement && (
                        <Text style={styles.achievementName} fontSize={11} color='light' numberOfLines={1}>
                            {langManager.GetText(lastAchievement.Name)}
                        </Text>
                    )}
                </View>
            )}
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    countText: {
        marginTop: 1
    },
    achievementName: {
        flex: 1,
        textAlign: 'right'
    },
    emptyText: {
        marginLeft: 6
    }
});

export { AchievementPreview };

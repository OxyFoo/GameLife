// TODO: Delete ?

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
                themeManager.GetColor('main1', { opacity: 0.75 }),
                themeManager.GetColor('background', { opacity: 0.9 })
            ]}
            gradientColorsAngle={90}
        >
            {unlockedCount === 0 || lastAchievement === null ? (
                <>
                    <Icon icon='success' size={24} color='main1' />
                    <Text style={styles.emptyText} fontSize={14} color='light'>
                        {lang['container-achievements-empty']}
                    </Text>
                </>
            ) : (
                <View style={styles.row}>
                    <View style={styles.countBadge}>
                        <Icon style={styles.countIcon} icon='success' size={24} color='main1' />
                        <Text style={styles.countText} fontSize={18} bold>
                            {`${unlockedCount}/${totalCount}`}
                        </Text>
                    </View>

                    <View style={styles.verticalBar} />

                    <Text style={styles.achievementName} fontSize={14} color='white'>
                        {langManager.GetText(lastAchievement.Name)}
                    </Text>
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 8
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    countIcon: {
        marginRight: 4
    },
    countText: {
        marginTop: 1
    },
    achievementName: {
        flexShrink: 1
    },
    emptyText: {
        marginLeft: 6
    },
    verticalBar: {
        width: 1,
        height: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    }
});

export { AchievementPreview };

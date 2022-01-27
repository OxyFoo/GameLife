import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import BackAchievements from '../PageBack/Achievements';
import user from '../../Managers/UserManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Page, Text } from '../Components';
import { PageHeader } from '../Widgets';

class Achievements extends BackAchievements {
    renderAchievement({ item: achievement }) {
        const name = dataManager.GetText(achievement.Name);
        const description = dataManager.GetText(achievement.Description);
        const style = user.achievements.solved.includes(parseInt(achievement.ID)) ?
                      [styles.achievementsBox, { backgroundColor: themeManager.colors['black'] }] :
                      [styles.achievementsBox, styles.unsolved, { backgroundColor: themeManager.colors['black'] }];

        return (
            <View style={styles.achievementsContainer}>
                <View style={style}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.description} color='secondary'>{description}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <Page canScrollOver={false} bottomOffset={0}>
                <PageHeader onBackPress={user.interface.BackPage} />

                <FlatList
                    style={{ height: '85%' }}
                    data={this.achievement}
                    keyExtractor={(item, i) => 'achievement-' + i}
                    renderItem={this.renderAchievement}
                    numColumns={2}
                />
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    achievementsContainer: {
        width: '50%',
        padding: '3%'
    },
    achievementsBox: {
        height: 172,
        display: 'flex',
        justifyContent: 'space-evenly',
        padding: '4%',
        borderColor: '#FFFFFF',
        borderWidth: 4,
        borderRadius: 8
    },
    unsolved: {
        borderColor: '#888888'
    },
    title: {
        minHeight: 30,
        marginBottom: 12,
        fontSize: 18
    },
    description: {
        marginBottom: 12,
        fontSize: 14
    }
});

export default Achievements;
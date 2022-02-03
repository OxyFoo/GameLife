import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

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
        const isSolved = user.achievements.Get().includes(parseInt(achievement.ID));

        const style = isSolved ? [styles.achievementsBox, { backgroundColor: themeManager.colors['black'] }] :
                                 [styles.achievementsBox, styles.unsolved, { backgroundColor: themeManager.colors['black'] }];

        return (
            <TouchableOpacity style={styles.achievementsContainer} activeOpacity={.6}>
                <View style={style}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.description} color='secondary'>{description}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Page scrollable={false} bottomOffset={0}>
                <PageHeader onBackPress={user.interface.BackPage} />

                <View style={{ height: '85%' }}>
                    <FlatList
                        numColumns={2}
                        data={this.achievement}
                        keyExtractor={(item, i) => 'achievement-' + i}
                        renderItem={this.renderAchievement}
                    />
                </View>
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
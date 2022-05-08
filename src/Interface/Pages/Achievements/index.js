import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import BackAchievements from './back';
import user from '../../../Managers/UserManager';
import themeManager from '../../../Managers/ThemeManager';

import { Page, Text } from '../../Components';
import { PageHeader } from '../../Widgets';

class Achievements extends BackAchievements {
    renderAchievement = ({ item: achievement }) => {
        const { ID, Name, Description, isSolved } = achievement;

        const style = [
            styles.achievementsBox,
            {
                borderColor: themeManager.GetColor(isSolved ? 'main1' : '#888888'),
                backgroundColor: themeManager.GetColor('backgroundGrey')
            }
        ];

        return (
            <TouchableOpacity
                style={styles.achievementsContainer}
                onPress={() => this.onAchievementPress(ID)}
                activeOpacity={.6}
            >
                <View style={style}>
                    <Text style={styles.title}>{Name}</Text>
                    <Text style={styles.description} color='secondary'>{Description}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Page scrollable={false} bottomOffset={0}>
                <PageHeader onBackPress={user.interface.BackPage} />

                <FlatList
                    style={{ height: '85%' }}
                    numColumns={2}
                    data={this.achievement}
                    keyExtractor={(item, i) => 'achievement-' + i}
                    renderItem={this.renderAchievement}
                />
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    achievementsContainer: {
        width: '50%',
        padding: 6
    },
    achievementsBox: {
        height: 172,
        display: 'flex',
        justifyContent: 'space-evenly',
        padding: 6,
        borderWidth: 2,
        borderRadius: 8
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
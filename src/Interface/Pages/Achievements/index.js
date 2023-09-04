import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import BackAchievements from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Page, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Achievements extends BackAchievements {
    renderAchievement = ({ item: achievement }) => {
        const { ID, Name, Description, isSolved } = achievement;

        const style = [
            styles.achievementsBox,
            {
                borderColor: isSolved ?
                    themeManager.GetColor('main1') :
                    themeManager.ApplyOpacity('#888888'),
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
        const styleFlatlist = {
            ...styles.flatlist,
            top: this.state.headerHeight
        };

        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                <View onLayout={this.onLayout}>
                    <PageHeader onBackPress={user.interface.BackHandle} />
                </View>

                <FlatList
                    style={styleFlatlist}
                    numColumns={2}
                    data={this.achievement}
                    keyExtractor={(item, i) => 'achievement-' + i}
                    renderItem={this.renderAchievement}
                />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    flatlist: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 0
    },

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
import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import Achievements from '../../Pages/achievements';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLHeader, GLText } from '../../Components/GL-Components';

class T0Achievements extends Achievements {
    achievementRender({ item }) {
        const achievement = item;
        const name = achievement.Name;
        const description = achievement.Description;
        const style = user.solvedAchievements.includes(parseInt(achievement.ID)) ?
                      styles.achievementsBox :
                      [styles.achievementsBox, styles.unsolved];

        return (
            <View style={styles.achievementsContainer}>
                <View style={style}>
                    <GLText style={styles.title} title={name} />
                    <GLText style={styles.description} title={description} color="grey" />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['achievements']['page-title']}
                    //small={true}
                    leftIcon="back"
                    onPressLeft={user.backPage}
                />

                {/* Content */}
                <View style={styles.container}>
                    <FlatList
                        data={this.achievement}
                        keyExtractor={(item, i) => 'achievements' + i}
                        renderItem={this.achievementRender}
                        numColumns={2}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24
    },
    achievementsContainer: {
        width: '50%',
        padding: 12
    },
    achievementsBox: {
        height: 128,
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingVertical: 12,
        paddingHorizontal: 6,
        borderColor: '#FFFFFF',
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        backgroundColor: '#000000'
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
        fontSize: 12
    }
});

export { T0Achievements };
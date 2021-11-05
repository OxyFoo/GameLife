import * as React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import Achievements from '../back/achievements';
import { GLHeader, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class T0Achievements extends Achievements {
    achievementRender({ item }) {
        const achievement = item;
        const name = achievement.Name;
        const description = achievement.Description;
        const style = user.solvedAchievements.includes(parseInt(achievement.ID)) ?
                      [styles.achievementsBox, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }] :
                      [styles.achievementsBox, styles.unsolved, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }];

        return (
            <View style={styles.achievementsContainer}>
                <View style={style}>
                    <GLText style={styles.title} title={name} />
                    <GLText style={styles.description} title={description} color="secondary" />
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

// juste pour avoir la taille de l'écran 
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: "3.5%",
        
    },
    achievementsContainer: {
        width: '50%',
        padding: "3.2%", 
        
    },
    achievementsBox: {
        height: wh * 19 / 100,
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingVertical: "5%",
        paddingHorizontal: "5%",
        borderColor: '#FFFFFF',
        borderTopWidth: ww * 16 / 1000 ,
        borderBottomWidth: ww * 16 / 1000 ,
        borderLeftWidth: ww * 16 / 1000 ,
        borderRightWidth: ww * 16 / 1000 ,
        
    },
    unsolved: {
        borderColor: '#888888'
        
    },
    title: {
        minHeight: 30,
        marginBottom:  wh * 18 / 1000 ,
        fontSize:  ww * 48 / 1000 ,
    },
    description: {
        marginBottom: 12,
        fontSize:  ww * 32 / 1000 ,
    }
});

export { T0Achievements };
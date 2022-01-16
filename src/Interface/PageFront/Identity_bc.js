import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import BackIdentity from '../PageBack/identity';
import { GLDropDown, GLText, GLTextEditable } from '../Components';
import { IsUndefined } from '../../Functions/Functions';

class Identity extends BackIdentity {
    render() {
        const age = this.calculateAge(this.state.birth) || '?';
        const totalDuration = user.activities.GetTotalDuration();
        const totalH = Math.floor(totalDuration/60);
        const totalM = ((totalDuration/60) - totalH) * 60;
        const totalLang = langManager.curr['identity']['value-totaltime'];
        const totalTxt = totalLang.replace('{}', totalH).replace('{}', totalM);
        const title = dataManager.titles.GetTitleByID(this.state.title) || langManager.curr['identity']['empty-title'];
        const titles = user.GetUnlockTitles();

        let names = [];
        let descriptions = [];
        let solvedAchievements = [...user.achievements.solved];
        solvedAchievements.reverse();

        const max = Math.min(solvedAchievements.length, 3);
        for (let i = 0; i < max; i++) {
            const achievementID = solvedAchievements[i];
            const achievement = user.GetAchievementByID(achievementID);
            if (!IsUndefined(achievement)) {
                names.push(achievement.Name);
                descriptions.push(achievement.Description);
            }
        }

        return (
            <View style={{flex: 1}}>
                {/* Content */}
                <View style={styles.content}>
                    {/* Pseudo */}
                    <GLText style={styles.text} title={langManager.curr['identity']['name-username'].toUpperCase()} />
                    <GLTextEditable
                        style={styles.value}
                        value={this.state.username}
                        onChangeText={this.editPseudo}
                        beforeChangeText={this.beforeEditPseudo}
                        placeholder={langManager.curr['identity']['placeholder-username']}
                    />

                    {/* Email */}
                    <GLText style={styles.text} title={langManager.curr['identity']['name-email'].toUpperCase() + " - " + user.server.status} />
                    <GLText style={styles.value} title={user.settings.email} />

                    {/* Title */}
                    <GLText style={styles.text} title={langManager.curr['identity']['name-title'].toUpperCase()} />
                    <GLDropDown
                        style={styles.value}
                        value={title}
                        data={titles}
                        onSelect={this.editTitle}
                        simpleText={true}
                        forcePopupMode={true}
                    />

                    {/* Age */}
                    <GLText style={styles.text} title={langManager.curr['identity']['name-age'].toUpperCase()} />
                    <GLText style={styles.value} title={langManager.curr['identity']['value-age'].replace('{}', age)} onPress={this.ageClick} color='secondary' />

                    {/* Total time */}
                    <GLText style={styles.text} title={langManager.curr['identity']['name-totaltime'].toUpperCase()} />
                    <GLText style={styles.value} title={totalTxt} color='secondary' />
                </View>
            </View>
        )
    }
}

const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    content: { 
        paddingHorizontal: "8%",
        paddingVertical: "5%",
        
    },
    containerPseudo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    text: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: ww * 64 / 1000,
        marginBottom: "3%",

    },
    value: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: ww * 586 / 10000,
        marginBottom: "10%"
    },

    achievementsContainer: { 
        height: wh * 165 / 1000,
        display: 'flex',
        flexDirection: 'row',
        
    },
    achievementsBox: { 
        flex: 1,
        maxWidth: '30%',
        display: 'flex',
        justifyContent: 'space-evenly',
        marginHorizontal: "2%",
        paddingVertical: "2%",
        paddingHorizontal: "2%",
        borderColor: '#FFFFFF',
        borderTopWidth: ww * 11 / 1000,
        borderBottomWidth: ww * 11 / 1000,
        borderLeftWidth: ww * 11 / 1000,
        borderRightWidth: ww * 11 / 1000,
        
    },
    title: { 
        minHeight: wh * 45 / 1000,
        marginBottom: "15%",
        fontSize: ww * 426 / 10000,
    },
    description: { 
        marginBottom: "10%",
        fontSize:ww*26/1000 ,
    }
});

export default Identity;
import * as React from 'react';
import { View, StyleSheet, ScrollView, Dimensions} from 'react-native';

import Dailyquest from '../../Pages/dailyquest';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLButton, GLDropDown, GLHeader, GLSvg, GLText } from './Components/GL-Components';
import { GetTimeToTomorrow, isUndefined } from '../../Functions/Functions';

class T0Dailyquest extends Dailyquest {
    content = () => {
        const define = () => {
            const define = langManager.curr['dailyquest']['daily-define-title'];
            const skillName1 = !isUndefined(this.state.selectedSkill1) ? user.getSkillByID(this.state.selectedSkill1).Name : langManager.curr['dailyquest']['daily-define-cat1'];
            const skillName2 = !isUndefined(this.state.selectedSkill2) ? user.getSkillByID(this.state.selectedSkill2).Name : langManager.curr['dailyquest']['daily-define-cat2'];
            const save = langManager.curr['dailyquest']['daily-define-button'];
            return (
                <View style={styles.fullscreen}>
                    <GLText style={styles.titleS} title={define} />
                    <GLDropDown
                        style={{ width: '60%' }}
                        value={skillName1}
                        data={this.SKILLS}
                        onSelect={this.changeSkill1}
                        onLongPress={() => this.changeSkill1('')}
                    />
                    <GLDropDown
                        style={{ width: '60%' }}
                        value={skillName2}
                        data={this.SKILLS}
                        onSelect={this.changeSkill2}
                        onLongPress={() => this.changeSkill2('')}
                    />
                    <GLButton
                        containerStyle={styles.button}
                        value={save}
                        onPress={this.saveClick}
                    />
                </View>
            )
        }

        const quests = () => {
            let skills;
            const dailySkills = user.quests.dailyGetSkills();
            if (this.state.enable && dailySkills != null) {
                const skillsIDs = dailySkills.skills;
                const skillName1 = user.getSkillByID(skillsIDs[0]).Name;
                const skillName2 = user.getSkillByID(skillsIDs[1]).Name;
                skills = skillName1 + langManager.curr['dailyquest']['daily-categories-text'] + skillName2;
            }
            const title = langManager.curr['dailyquest']['daily-title'];
            const bonus = langManager.curr['dailyquest']['bonus-title'];
            const edit = langManager.curr['dailyquest']['daily-edit-button'];

            const questMain = langManager.curr['dailyquest']['quest-main-text'];
            const questBonus = langManager.curr['dailyquest']['quest-bonus-text'];

            return (
                <>
                    <GLText style={styles.title} title={title} />
                    <View style={styles.blockContainer}>
                        <View style={styles.row}>
                            <GLSvg style={styles.icon} xml={this.daily_states[0] >= 1 ? 'check' : 'uncheck'} />
                            <GLText style={styles.textList} title={questMain} />
                        </View>
                        <GLText title={skills} style={{ marginVertical: 12 }} />
                    </View>

                    <GLText style={styles.title} title={bonus} />
                    <View style={styles.blockContainer}>
                        <View style={styles.row}>
                            <GLSvg style={styles.icon} xml={this.daily_states[1] >= 1 ? 'check' : 'uncheck'} />
                            <GLText style={styles.textList} title={questBonus} />
                        </View>
                        <GLText title={this.daily_bonus} style={{ marginVertical: 12 }} />
                    </View>

                    <View style={styles.center}>
                        <GLButton
                            containerStyle={styles.button}
                            value={edit}
                            onPress={this.edit}
                        />
                    </View>
                </>
            )
        }

        const informations = () => {
            const title = langManager.curr['dailyquest']['alert-info-title'];
            const text = langManager.curr['dailyquest']['alert-info-text'];
            return (
                <ScrollView style={{ padding: 24 }}>
                    <GLText style={{ paddingVertical: 12, fontSize: 26 }} title={title} />
                    <GLText style={styles.largetext} title={text} />
                </ScrollView>
            )
        }

        let page = (<></>);
        if (this.state.informations) page = informations();
        else if (this.state.enable) page = quests();
        else page = define();
        return page;
    }

    render() {
        const dailyquestTime = langManager.curr['dailyquest']['info-remain-time'] + GetTimeToTomorrow();

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['dailyquest']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                    rightIcon={this.state.informations ? "" : "info"}
                    onPressRight={this.info}
                    small={true}
                />

                {/* Content */}
                <View style={styles.container}>
                    <GLText style={styles.remainTime} title={dailyquestTime} />
                    <this.content />
                </View>
            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: "5%"
    },
    fullscreen: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    icon: {
        width: ww * 64 / 1000, 
        height: ww * 64 / 1000, 
        margin: "4%", 
    },

    remainTime: {
        marginRight: "5%",
        textAlign: 'right',
    },
    title: {
        paddingVertical: "10%",
        fontSize: ww * 693 / 10000,
        
    },
    text: { // C'EST LE TEXT DE QUOI CA WESH 
        paddingVertical: 6, // JE PEUX PAS BIEN FAIRE LE PADDING PARCE QUE JE SAIS PAS OU EST LE TEXTE 
        fontSize: ww * 53 / 1000,  
    },

    largetext: {
        textAlign: 'justify',
        paddingVertical: "2%",
        fontSize: ww * 426 / 10000,
        lineHeight: wh * 239 / 10000,
        
    },
    
    titleS: {
        paddingVertical: "2%",
        fontSize: ww * 693 / 10000
    },
    button: {
        width: ww * 437 / 1000,
        height: wh * 71 / 1000,
        marginTop: "7%"
    },

    blockContainer: {
        padding: "3%",
        marginHorizontal: "10%",
        borderWidth: 2,
        borderColor: '#FFFFFF',
        
        
    },
    textList: {
        width: '80%',
        marginVertical: "2%",
        lineHeight: wh * 269 / 10000,
        textAlign: 'left',
        
    }
});

export { T0Dailyquest };
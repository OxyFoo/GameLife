import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

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
            const dailySkills = user.dailyGetSkills();
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
                            <GLSvg style={styles.icon} xml={this.daily_states[0] >= 1 ? 'check' : 'uncheck'} />
                            <GLText style={styles.textList} title={questBonus} />
                        </View>
                        <GLText title={this.daily_bonus} style={{ marginVertical: 12 }} />
                    </View>

                    {!user.dailyAlreadyChanged() && (
                        <View style={styles.center}>
                            <GLButton
                                containerStyle={styles.button}
                                value={edit}
                                onPress={this.edit}
                            />
                        </View>
                    )}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24
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
        width: 24,
        height: 24,
        margin: 12
    },

    remainTime: {
        marginRight: 24,
        textAlign: 'right'
    },
    title: {
        paddingVertical: 48,
        fontSize: 26
    },
    text: {
        paddingVertical: 6,
        fontSize: 20
    },
    largetext: {
        textAlign: 'justify',
        paddingVertical: 6,
        fontSize: 16,
        lineHeight: 18
    },
    titleS: {
        paddingVertical: 12,
        fontSize: 26
    },
    button: {
        width: 164,
        height: 48,
        marginTop: 32
    },

    blockContainer: {
        padding: 12,
        marginHorizontal: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    textList: {
        width: '80%',
        marginVertical: 6,
        lineHeight: 18,
        textAlign: 'left'
    }
});

export { T0Dailyquest };
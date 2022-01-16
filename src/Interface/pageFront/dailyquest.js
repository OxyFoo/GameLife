import * as React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, FlatList, TouchableOpacity } from 'react-native';

import BackDailyquest from '../PageBack/Dailyquest';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

import { IsUndefined } from '../../Functions/Functions';
import { GetTimeToTomorrow } from '../../Functions/Time';
import { GLButton, GLDropDown, GLHeader, GLIconButton, GLInput, GLSvg, GLText } from '../Components';

class Dailyquest extends BackDailyquest {
    content = () => {
        const define = () => {
            const define = langManager.curr['dailyquest']['daily-define-title'];
            const skillName1 = !IsUndefined(this.state.selectedSkill1) ? dataManager.skills.GetByID(this.state.selectedSkill1).Name : langManager.curr['dailyquest']['daily-define-cat1'];
            const skillName2 = !IsUndefined(this.state.selectedSkill2) ? dataManager.skills.GetByID(this.state.selectedSkill2).Name : langManager.curr['dailyquest']['daily-define-cat2'];
            const save = langManager.curr['dailyquest']['daily-define-button'];
            return (
                <View style={{ alignItems: 'center' }}>
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
                        containerStyle={[styles.button, { width: '50%' }]}
                        value={save}
                        onPress={this.saveClick}
                    />
                </View>
            )
        }

        const quests = () => {
            let skills;
            const dailySkills = user.quests.DailyGetSkills();
            if (this.state.enable && dailySkills != null) {
                const skillsIDs = dailySkills.skills;
                const skillName1 = dataManager.skills.GetByID(skillsIDs[0]).Name;
                const skillName2 = dataManager.skills.GetByID(skillsIDs[1]).Name;
                skills = skillName1 + langManager.curr['dailyquest']['daily-categories-text'] + skillName2;
            }
            const title_quests = langManager.curr['dailyquest']['daily-title'];
            const edit = langManager.curr['dailyquest']['daily-edit-button'];

            const questMain = langManager.curr['dailyquest']['quest-main-text'];
            const questBonus = langManager.curr['dailyquest']['quest-bonus-text'];

            const title_todo = langManager.curr['dailyquest']['daily-task-title'];

            return (
                <>
                    <GLText style={styles.title} title={title_quests} />
                    <View style={styles.blockContainer}>
                        <View style={styles.row}>
                            <GLSvg style={styles.icon} xml={this.daily_states[0] >= 1 ? 'check' : 'uncheck'} />
                            <GLText style={styles.textList} title={questMain} />
                        </View>
                        <GLText title={skills} style={{ marginVertical: 12 }} />
                        <View style={styles.row}>
                            <GLSvg style={styles.icon} xml={this.daily_states[1] >= 1 ? 'check' : 'uncheck'} />
                            <GLText style={styles.textList} title={questBonus} />
                        </View>
                        <GLText title={this.state.daily_bonus} style={{ marginVertical: 12 }} />
                        <View style={styles.center}>
                            <GLButton
                                containerStyle={styles.button}
                                value={edit}
                                onPress={this.edit}
                            />
                        </View>
                    </View>

                    <View style={styles.titleTodo}>
                        <GLText style={styles.title} title={title_todo} />
                        <GLIconButton onPress={() => { this.selectTodo(-1); }} icon='plus' />
                    </View>
                    <FlatList
                        style={styles.blockContainer}
                        data={user.quests.todoList}
                        keyExtractor={(item, i) => 'todolist-task-' + i}
                        ItemSeparatorComponent={() => (
                            <View style={{ width: '60%', height: 1, marginLeft: '20%', backgroundColor: '#FFFFFF' }} />
                        )}
                        renderItem={({item, index}) => {
                            const check = item.complete;
                            const title = item.title;
                            let description = item.description || '';
                            description = description.split('\n').join(', ');
                            const maxCaracs = 15;
                            if (description.length >= maxCaracs) {
                                description.substr(0, Math.min(description.length, maxCaracs));
                                description += '...';
                            }
                            const selectEvent = () => { this.selectTodo(index) };
                            const toggleEvent = () => { this.toggleTodo(index) };

                            return (
                                <View style={styles.taskRow}>
                                    <TouchableOpacity style={styles.icon} activeOpacity={0.5} onPress={toggleEvent}>
                                        <GLSvg xml={check ? 'check' : 'uncheck'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.taskCol} activeOpacity={0.5} onPress={selectEvent}>
                                        <GLText style={styles.textList} title={title} />
                                        <GLText style={styles.textList} title={description} color={"secondary"} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </>
            )
        }

        const todolist = () => {
            const title_todo = langManager.curr['dailyquest']['daily-task-title'];
            const title = langManager.curr['dailyquest']['task-edit-title'];
            const title_subtask = langManager.curr['dailyquest']['task-edit-subtask'];
            const title_description = langManager.curr['dailyquest']['task-edit-description'];

            const bt_add = langManager.curr['dailyquest']['task-edit-add'];
            const bt_save = langManager.curr['dailyquest']['task-edit-save'];

            return (
                <>
                    <GLText style={styles.titleS} title={title_todo} />
                    <GLText style={styles.title} title={title} />
                    <GLInput
                        style={styles.input}
                        value={this.state.taskTitle}
                        onChangeText={this.onChangeTaskTitle}
                    />

                    {/*<GLText style={styles.title} title={title_subtask} />
                    <GLInput style={styles.input} />*/}

                    <GLText style={styles.title} title={title_description} />
                    <View style={styles.center}>
                        <GLInput
                            style={[styles.input, { width: '80%' }]}
                            value={this.state.taskDescription}
                            onChangeText={this.onChangeTaskDescription}
                            multiline
                        />
                    </View>

                    <View style={{ width: '60%', marginLeft: '20%', marginTop: 24 }}>
                        <GLButton
                            containerStyle={styles.button}
                            value={this.state.selectedTodo === -1 ? bt_add : bt_save}
                            onPress={this.saveTask}
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
        else if (this.state.selectedTodo !== null) page = todolist();
        else if (!this.state.enable) page = define();
        else page = quests();
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
        paddingVertical: '5%'
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
        margin: '4%'
    },

    remainTime: {
        marginRight: '5%',
        textAlign: 'right'
    },
    title: {
        textAlign: 'left',
        marginLeft: '10%',
        marginTop: 24,
        fontSize: ww * 7 / 100
    },
    titleTodo: {
        marginTop: 24,
        paddingRight: 24,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },

    largetext: {
        textAlign: 'justify',
        paddingVertical: '2%',
        fontSize: ww * 4.26 / 100,
        lineHeight: wh * 2 / 100
    },

    titleS: {
        paddingVertical: 24,
        fontSize: ww * 7 / 100
    },
    button: {
        width: '95%',
        height: 'auto',
        marginTop: 12,
        paddingVertical: 12
    },

    blockContainer: {
        padding: 12,
        marginTop: 24,
        marginHorizontal: '10%',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    },
    textList: {
        width: '80%',
        marginVertical: '2%',
        lineHeight: wh * 2 / 100,
        textAlign: 'left'
    },

    input: {
        justifyContent: 'center',
        marginVertical: 6
    },

    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 12
    },
    taskCol: {
        flex: 1,
        alignItems: 'center'
    }
});

export default Dailyquest;
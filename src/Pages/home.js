import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { dateToFormatString } from '../Functions/Functions';
import { GLActivityBox, GLDoubleCorner, GLHeader, GLIconButton, GLStats, GLText, GLXPBar } from '../Components/GL-Components';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // Average XP
        const firstDate = user.getFirstActivity();
        firstDate.setHours(0, 0, 0);
        const delta = (new Date()) - firstDate;
        const delta_days = Math.ceil(delta / (1000 * 60 * 60 * 24));
        this.averageXPperDay = Math.max(0, parseInt(user.xp / delta_days));

        // User activities
        const show = 4;
        this.activities = [];
        for (let i = user.activities.length-1; i > user.activities.length - show - 1; i--) {
            if (i >= 0) {
                this.activities.push(user.activities[i]);
            }
        }

        // Skills
        const MAX_SKILLS = 6;
        let skills = user.experience.getAllSkills('', [], 1, false);
        skills.length = Math.min(skills.length, MAX_SKILLS);

        this.skills = [];
        for (let s = 0; s < skills.length; s++) {
            const skillID = skills[s].skillID;
            const skillName = user.getSkillByID(skillID).Name;
            const newVal = { key: skillID, value: skillName };
            this.skills.push(newVal);
        }
        while (this.skills.length < MAX_SKILLS) {
            this.skills.push({ key: -1, value: '' });
        }
    }
    openIdentity = () => { user.changePage('identity'); }
    openCalendar = () => { user.changePage('calendar'); }
    openSkill = (skillID) => { user.changePage('skill', { skillID: skillID }); }
    openSkills = () => { user.changePage('skills'); }
    openSettings = () => { user.changePage('settings'); }
    openExperience = () => { user.changePage('experience'); }

    render() {
        const userExperience = user.experience.getExperience();
        const totalXP = user.xp;
        const XP = userExperience.xp;
        const LVL = userExperience.lvl;
        const nextLvlXP = userExperience.next;

        return (
            <>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['home']['page-title']}
                    rightIcon="gear"
                    onPressRight={this.openSettings}
                />

                <View style={styles.parentView}>
                    {/* User - main informations */}
                    <View style={styles.containerHeader}>
                        <TouchableOpacity style={styles.containerUserName} activeOpacity={.5} onPress={this.openIdentity}>
                            <GLText title={user.pseudo} style={styles.pseudo} />
                            {user.title !== '' && (<GLText title={user.title} style={styles.title} />)}
                        </TouchableOpacity>
                        <GLXPBar value={XP} max={nextLvlXP} style={styles.containerUserXP} />
                    </View>

                    {/* User - Stats / Level / Calendar */}
                    <View style={styles.containerContent}>
                        {/* Stats */}
                        <GLStats containerStyle={styles.containerStats} />

                        <View style={styles.containerLevelColumn}>
                            {/* Level */}
                            <TouchableOpacity style={[styles.block, styles.blockLVL]} activeOpacity={0.5} onPress={this.openExperience}>
                                <GLDoubleCorner />
                                <GLText style={styles.textLevel} title={langManager.curr['level']['level'] + ' ' + LVL} />
                                <GLText style={styles.textLevelTotal} title={langManager.curr['level']['total'] + ' ' + totalXP} color='grey' />
                                <GLText style={styles.textLevelAverage} title={langManager.curr['level']['average'].replace('{}', this.averageXPperDay)} color='grey' />
                            </TouchableOpacity>

                            {/* Calendar */}
                            <TouchableOpacity
                                style={[styles.block, styles.blockCalendar]}
                                activeOpacity={.5}
                                onPress={this.openCalendar}
                            >
                                <GLText style={styles.calendarTitle} title={langManager.curr['home']['title-calendar'].toUpperCase()} />
                                <FlatList
                                    data={this.activities}
                                    keyExtractor={(item, i) => 'activity_' + i}
                                    renderItem={({item}) => {
                                        const skill = user.getSkillByID(item.skillID);
                                        const date = new Date(item.startDate);
                                        const dateText = dateToFormatString(date);
                                        const timeText = date.getHours() + 'h' + date.getMinutes() + 'm/' + item.duration + 'm';
                                        return (
                                            <GLActivityBox
                                                skill={skill.Name}
                                                date={dateText}
                                                time={timeText}
                                                small={true}
                                                onPress={() => { this.skill_click(item) }}
                                                onRemove={() => { this.skill_remove(item) }}
                                            />
                                        )
                                    }}
                                />
                                <View style={styles.calendarBottom}>
                                    <GLText style={styles.textLevelPlus} title={langManager.curr['home']['text-seeall']} />
                                    <GLIconButton icon='chevron' size={16} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User - Skills */}
                    <TouchableOpacity style={styles.containerSkills} activeOpacity={0.5} onPress={this.openSkills}>
                        <GLText style={styles.titleSkill} title={langManager.curr['home']['title-skills'].toUpperCase()} />
                        <FlatList
                            columnWrapperStyle={{ width: '100%', justifyContent: 'space-evenly' }}
                            contentContainerStyle={{ display: 'flex', alignItems: 'center' }}
                            data={this.skills}
                            numColumns={3}
                            keyExtractor={(item, i) => 'block_' + i}
                            renderItem={({item}) => {
                                return item.key === -1 ? (
                                        <View style={[styles.block, styles.blockSkill]} />
                                    ) : (
                                        <View>
                                            <TouchableOpacity style={[styles.block, styles.blockSkill]} activeOpacity={0.5} onPress={() => { this.openSkill(item.key) }}>
                                            </TouchableOpacity>
                                            <GLText style={{ marginTop: 4, marginBottom: 8 }} title={item.value} />
                                        </View>
                                    )
                                }
                            }
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    parentView: {
        flex: 1
    },
    containerHeader: {
        width: '100%',
        height: '10%',
        flexDirection: 'row'
    },
    containerUserName: {
        width: '50%',
        height: '100%',
        padding: 6,

        display: 'flex',
        justifyContent: 'center'
    },
    pseudo: {
        marginLeft: 4,
        fontSize: 18,
        textAlign: 'left'
    },
    title: {
        marginTop: 8,
        marginLeft: 4,
        fontSize: 14,
        textAlign: 'left'
    },
    containerUserXP: {
        width: '50%',
        paddingHorizontal: 6,
        display: 'flex',
        justifyContent: 'center'
    },

    containerContent: {
        height: '55%',
        flexDirection: 'row'
    },
    containerStats: {
        width: '55%',
        height: '100%',
        padding: 12
    },
    containerLevelColumn: {
        width: '45%',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    textLevel: {
        marginBottom: 12,
        fontSize: 18
    },
    textLevelTotal: {
        marginBottom: 12,
        fontSize: 14
    },
    textLevelAverage: {
        fontSize: 12
    },

    block: {
        marginHorizontal: 12,
        padding: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        backgroundColor: '#000000'
    },
    blockLVL: { height: '25%', justifyContent: 'space-evenly' },
    blockCalendar: { height: '60%', paddingHorizontal: 0 },
    blockSkill: { width: 64, height: 64, margin: 0, marginTop: 12 },

    calendarTitle: {
        marginBottom: 12,
        fontSize: 14
    },
    calendarBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#000000'
    },
    textLevelPlus: {
    },

    containerSkills: {
        height: '35%',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    titleSkill: {
        fontSize: 28
    }
});

export default Home;
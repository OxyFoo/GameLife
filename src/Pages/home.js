import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { dateToFormatString } from '../Functions/Functions';
import { GLActivityBox, GLHeader, GLIconButton, GLStats, GLText, GLXPBar } from '../Components/GL-Components';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // User statistics
        this.stats = [];
        for (let stat in user.stats) {
            this.stats.push({ key: stat, value: user.stats[stat] });
        }

        // User activities
        const show = 4;
        this.activities = [];
        for (let i = user.activities.length-1; i > user.activities.length - show - 1; i--) {
            if (i >= 0) {
                this.activities.push(user.activities[i]);
            }
        }
    }
    openIdentity = () => { user.changePage('identity'); }
    openCalendar = () => { user.changePage('calendar'); }
    openSettings = () => { user.changePage('settings'); }

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
                        <TouchableOpacity style={styles.containerUserXP} activeOpacity={.5}>
                            <GLXPBar value={XP} max={nextLvlXP} />
                        </TouchableOpacity>
                    </View>

                    {/* User - Stats / Level / Calendar */}
                    <View style={styles.containerContent}>
                        {/* Stats */}
                        <GLStats containerStyle={styles.containerStats} stats={this.stats} />

                        <View style={styles.containerLevelColumn}>
                            {/* Level */}
                            <View style={[styles.block, styles.blockLVL]}>
                                <GLText style={styles.textLevel} title={langManager.curr['level']['level'] + ' ' + LVL} />
                                <GLText style={styles.textLevelTotal} title={langManager.curr['level']['total'] + ' ' + totalXP} color='grey' />
                                <GLText style={styles.textLevelAverage} title={langManager.curr['level']['average'].replace('{}', 'XX')} color='grey' />
                            </View>
                            {/* Calendar */}
                            <TouchableOpacity
                                style={[styles.block, styles.blockCalendar]}
                                activeOpacity={.5}
                                onPress={this.openCalendar}
                            >
                                <GLText style={styles.calendarTitle} title='CALENDRIER' />
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
                                    <GLText style={styles.textLevelPlus} title={"Voir plus"} />
                                    <GLIconButton icon='chevron' size={16} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* User - Skills */}
                    <View style={styles.containerSkills}>
                        <GLText style={styles.titleSkill} title='COMPETENCES' />
                        <View style={styles.row}>
                            <View style={[styles.block, styles.blockSkill]} />
                            <View style={[styles.block, styles.blockSkill]} />
                            <View style={[styles.block, styles.blockSkill]} />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.block, styles.blockSkill]} />
                            <View style={[styles.block, styles.blockSkill]} />
                            <View style={[styles.block, styles.blockSkill]} />
                        </View>
                    </View>
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
        height: '60%',
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
    blockLVL: { height: '30%', justifyContent: 'space-evenly' },
    blockCalendar: { height: '65%', paddingHorizontal: 0 },
    blockSkill: { width: 64, height: 64 },

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
        height: '30%',
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
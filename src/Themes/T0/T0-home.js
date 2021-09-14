import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

import Home from '../../Pages/home';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { dateToFormatString } from '../../Functions/Functions';
import { GLActivityBox, GLDoubleCorner, GLHeader, GLIconButton, GLStats, GLSvg, GLText, GLXPBar } from '../../Components/GL-Components';

class T0Home extends Home {
    render() {
        const userExperience = user.experience.getExperience();
        const totalXP = user.xp;
        const XP = userExperience.xp;
        const LVL = userExperience.lvl;
        const nextLvlXP = userExperience.next;

        const backgroundColor = { backgroundColor: user.themeManager.colors['globalBackcomponent'] };

        return (
            <>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['home']['page-title']}
                    leftIcon="sandwich"
                    onPressLeft={user.openLeftPanel}
                    rightIcon="trophy"
                    onPressRight={() => user.changePage('leaderboard') }
                />

                <View style={styles.parentView}>
                    {/* User - main informations */}
                    <View style={styles.containerHeader}>
                        <TouchableOpacity style={styles.containerUserName} activeOpacity={.5} onPress={this.openIdentity}>
                            <GLText title={user.pseudo} style={styles.pseudo} />
                            {user.title != 0 && (<GLText title={user.getTitleByID(user.title)} style={styles.title} />)}
                        </TouchableOpacity>
                        <GLXPBar value={XP} max={nextLvlXP} style={styles.containerUserXP} />
                    </View>

                    {/* User - Stats / Level / Calendar */}
                    <View style={styles.containerContent}>
                        {/* Stats */}
                        <GLStats containerStyle={styles.containerStats} />

                        <View style={styles.containerLevelColumn}>
                            {/* Level */}
                            <TouchableOpacity style={[styles.block, styles.blockLVL, backgroundColor]} activeOpacity={0.5} onPress={this.openExperience}>
                                <GLDoubleCorner />
                                <GLText style={styles.textLevel} title={langManager.curr['level']['level'] + ' ' + LVL} />
                                <GLText style={styles.textLevelTotal} title={langManager.curr['level']['total'] + ' ' + totalXP} color='grey' />
                                <GLText style={styles.textLevelAverage} title={langManager.curr['level']['average'].replace('{}', this.averageXPperDay)} color='grey' />
                            </TouchableOpacity>

                            {/* Calendar */}
                            <TouchableOpacity
                                style={[styles.block, styles.blockCalendar, backgroundColor]}
                                activeOpacity={.5}
                                onPress={this.openCalendar}
                            >
                                <View>
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
                                </View>
                                <View style={[styles.calendarBottom, backgroundColor]}>
                                    <GLText style={styles.textLevelPlus} title={langManager.curr['home']['text-seeall']} color="grey" />
                                    <GLIconButton icon='chevron' size={16} />
                                </View>
                            </TouchableOpacity>

                            {/* Add activity */}
                            <TouchableOpacity
                                style={[styles.block, backgroundColor]}
                                activeOpacity={.5}
                                onPress={this.addSkill}
                            >
                                <GLDoubleCorner />
                                <GLText style={styles.addActivityText} title={langManager.curr['home']['shortcut-addactivity']} onPress={this.addSkill} />
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
                                let xml = '';
                                if (item.key !== -1) {
                                    const skill = user.getSkillByID(item.key);
                                    let logoID = skill.LogoID;
                                    if (logoID != 0) {
                                        xml = user.getXmlByLogoID(logoID);
                                    }
                                }

                                return item.key === -1 ? (
                                        <View style={[styles.block, styles.blockSkill, backgroundColor]} />
                                    ) : (
                                        <View>
                                            <TouchableOpacity style={[styles.block, styles.blockSkill, backgroundColor]} activeOpacity={0.5} onPress={() => { this.openSkill(item.key) }}>
                                                <GLSvg xml={xml} />
                                                <GLText style={styles.blockSkillText} title={item.value} />
                                            </TouchableOpacity>
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
        height: '45%',
        flexDirection: 'row'
    },
    containerStats: {
        width: '60%',
        height: '100%',
        padding: 12
    },
    containerLevelColumn: {
        width: '40%',
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
        borderColor: '#FFFFFF'
    },
    blockLVL: { height: '25%', justifyContent: 'space-evenly' },
    blockCalendar: { height: '40%', paddingHorizontal: 0, overflow: 'hidden' },
    blockSkill: { width: 64, height: 64, padding: 0, margin: 0, marginTop: 12, marginBottom: 36, overflow: 'visible' },
    blockSkillText: {
        marginVertical: 4,
        marginLeft: '-50%',
        width: '200%',
        lineHeight: 16
    },

    calendarTitle: {
        marginBottom: 12,
        fontSize: 14
    },
    calendarBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    textLevelPlus: {
    },

    containerSkills: {
        flex: 1,
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    titleSkill: {
        marginBottom: 12,
        fontSize: 28
    },
    addActivityText: {
        fontSize: 16
    }
});

export { T0Home };
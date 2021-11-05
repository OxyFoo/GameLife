import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Calendar from '../back/calendar';
import { dateToFormatString, GetTimeToTomorrow } from '../../Functions/Functions';
import { GLHeader, GLIconButton, GLActivityBox, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class T0Calendar extends Calendar {
    render() {
        const styleTopLeft = [ styles.absolute, styles.topLeft ];
        const styleMidLeft = [ styles.absolute, styles.midLeft ];

        const DTPMode = this.state.showDateTimePicker;
        const currDateTxt = dateToFormatString(this.state.currDate);

        const dailyquestTime = GetTimeToTomorrow();

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['calendar']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                    rightIcon="plus"
                    onPressRight={this.addSkill}
                />

                {/* Topbar */}
                <View style={[styles.topBar, { backgroundColor: user.themeManager.colors['globalBackcomponent'] }]}>
                    <TouchableOpacity style={styles.headerLeft} activeOpacity={.5} onPress={this.showDTP} >
                        <GLText style={styleTopLeft} title={currDateTxt} />
                        {/* Edit */}
                        <View style={styles.textIcon}>
                            <GLText style={styles.small} title={langManager.curr['calendar']['header1-action']} color="secondary" />
                            <GLIconButton size={14} icon='chevron' />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.Vseparator} />
                    <TouchableOpacity style={styles.headerRight} activeOpacity={.5} onPress={this.dailyQuest} >
                        <GLText style={styleTopLeft} title={langManager.curr['calendar']['header2-title']} />
                        <GLText style={[styleMidLeft, styles.small]} title={langManager.curr['calendar']['header2-time'] + dailyquestTime} color="secondary" />
                        {/* Daily quest */}
                        <View style={styles.textIcon}>
                            <GLText style={styles.small} title={langManager.curr['calendar']['header2-action']} color="secondary" />
                            <GLIconButton size={14} icon='chevron' />
                        </View>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={this.state.activities}
                    keyExtractor={(item, i) => 'activity_' + i}
                    renderItem={({item}) => {
                        const activity = item;
                        const skill = user.getSkillByID(activity.skillID);
                        const date = new Date(activity.startDate);
                        const timeText = date.getHours() + 'h' + date.getMinutes() + 'm/' + activity.duration + 'm';

                        const durationHour = activity.duration / 60;
                        let totalXP = skill.XP * durationHour;
                        const sagLevel = user.experience.getStatExperience('sag', activity).lvl - 1;
                        totalXP += sagLevel * durationHour;

                        return (
                            <GLActivityBox
                                skill={skill.Name}
                                time={timeText}
                                xp={totalXP}
                                onPress={() => { this.skill_click(activity) }}
                                onRemove={() => { this.skill_remove(activity) }}
                            />
                        )
                    }}
                />

                <DateTimePickerModal
                    date={this.state.currDate}
                    mode={DTPMode}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={DTPMode != ''}
                    maximumDate={new Date()}
                    minimumDate={user.activitiyManager.getFirst()}
                />

            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: '9.5%',
        flexDirection: 'row',
        borderColor: '#FFFFFF',
        borderWidth: 3,
        borderTopWidth: 2,
    },
    headerLeft: {
        width: '40%',
        height: '100%',
    },
    headerRight: {
        width: '60%',
        height: '100%'
    },
    Vseparator: {
        width: 3,
        height: '100%',
        backgroundColor: '#FFFFFF'
        
    },
    absolute: { position: 'absolute', fontSize: ww * 53 / 1000, },
    small: { fontSize: ww * 426 / 10000 },
    topLeft: { textAlign: 'left', top: "4%", left: "2%" },
    midLeft: { textAlign: 'left', bottom: '40%', left: "2%" },
    textIcon: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',

    }
});

export { T0Calendar };
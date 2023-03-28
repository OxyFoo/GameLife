import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Range } from '../../Utils/Functions';
import { DateToFormatString } from '../../Utils/Date';
import { GetDate, GetTime } from '../../Utils/Time';
import { Text, Button, TextSwitch } from '../Components';

/**
 * @typedef {import('../../Class/Tasks').RepeatModes} RepeatModes
 * 
 * @callback OnChangeScheduleEvent
 * @param {number} deadline Unix timestamp in seconds
 * @param {RepeatModes} repeatMode Repeat mode
 * @param {Array<number>} repeatDays Array of days of week
 */

const TaskScheduleProps = {
    /** @type {OnChangeScheduleEvent} */
    onChange: (deadline, repeatMode, repeatDays) => {}
}

class TaskSchedule extends React.Component {
    state = {
        /** @type {''|'date'|'time'} */
        DTPMode: '',
        /** @type {number} */
        deadline: 0,
        /** @type {string} */
        deadlineText: '',

        /** @type {RepeatModes} */
        repeatMode: 'none',
        /** @type {Array<number>} */
        selectedDays: []
    }

    /** @type {TextSwitch} */
    refTextSwitch = React.createRef();

    /** @param {number} index */
    switchMode = (index) => {
        if (index < 0 || index > 2) return;
        const repeatMode = ['none', 'week', 'month'][index];
        this.setState({ repeatMode, selectedDays: [] }, this.onChange);
    }
    showDTP = () => this.setState({ DTPMode: 'date' });
    hideDTP = () => this.setState({ DTPMode: '' });

    /**
     * 
     * @param {number} deadline
     * @param {RepeatModes} repeatMode
     * @param {Array<number>} selectedDays
     */
    SetValues = (deadline, repeatMode, selectedDays) => {
        this.setState({
            deadline,
            repeatMode,
            selectedDays,
            deadlineText: DateToFormatString(GetDate(deadline))
        });

        const repeatModeIndex = ['none', 'week', 'month'].indexOf(repeatMode);
        this.refTextSwitch?.SetSelectedIndex(repeatModeIndex);
    }

    GetValues = () => {
        let { deadline, repeatMode, selectedDays } = this.state;
        selectedDays = selectedDays.filter(day => day <= 30);
        return { deadline, repeatMode, selectedDays };
    }

    onChange = () => {
        const { deadline, repeatMode, selectedDays } = this.state;
        this.props.onChange(deadline, repeatMode, selectedDays);
    }

    /**
     * Select or unselect a day
     * @param {number} index
     */
    onDaySelect = (index) => {
        const { selectedDays } = this.state;
        const include = selectedDays.includes(index);
        if (include) selectedDays.splice(selectedDays.indexOf(index), 1);
        else         selectedDays.push(index);
        this.setState({ selectedDays }, this.onChange);
    }

    /**
     * Select or unselect a column of days for month
     *  repeat mode or all days for week repeat mode
     * @param {number} index
     */
    onDaysSelect = (index) => {
        const { repeatMode, selectedDays } = this.state;

        if (repeatMode === 'none') {
            return;
        }

        if (repeatMode === 'week') {
            let days = Range(7);
            if (selectedDays.length === 7) days = [];
            this.setState({ selectedDays: days }, this.onChange);
            return;
        }

        const modulo = index % 7;
        const days = Range(31).filter(i => i % 7 === modulo);

        // Remove all column
        if (days.every(day => selectedDays.includes(day))) {
            days.forEach(day => selectedDays.splice(selectedDays.indexOf(day), 1));
        }

        // Select all column
        else {
            days.forEach(day => !selectedDays.includes(day) && selectedDays.push(day));
        }

        this.setState({ selectedDays }, this.onChange);
    }

    /** @param {Date} date */
    onChangeDateTimePicker = (date) => {
        const { DTPMode } = this.state;
        const newDate = new Date(date);
        this.hideDTP();

        if (DTPMode === 'date') {
            newDate.setUTCHours(0, 0, 0, 0);
            this.setState({
                deadline: GetTime(newDate),
                deadlineText: DateToFormatString(newDate)
            }, this.onChange);
        }
    }
    onResetDeadline = () => {
        this.setState({
            deadline: 0,
            deadlineText: ''
        }, this.onChange);
    }

    renderDaySelector = () => {
        const { repeatMode, selectedDays } = this.state;
        if (repeatMode === 'none') return null;

        const langDates = langManager.curr['dates'];
        let elements = [];

        // Add first letter of each day
        if (repeatMode === 'week') {
            elements = langDates['days'].map(day => day.charAt(0));
            elements.push(elements.splice(0, 1)[0]);
        }

        // Add numbers from 1 to 31
        else if (repeatMode === 'month') {
            elements = Range(35).map(i => (i + 1).toString());
        }

        const styleBorder = { borderColor: themeManager.GetColor('main1') };
        const emptyButton = <View style={styles.selectorButton} />;

        return (
            <FlatList
                style={{ marginTop: 12 }}
                columnWrapperStyle={{ flex: 1 }}
                contentContainerStyle={{ justifyContent: 'space-between' }}
                data={elements}
                numColumns={7}
                renderItem={({ item, index }) => index > 30 ? emptyButton : (
                    <Button
                        style={[styles.selectorButton, styleBorder]}
                        color={selectedDays.includes(index) ? 'main1' : 'transparent'}
                        colorText={selectedDays.includes(index) ? 'white' : 'main1'}
                        rippleColor='white'
                        onPress={() => this.onDaySelect(index)}
                        onLongPress={() => this.onDaysSelect(index)}
                    >
                        {item}
                    </Button>
                )}
                keyExtractor={(item, index) => 'pickday-' + index.toString()}
            />
        );
    }

    render() {
        const lang = langManager.curr['task'];
        const { repeatMode } = this.state;

        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const textDeadline = this.state.deadline === 0 ? lang['input-deadline-empty'] : this.state.deadlineText;
        const defaultDate = new Date();
        defaultDate.setUTCHours(0, 0, 0, 0);
        defaultDate.setUTCDate(defaultDate.getUTCDate() + 1);

        const dateNames = langManager.curr['dates']['names'];
        const timeIntervals = [ dateNames['never'], dateNames['weekly'], dateNames['monthly'] ];
        const repeatMessage = repeatMode === 'month' && (
            <Text style={{ marginTop: 12 }}>{lang['text-hint-select']}</Text>
        );

        return (
            <>
                <Text style={styles.sectionTitle} fontSize={22}>{lang['title-schedule']}</Text>
                <View style={[backgroundColor, styles.schedulePanel]}>
                    <View style={[styles.row, { marginBottom: 12 }]}>
                        <Text>{lang['input-deadline-title']}</Text>
                        <Button
                            colorText='main1'
                            style={styles.smallBtn}
                            fontSize={14}
                            onPress={this.showDTP}
                            onLongPress={this.onResetDeadline}
                        >
                            {textDeadline}
                        </Button>
                    </View>

                    <Text>{lang['input-repeat-title']}</Text>
                    <TextSwitch
                        ref={ref => this.refTextSwitch = ref}
                        style={{ height: 48, marginTop: 12 }}
                        texts={timeIntervals}
                        onChange={this.switchMode}
                    />
                    {repeatMessage}
                    {this.renderDaySelector()}
                </View>

                <DateTimePickerModal
                    date={defaultDate}
                    minimumDate={defaultDate}
                    mode={this.state.DTPMode}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={this.state.DTPMode != ''}
                    minuteInterval={15}
                    is24Hour={true}
                />
            </>
        );
    }
}

TaskSchedule.prototype.props = TaskScheduleProps;
TaskSchedule.defaultProps = TaskScheduleProps;

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 32,
        marginBottom: 12
    },
    schedulePanel: {
        padding: 24,
        borderRadius: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    smallBtn: {
        height: 42,
        paddingHorizontal: 12
    },
    selectorButton: {
        flex: 1/7,
        aspectRatio: 1,
        margin: 4,
        paddingHorizontal: 0,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent'
    }
});

export default TaskSchedule;
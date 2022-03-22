import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Range } from '../../Utils/Functions';
import { Text, Button, TextSwitch } from '../Components';
import { DateToFormatString } from '../../Utils/Date';
import { GetTime } from '../../Utils/Time';

/**
 * @callback OnChangeScheduleEvent
 * @param {Number?} deadline - Unix timestamp in seconds
 * @param {'week'|'month'} repeatMode - Repeat mode
 * @param {Array<Number>?} repeatDays - Array of days of week
 */

const TaskScheduleProps = {
    /** @type {OnChangeScheduleEvent} */
    onChange: (deadline, repeatMode, repeatDays) => {},

    initValues: null
}

class TaskSchedule extends React.Component {
    state = {
        // Deadline
        DTPMode: '',
        deadline: null,
        deadlineText: '',

        // Repeat
        repeatMode: 0,
        selectedDays: []
    }

    constructor(props) {
        super(props);

        const { initValues } = this.props;
        if (initValues !== null && initValues.length === 3) {
            this.state.deadline = initValues[0];
            this.state.deadlineText = DateToFormatString(initValues[0]);
            if (initValues[1] === 'week') this.state.repeatMode = 1;
            if (initValues[1] === 'month') this.state.repeatMode = 2;
            this.state.selectedDays = initValues[2];
        }
    }

    switchMode = (index) => this.setState({ repeatMode: index, selectedDays: [] }, this.onChange);
    showDTP = () => this.setState({ DTPMode: 'date' });
    hideDTP = () => this.setState({ DTPMode: '' });

    onChange = () => {
        let { deadline, repeatMode, selectedDays } = this.state;
        if (repeatMode === 0) {
            repeatMode = null;
            selectedDays = [];
        } else if (repeatMode === 1) {
            repeatMode = 'week';
        } else if (repeatMode === 2) {
            repeatMode = 'month';
        }
        selectedDays = selectedDays.filter(day => day <= 30);
        this.props.onChange(deadline, repeatMode, selectedDays);
    }

    onDaySelect = (index) => {
        const { selectedDays } = this.state;
        const include = selectedDays.includes(index);
        if (include) selectedDays.splice(selectedDays.indexOf(index), 1);
        else         selectedDays.push(index);
        this.setState({ selectedDays }, this.onChange);
    }
    onDaysSelect = (index) => {
        const { selectedDays } = this.state;
        const week = Math.floor(index/7);
        const days = Range(7).map(i => i + week*7);
        if (days.every(day => selectedDays.includes(day))) {
            // Remove all line
            days.forEach(day => selectedDays.splice(selectedDays.indexOf(day), 1));
        } else {
            // Select all line
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
            newDate.setHours(1, 0, 0, 0);
            this.setState({
                deadline: GetTime(newDate),
                deadlineText: DateToFormatString(newDate)
            }, this.onChange);
        }
    }
    onResetDeadline = () => {
        this.setState({
            deadline: null,
            deadlineText: ''
        }, this.onChange);
    }

    renderDaySelector = () => {
        const { repeatMode, selectedDays } = this.state;
        if (!repeatMode) return null;

        let elements = [];
        if (repeatMode === 1) {
            elements = langManager.curr['dates']['days'].map(day => day.charAt(0));
            elements.push(elements.splice(0, 1)[0]);
        } else if (repeatMode === 2) {
            elements = Range(35).map(i => (i + 1).toString());
        }

        const border = { borderColor: themeManager.GetColor('main1') };
        const emptyComponent = <View style={styles.selectorButton} />;

        return (
            <>
                {repeatMode === 2 && <Text style={{ marginTop: 12 }}>{'[Appui long pour sélectionner une ligne]'}</Text>}
                <FlatList
                    style={{ marginTop: 12 }}
                    columnWrapperStyle={{ flex: 1 }}
                    contentContainerStyle={{ justifyContent: 'space-between' }}
                    data={elements}
                    numColumns={7}
                    renderItem={({ item, index }) => index > 30 ? emptyComponent : (
                        <Button
                            style={[styles.selectorButton, border]}
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
            </>
        );
    }

    render() {
        const lang = langManager.curr['task'];
        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const textDeadline = this.state.deadline === null ? lang['input-deadline-empty'] : this.state.deadlineText;
        const defaultDate = new Date();
        defaultDate.setHours(1, 0, 0, 0);
        defaultDate.setDate(defaultDate.getDate() + 1);

        const dateNames = langManager.curr['dates']['names'];
        const timeIntervals = [ dateNames['never'], dateNames['weekly'], dateNames['monthly'] ];

        return (
            <>
                <Text style={styles.sectionTitle} fontSize={22}>{lang['title-schedule']}</Text>
                <View style={[backgroundColor, styles.schedulePanel]}>
                    <View style={[styles.row, { marginBottom: 12 }]}>
                        <Text>{lang['input-deadline-title']}</Text>
                        <Button
                            //color='main1'
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
                        style={{ height: 48, marginTop: 12 }}
                        texts={timeIntervals}
                        onChange={this.switchMode}
                        startAt={this.state.repeatMode}
                    />
                    {this.renderDaySelector()}
                </View>

                <DateTimePickerModal
                    date={defaultDate}
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
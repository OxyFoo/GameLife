import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button } from 'Interface/Components';
import { GetDate, GetGlobalTime } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

const SectionScheduleProps = {
    /** @type {(deadline: number) => void} */
    onChange: (deadline) => {}
};

class SectionSchedule extends React.Component {
    state = {
        /** @type {'' | 'date' | 'time'} */
        DTPMode: '',
        /** @type {number} */
        deadline: 0,
        /** @type {string} */
        deadlineText: ''
    }

    refHelp1 = null;

    showDTP = () => this.setState({ DTPMode: 'date' });
    hideDTP = () => this.setState({ DTPMode: '' });

    /** @param {number} deadline */
    SetDeadline = (deadline) => {
        this.setState({
            deadline,
            deadlineText: DateToFormatString(GetDate(deadline))
        });
    }

    /** @returns {number} */
    GetDeadline = () => {
        return this.state.deadline;
    }

    onChange = () => {
        this.props.onChange(this.state.deadline);
    }

    /** @param {Date} date */
    onChangeDateTimePicker = (date) => {
        const { DTPMode } = this.state;
        const newDate = new Date(date);
        this.hideDTP();

        if (DTPMode === 'date') {
            newDate.setUTCHours(0, 0, 0, 0);
            this.setState({
                deadline: GetGlobalTime(newDate),
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

    render() {
        const lang = langManager.curr['todo'];

        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const textDeadline = this.state.deadline === 0 ? lang['input-deadline-empty'] : this.state.deadlineText;
        const defaultDate = new Date();
        defaultDate.setUTCHours(0, 0, 0, 0);
        defaultDate.setUTCDate(defaultDate.getUTCDate() + 1);

        const isVisibleDTP = this.state.DTPMode === 'time' || this.state.DTPMode === 'date';

        return (
            <>
                <View
                    ref={ref => this.refHelp1 = ref}
                    style={[backgroundColor, styles.schedulePanel]}
                >
                    <Text style={styles.sectionTitle} fontSize={22}>{lang['title-schedule']}</Text>
                    <View style={styles.row}>
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
                </View>

                <DateTimePickerModal
                    date={defaultDate}
                    minimumDate={defaultDate}
                    mode={this.state.DTPMode || 'date'}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={isVisibleDTP}
                    minuteInterval={TIME_STEP_MINUTES}
                    is24Hour={true}
                />
            </>
        );
    }
}

SectionSchedule.prototype.props = SectionScheduleProps;
SectionSchedule.defaultProps = SectionScheduleProps;

const styles = StyleSheet.create({
    sectionTitle: {
        marginBottom: 6
    },
    schedulePanel: {
        paddingVertical: 16,
        paddingHorizontal: 24,
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
    }
});

export default SectionSchedule;

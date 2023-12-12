import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { DateToFormatString } from 'Utils/Date';
import { GetDate, GetTime } from 'Utils/Time';
import { Text, Button } from 'Interface/Components';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

const DeadlineProps = {
    /** @param {number} deadline */
    onChange: (deadline) => {}
};

class SectionDeadline extends React.Component {
    state = {
        /** @type {'' | 'date' | 'time'} */
        DTPMode: '',
        /** @type {number} */
        deadline: 0,
        /** @type {string} */
        deadlineText: ''
    }

    refHelp1 = null;

    constructor(props) {
        super(props);

        this.defaultDate = new Date();
        this.defaultDate.setUTCHours(0, 0, 0, 0);
        this.defaultDate.setUTCDate(this.defaultDate.getUTCDate() + 1);
    }

    showDTP = () => this.setState({ DTPMode: 'date' });
    hideDTP = () => this.setState({ DTPMode: '' });

    /** @param {number} deadline */
    SetValues = (deadline) => {
        this.setState({
            deadline,
            deadlineText: DateToFormatString(GetDate(deadline))
        });
    }

    GetValues = () => {
        return this.state.deadline;
    }

    onChange = () => {
        const { deadline } = this.state;
        this.props.onChange(deadline);
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

    render() {
        const lang = langManager.curr['quest'];

        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const textDeadline = this.state.deadline === 0 ? lang['input-deadline-empty'] : this.state.deadlineText;
        const isVisibleDTP = this.state.DTPMode === 'time' || this.state.DTPMode === 'date';

        return (
            <>
                <Text style={styles.sectionTitle} fontSize={22}>{lang['title-schedule']}</Text>
                <View
                    ref={ref => this.refHelp1 = ref}
                    style={[backgroundColor, styles.schedulePanel]}
                >
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
                    date={this.defaultDate}
                    minimumDate={this.defaultDate}
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

SectionDeadline.prototype.props = DeadlineProps;
SectionDeadline.defaultProps = DeadlineProps;

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
    }
});

export default SectionDeadline;

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import langManager from 'Managers/LangManager';

import { Text, Button, Icon } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';
import { GetDate, GetGlobalTime } from 'Utils/Time';
import { TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Todos').Todo} Todo
 *
 * @typedef {Object} SectionSchedulePropsType
 * @property {Todo | null} todo
 * @property {(newTodo: Todo) => void} onChangeTodo
 */

/** @type {SectionSchedulePropsType} */
const SectionScheduleProps = {
    todo: null,
    onChangeTodo: () => {}
};

class SectionSchedule extends React.Component {
    state = {
        /** @type {'' | 'date' | 'time' | 'datetime'} */
        DTPMode: ''
    };

    /**
     * @param {SectionSchedulePropsType} nextProps
     * @param {this['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.todo !== this.props.todo ||
            nextProps.todo?.deadline !== this.props.todo?.deadline ||
            nextProps.onChangeTodo !== this.props.onChangeTodo ||
            this.state.DTPMode !== nextState.DTPMode
        );
    }

    showDTP = () => this.setState({ DTPMode: 'date' });

    hideDTP = () => this.setState({ DTPMode: '' });

    /** @param {number} deadline */
    onChange = (deadline) => {
        const { todo, onChangeTodo } = this.props;
        if (todo === null) return;

        todo.deadline = deadline;
        onChangeTodo(todo);
    };

    /** @param {Date} date */
    onChangeDateTimePicker = (date) => {
        const { DTPMode } = this.state;
        const newDate = new Date(date);
        this.hideDTP();

        if (DTPMode === 'date') {
            newDate.setUTCHours(0, 0, 0, 0);
            this.onChange(GetGlobalTime(newDate));
        }
    };

    onResetDeadline = () => {
        this.onChange(0);
    };

    render() {
        const lang = langManager.curr['todo'];
        const { todo } = this.props;
        const { DTPMode } = this.state;

        if (todo === null) {
            return null;
        }

        let deadlineText = lang['input-deadline-empty'];
        if (todo.deadline > 0) {
            deadlineText = DateFormat(GetDate(todo.deadline), 'DD/MM/YYYY');
        }

        const defaultDate = new Date();
        defaultDate.setUTCHours(0, 0, 0, 0);
        defaultDate.setUTCDate(defaultDate.getUTCDate() + 1);

        return (
            <View style={styles.parent}>
                <Text style={styles.title} color='border'>
                    {lang['input-deadline-title']}
                </Text>

                <Button
                    styleContent={styles.buttonContent}
                    styleBackground={styles.buttonBackground}
                    appearance='outline'
                    borderColor={todo.deadline === 0 ? 'border' : 'main1'}
                    fontColor='primary'
                    onPress={this.showDTP}
                    onLongPress={this.onResetDeadline}
                >
                    <Text>{deadlineText}</Text>
                    <Icon icon='planner' color={todo.deadline === 0 ? 'border' : 'main1'} />
                </Button>

                <DateTimePickerModal
                    date={defaultDate}
                    minimumDate={defaultDate}
                    mode={DTPMode || 'date'}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={DTPMode !== ''}
                    minuteInterval={TIME_STEP_MINUTES}
                    is24Hour={true}
                />
            </View>
        );
    }
}

SectionSchedule.prototype.props = SectionScheduleProps;
SectionSchedule.defaultProps = SectionScheduleProps;

const styles = StyleSheet.create({
    parent: {
        marginBottom: 24
    },

    title: {
        marginBottom: 8,
        textAlign: 'left',
        fontSize: 14
    },
    buttonContent: {
        justifyContent: 'space-between'
    },
    buttonBackground: {
        borderWidth: 1.5
    }
});

export default SectionSchedule;

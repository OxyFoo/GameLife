import React from 'react';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { DEFAULT_ACTIVITY } from 'Data/User/Activities/index';
import { MinMax } from 'Utils/Functions';
import { GetDate, GetLocalTime } from 'Utils/Time';
import {
    AddActivity,
    EditActivity,
    MAX_TIME_MINUTES,
    MIN_TIME_MINUTES,
    RemoveActivity,
    TIME_STEP_MINUTES
} from 'Utils/Activities';

/**
 * @typedef {import('Types/Data/User/Activities').Activity} Activity
 * @typedef {import('Interface/Components').Digit} Digit
 * @typedef {import('Interface/Components').InputText} InputText
 *
 * @typedef {Object} BackActivityPage2AddPropsType
 * @property {Activity} activity
 * @property {Activity | null} editActivity
 * @property {(newActivity: Activity) => Promise<void>} changeActivity
 * @property {() => void} unSelectActivity
 */

/** @type {BackActivityPage2AddPropsType} */
const BackActivityPage2AddProps = {
    activity: DEFAULT_ACTIVITY,
    editActivity: null,
    changeActivity: async () => {},
    unSelectActivity: () => {}
};

class BackActivityPage2Add extends React.Component {
    state = {
        /** @type {number} Index of digits */
        selectedHours: 1,

        /** @type {number} Index of digits */
        selectedMinutes: 0,

        /** @type {'' | 'date' | 'time' | 'datetime'} */
        DTPMode: '',

        /** @type {'startTime' | 'endTime'} */
        DTPType: 'startTime',

        DTPDate: new Date(),

        loading: false
    };

    /** @param {BackActivityPage2AddPropsType} props */
    constructor(props) {
        super(props);

        const { activity } = props;
        this.state.selectedHours = Math.floor(activity.duration / 60);
        this.state.selectedMinutes = activity.duration % 60;
    }

    onAddActivity = async () => {
        const { activity, editActivity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        this.setState({ loading: true });

        let success = true;
        if (editActivity === null) {
            success = await AddActivity(activity);
        } else {
            success = await EditActivity(editActivity, activity);
        }

        if (!success) {
            this.setState({ loading: false });
            return;
        }

        const saved = await user.activities.SaveOnline();
        if (!saved) {
            const lang = langManager.curr['activity'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-error-title'],
                    message: lang['alert-error-message'].replace('{}', 'save online')
                }
            });
        }

        this.setState({ loading: false }, () => {
            user.interface.bottomPanel?.Close();
        });
    };

    onRemoveActivity = async () => {
        const { editActivity } = this.props;

        if (editActivity === null) {
            return;
        }

        this.setState({ loading: true });

        const removed = await RemoveActivity(editActivity);
        if (!removed) {
            this.setState({ loading: false });
            return;
        }

        this.setState({ loading: false }, () => {
            user.interface.bottomPanel?.Close();
        });
    };

    isEdited = () => {
        const { activity, editActivity } = this.props;

        if (editActivity === null) {
            return false;
        }

        return (
            activity.skillID !== editActivity.skillID ||
            activity.startTime !== editActivity.startTime ||
            activity.duration !== editActivity.duration ||
            activity.comment !== editActivity.comment
        );
    };

    setDate = () => {
        const { activity } = this.props;
        this.showDTP('date', 'startTime', activity.startTime);
    };
    setStartTime = () => {
        const { activity } = this.props;
        this.showDTP('time', 'startTime', activity.startTime);
    };

    /** @type {Digit['props']['onChangeValue']} */
    setDurationHours = (duration) => {
        const { activity, changeActivity } = this.props;
        const { selectedMinutes } = this.state;

        if (activity.skillID === 0) {
            return;
        }

        const hours = duration;
        const minutes = selectedMinutes;
        const total = hours * 60 + minutes;

        this.setState({ selectedHours: duration }, () => {
            changeActivity({
                ...activity,
                duration: total
            });
        });
    };

    /** @type {Digit['props']['onChangeValue']} */
    setDurationMinutes = (duration) => {
        const { activity, changeActivity } = this.props;
        const { selectedHours } = this.state;

        if (activity.skillID === 0) {
            return;
        }

        const minutes = duration * TIME_STEP_MINUTES;
        const total = selectedHours * 60 + minutes;

        this.setState({ selectedMinutes: minutes }, () => {
            changeActivity({
                ...activity,
                duration: total
            });
        });
    };

    setDurationByTime = () => {
        const { activity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        const endDate = GetDate(activity.startTime);
        endDate.setHours(endDate.getHours() + Math.floor(activity.duration / 60));
        endDate.setMinutes(endDate.getMinutes() + (activity.duration % 60));
        const endTime = GetLocalTime(endDate);
        this.showDTP('time', 'endTime', endTime);
    };

    /** @type {InputText['props']['onChangeText']} */
    setCommentary = (text) => {
        const { activity, changeActivity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        changeActivity({
            ...activity,
            comment: text
        });
    };

    /**
     * @param {'date' | 'time'} mode
     * @param {'startTime' | 'endTime'} type
     * @param {number} dateTime
     */
    showDTP = (mode, type, dateTime) => {
        this.setState({ DTPMode: mode, DTPType: type, DTPDate: GetDate(dateTime) }, () => {
            user.interface.bottomPanel?.DisableScroll();
        });
    };

    hideDTP = () => {
        this.setState({ DTPMode: '' }, () => {
            user.interface.bottomPanel?.EnableScroll();
        });
    };

    /** @param {Date} date UTC date */
    onChangeDateTimePicker = (date) => {
        const { activity, changeActivity } = this.props;
        const { DTPType } = this.state;

        if (activity.skillID === 0) {
            return;
        }

        if (DTPType === 'startTime') {
            const pickedTime = GetLocalTime(date);
            this.setState(
                {
                    DTPMode: '',
                    DTPDate: date
                },
                () => {
                    changeActivity({
                        ...activity,
                        startTime: pickedTime
                    });
                }
            );
        } else if (DTPType === 'endTime') {
            const pickedHours = date.getHours();
            const pickedMinutes = date.getMinutes();
            const pickedTotalTime = pickedHours * 60 + pickedMinutes;

            const currentDate = GetDate(activity.startTime);
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();
            const currentTotalTime = currentHours * 60 + currentMinutes;

            let rawDeltaMinutes = pickedTotalTime - currentTotalTime;
            if (rawDeltaMinutes < 0) {
                rawDeltaMinutes += 24 * 60;
            }
            const deltaMinutes = MinMax(MIN_TIME_MINUTES, rawDeltaMinutes, MAX_TIME_MINUTES);
            const newHoursIndex = Math.floor(deltaMinutes / 60);
            const newMinutesIndex = Math.floor((deltaMinutes % 60) / TIME_STEP_MINUTES);

            changeActivity({
                ...activity,
                duration: deltaMinutes
            }).then(() => {
                this.setState({
                    selectedHours: newHoursIndex,
                    selectedMinutes: newMinutesIndex * TIME_STEP_MINUTES,
                    DTPMode: ''
                });
            });
        }

        user.interface.bottomPanel?.EnableScroll();
    };
}

BackActivityPage2Add.defaultProps = BackActivityPage2AddProps;
BackActivityPage2Add.prototype.props = BackActivityPage2AddProps;

export default BackActivityPage2Add;

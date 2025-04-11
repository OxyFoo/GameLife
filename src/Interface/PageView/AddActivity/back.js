import React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import Calendar from 'Interface/Pages/Calendar';
import { MinMax } from 'Utils/Functions';
import { GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';
import { MAX_TIME_MINUTES, MIN_TIME_MINUTES, TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('Data/User/Activities/index').Activity} Activity
 *
 * @typedef {import('./Page2').AddActivityPage2} AddActivityPage2
 *
 * @typedef {Object} BackActivityPropsType
 * @property {number | null} time Start time of activity, If null current time will be used
 * @property {number | null} categoryID Default category ID selected, If null no category will be selected (or recent with more than 5 activities)
 * @property {number | null} openSkillID Default skill ID selected, If null no skill will be selected
 * @property {Array<number>} listSkillsIDs If only one skill is passed, it will be opened by default (/!\ Disable categories feature)
 * @property {Activity | null} editActivity If true, the activity will be edited instead of added
 */

/** @type {BackActivityPropsType} */
const BackActivityProps = {
    time: null,
    categoryID: null,
    openSkillID: null,
    listSkillsIDs: [],
    editActivity: null
};

class BackActivity extends React.Component {
    state = {
        /** @type {Activity} */
        newActivity: {
            skillID: 0, // 0 means no skill selected
            duration: 60,
            startTime: RoundTimeTo(TIME_STEP_MINUTES, GetLocalTime(), 'near'),
            timezone: GetTimeZone(),
            addedTime: 0, // Auto defined when activity is added
            addedType: 'normal',
            comment: '',
            friends: [],
            notifyBefore: null
        }
    };

    /** @type {React.RefObject<View | null>} */
    nativeRefPage1 = React.createRef();

    /** @type {React.RefObject<View | null>} */
    nativeRefPage2 = React.createRef();

    /** @type {React.RefObject<AddActivityPage2 | null>} */
    refChild2 = React.createRef();

    /** @param {BackActivityPropsType} props */
    constructor(props) {
        super(props);

        // If activity is passed, set it as new activity and open edit mode
        if (props.editActivity !== null) {
            this.state.newActivity = props.editActivity;
            return;
        }

        // If default skills is defined and contains only one skill
        if (props.openSkillID !== null || props.listSkillsIDs.length === 1) {
            const skillID = props.openSkillID !== null ? props.openSkillID : props.listSkillsIDs[0];
            const skill = dataManager.skills.GetByID(skillID);
            if (skill !== null) {
                this.state.newActivity.skillID = skill.ID;
            }
        }

        // Set default time (UTC) to add an activity
        let newTime = RoundTimeTo(TIME_STEP_MINUTES, GetLocalTime(), 'near');
        let newDuration = 60;

        // Set date from props
        if (props.time !== null) {
            newTime = props.time;
        }

        // Set date from calendar
        else if (user.interface.GetCurrentPageName() === 'calendar') {
            const calendar = user.interface.GetCurrentPage()?.ref.current;
            if (calendar !== undefined && calendar instanceof Calendar) {
                if (calendar.state.selectedDay !== null) {
                    const { day, month, year } = calendar.state.selectedDay;
                    const dayDate = new Date();
                    dayDate.setFullYear(year);
                    dayDate.setMonth(month);
                    dayDate.setDate(day);
                    newTime = RoundTimeTo(TIME_STEP_MINUTES, GetLocalTime(dayDate), 'near');
                }
            }
        }

        // Auto define duration
        const activities = user.activities.GetByTime(newTime).filter((activity) => activity.startTime > newTime);
        if (activities.length > 0) {
            const delta = activities[0].startTime - newTime;
            if (delta <= MAX_TIME_MINUTES * 60) {
                newDuration = RoundTimeTo(TIME_STEP_MINUTES, delta) / 60;
                newDuration = MinMax(MIN_TIME_MINUTES, newDuration, MAX_TIME_MINUTES);
            }
        }

        this.state.newActivity.startTime = newTime;
        this.state.newActivity.duration = newDuration;
    }

    /**
     * @param {Activity} activity
     * @returns {Promise<void>}
     */
    changeActivity = (activity) => {
        return new Promise((resolve) => {
            this.setState({ newActivity: activity }, () => {
                this.refChild2.current?.update(true);
                resolve();
            });
        });
    };

    unSelectActivity = () => {
        this.changeActivity({
            ...this.state.newActivity,
            skillID: 0
        });
    };
}

BackActivity.defaultProps = BackActivityProps;
BackActivity.prototype.props = BackActivityProps;

export default BackActivity;

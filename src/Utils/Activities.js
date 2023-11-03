import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetDay } from 'Utils/Date';
import { GetTime } from 'Utils/Time';
import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('Class/Tasks').Task} Task
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

const TIME_STEP_MINUTES = 5;
const MIN_TIME_MINUTES =  1 * TIME_STEP_MINUTES; // 5m
const MAX_TIME_MINUTES = 48 * TIME_STEP_MINUTES; // 4h

/**
 * @param {number} skillID
 * @param {number} startTime
 * @param {number} duration
 * @param {() => void} funcBack
 * @returns {boolean} True if activity was added successfully
 */
function AddActivityNow(skillID, startTime, duration, funcBack) {
    const lang = langManager.curr['activity'];

    // Get the max duration possible
    while (!user.activities.TimeIsFree(startTime, duration)) {
        duration -= TIME_STEP_MINUTES;
        if (duration <= 0) {
            user.interface.ChangePage('display', {
                /** @type {Icons} */
                'icon': 'error',
                'iconRatio': .4,
                'text': lang['display-fail-text'].replace('{}', 'time'),
                'button': lang['display-fail-button'],
                'action': funcBack
            }, true);
            return false;
        }
    }

    // Set max limit
    if (duration > MAX_TIME_MINUTES) {
        duration = MAX_TIME_MINUTES;
    }

    /** @type {Activity} */
    const newActivity = {
        skillID:    skillID,
        startTime:  startTime,
        duration:   duration,
        comment:    '',
        timezone:   0,
        startNow:   true
    };

    return AddActivity(newActivity);
}

/**
 * @param {Activity} activity
 * @returns {boolean} True if activity was added or edited successfully
 */
function AddActivity(activity) {
    const lang = langManager.curr['activity'];
    const now = GetTime();
    const addState = user.activities.Add(
        activity.skillID,
        activity.startTime,
        activity.duration,
        activity.comment,
        null,
        activity.startNow
    );

    if (addState === 'added') {
        Notifications.Evening.RemoveToday();
        const text = lang['display-activity-text'];
        const button = lang['display-activity-button'];
        const args = { 'icon': 'success', 'text': text, 'button': button, 'action': Back };

        const skill = dataManager.skills.GetByID(activity.skillID);
        if (skill === null) {
            const lang = langManager.curr['activity'];
            user.interface.ChangePage('display', {
                /** @type {Icons} */
                'icon': 'error',
                'iconRatio': .4,
                'text': lang['display-fail-text'].replace('{}', 'skill not fount'),
                'button': lang['display-fail-button'],
                'action': Back
            }, true);
        }

        /** @param {Task} task @returns {boolean} */
        const matchID = ({ Skill: { id, isCategory } }) => {
            if (isCategory) return id === skill.CategoryID;
            else            return id === activity.skillID;
        };
        /** @param {Task} task @returns {boolean} */
        const matchTime = ({ Checked, Schedule, Deadline }) => {
            const d = new Date();
            d.setUTCHours(1, 0, 0, 0);
            const now = GetTime();

            /** @type {'schedule'|'deadline'|null} */
            let deadlineType = null;

            /** @type {number|null} Minimum number of days */
            let minDeltaDays = null;

            let i = 0;
            let days = Schedule.Repeat;
            if (Schedule.Type === 'month') {
                days = days.map(day => day + 1);
            }

            if (days.length > 0) {
                while (minDeltaDays === null) {
                    const weekMatch = Schedule.Type === 'week' && days.includes(GetDay(d));
                    const monthMatch = Schedule.Type === 'month' && days.includes(d.getUTCDate());
                    if (weekMatch || monthMatch) {
                        minDeltaDays = i + 1;
                        deadlineType = 'schedule';
                    }
                    i++;
                    d.setUTCDate(d.getUTCDate() + 1);
                }
            }

            // Search next deadline (if earlier than schedule or no schedule)
            if (Deadline > 0) {
                const delta = (Deadline - now) / (60 * 60 * 24);
                if (minDeltaDays === null || delta < minDeltaDays) {
                    deadlineType = 'deadline';
                    minDeltaDays = delta;
                }
            }

            return activity.startTime < now + (minDeltaDays * 24 * 60 * 60);
        };

        const tasks = user.tasks.Get()
                        .filter(task => task.Checked === 0)
                        .filter(task => task.Skill !== null)
                        .filter(matchID)
                        .filter(matchTime);

        if (tasks.length > 0) {
            tasks.forEach(task => user.tasks.Check(task, now));
            const text = lang['display-task-complete-text'];
            const completeArgs = { 'icon': 'success', 'text': text, 'button': button, 'action': Back };
            args['action'] = () => user.interface.ChangePage('display', completeArgs, true, true);
        }

        user.interface.ChangePage('display', args, true);
        user.GlobalSave();
        user.RefreshStats();
    }

    else if (addState === 'edited') {
        user.GlobalSave();
        user.RefreshStats();
    }

    else if (addState === 'notFree') {
        const title = lang['alert-wrongtiming-title'];
        const text = lang['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    // TODO: Manage other states

    return addState === 'added' || addState === 'edited';
}

/**
 * @param {() => void} callback
 */
function RemActivity(callback) {
    const title = langManager.curr['activity']['alert-remove-title'];
    const text = langManager.curr['activity']['alert-remove-text'];
    const remove = (button) => button === 'yes' && callback();
    user.interface.popup.Open('yesno', [ title, text ], remove);
}

function Back() {
    if (user.interface.path.length > 1) {
        user.interface.BackHandle();
    } else {
        user.interface.ChangePage('calendar');
    }
}

export {
    TIME_STEP_MINUTES, MIN_TIME_MINUTES, MAX_TIME_MINUTES,
    AddActivityNow, AddActivity, RemActivity
};
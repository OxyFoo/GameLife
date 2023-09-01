import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import Notifications from 'Utils/Notifications';
import { GetMidnightTime, GetTime } from 'Utils/Time';

/**
 * @typedef {import('Class/Tasks').Task} Task
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

/**
 * @param {number} skillID
 * @param {number} startTime
 * @param {number} duration
 * @returns {boolean} True if activity was added successfully
 */
function AddActivityNow(skillID, startTime, duration) {
    const lang = langManager.curr['activity'];

    // Get the max duration possible
    while (!user.activities.TimeIsFree(startTime, duration)) {
        duration -= 15;
        if (duration <= 0) {
            user.interface.ChangePage('display', {
                /** @type {Icons} */
                'icon': 'error',
                'iconRatio': .4,
                'text': lang['display-fail-text'].replace('{}', 'time'),
                'button': lang['display-fail-button'],
                'action': Back
            }, true);
            return false;
        }
    }

    return AddActivity({ skillID, startTime, duration, comment: '', timezone: 0 });
}

/**
 * @param {Activity} activity
 * @returns {boolean} True if activity was added or edited successfully
 */
function AddActivity(activity) {
    const lang = langManager.curr['activity'];
    const now = GetTime();
    const addState = user.activities.Add(activity.skillID, activity.startTime, activity.duration, activity.comment);

    if (addState === 'added') {
        Notifications.Evening.RemoveToday();
        const text = lang['display-activity-text'];
        const button = lang['display-activity-button'];
        const args = { 'icon': 'success', 'text': text, 'button': button, 'action': Back };

        // If activity starts today
        const isBeforeMidnight = activity.startTime < GetMidnightTime(now + 86400000);
        const isAfterMidnight = activity.startTime > GetMidnightTime(now);
        if (isBeforeMidnight && isAfterMidnight) {
            const skill = dataManager.skills.GetByID(activity.skillID);

            /** @param {Task} task @returns {boolean} */
            const isMatch = ({ Skill: { id, isCategory } }) => {
                if (isCategory) return id === skill.CategoryID;
                else            return id === activity.skillID;
            };

            const tasks = user.tasks.Get()
                            .filter(task => task.Skill !== null)
                            .filter(isMatch)
                            .filter(task => task.Checked === 0);

            if (tasks.length > 0) {
                tasks.forEach(task => user.tasks.Check(task, now));
                const text = lang['display-task-complete-text'];
                const completeArgs = { 'icon': 'success', 'text': text, 'button': button, 'action': Back };
                args['action'] = () => user.interface.ChangePage('display', completeArgs, true, true);
            }
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
        user.interface.BackPage();
    } else {
        user.interface.ChangePage('calendar');
    }
}

export { AddActivityNow, AddActivity, RemActivity };
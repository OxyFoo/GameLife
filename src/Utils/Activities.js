import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import Notifications from 'Utils/Notifications';
import { MinMax } from 'Utils/Functions';
import { GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 */

const TIME_STEP_MINUTES = 5;
const MIN_TIME_MINUTES = 1 * TIME_STEP_MINUTES; // 5m
const MAX_TIME_MINUTES = 72 * TIME_STEP_MINUTES; // 6h

/** @param {number} skillID */
function StartActivityNow(skillID) {
    const startTime = GetLocalTime();
    const roundedTime = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');

    if (!user.activities.TimeIsFree(roundedTime, MIN_TIME_MINUTES)) {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const message = langManager.curr['activity']['alert-wrongtiming-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message }
        });
        return;
    }

    user.activities.currentActivity.Set({
        skillID,
        startTime,
        timezone: GetTimeZone(),
        friendsIDs: []
    });
    user.LocalSave();
    user.interface.ChangePage('activitytimer', { storeInHistory: false });
}

/**
 * @param {number} skillID
 * @param {number} startTime
 * @param {number} endTime
 * @param {Array<number>} friendsIDs
 * @param {() => void} funcBack
 * @returns {boolean} True if activity was added successfully
 */
function AddActivityNow(skillID, startTime, endTime, friendsIDs, funcBack) {
    const lang = langManager.curr['activity'];

    const startTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');
    const endTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, endTime, 'near');

    const delta = endTimeRounded - startTimeRounded;
    let duration = MinMax(MIN_TIME_MINUTES, delta / 60, MAX_TIME_MINUTES);

    // Get the max duration possible
    while (!user.activities.TimeIsFree(startTimeRounded, duration)) {
        duration -= TIME_STEP_MINUTES;
        if (duration <= 0) {
            user.interface.ChangePage('display', {
                args: {
                    icon: 'close-filled',
                    text: lang['display-fail-text'].replace('{}', 'time'),
                    button: lang['display-fail-button'],
                    action: funcBack
                },
                storeInHistory: false
            });
            return false;
        }
    }

    /** @type {Activity} */
    const newActivity = {
        skillID: skillID,
        startTime: startTimeRounded,
        duration: duration,
        comment: '',
        timezone: 0,
        addedType: 'start-now',
        addedTime: 0,
        friends: friendsIDs
    };

    return AddActivity(newActivity);
}

/**
 * @param {Activity} activity
 * @returns {boolean} True if activity was added or edited successfully
 */
function AddActivity(activity) {
    const lang = langManager.curr['activity'];

    const { status, activity: newActivity } = user.activities.Add({
        skillID: activity.skillID,
        startTime: activity.startTime,
        duration: activity.duration,
        comment: activity.comment,
        timezone: 0,
        addedType: activity.addedType,
        addedTime: 0,
        friends: activity.friends
    });

    if (status === 'added' && newActivity !== null) {
        // Update notifications
        Notifications.Evening.RemoveToday();

        // Update missions
        user.missions.SetMissionState('mission1', 'completed');

        const skill = dataManager.skills.GetByID(activity.skillID);
        if (skill === null) {
            user.interface.ChangePage('display', {
                args: {
                    icon: 'close-filled',
                    text: lang['display-fail-text'].replace('{}', 'skill not found'),
                    button: lang['display-fail-button'],
                    action: Back
                },
                storeInHistory: false
            });
        }

        user.interface.ChangePage('display', {
            args: {
                icon: 'check-filled',
                text: lang['display-activity-text'],
                quote: dataManager.quotes.GetRandomQuote(),
                button: lang['display-activity-button'],
                //button2: lang['display-activity-button2'],
                action: Back
                //action2: () => {
                //    // TODO: Back page & reopen the activity panel
                //    user.interface.ChangePage('activity', {
                //        arge: { time: newActivity.startTime + newActivity.duration * 60 },
                //        storeInHistory: false
                //    });
                //},
            },
            storeInHistory: false
        });
        user.GlobalSave().then(() => user.RefreshStats(false));
    } else if (status === 'edited') {
        user.GlobalSave().then(() => user.RefreshStats(false));
    } else if (status === 'notFree') {
        const title = lang['alert-wrongtiming-title'];
        const message = lang['alert-wrongtiming-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message }
        });
    } else if (status === 'tooEarly') {
        const title = lang['alert-alreadyexist-title'];
        const message = lang['alert-alreadyexist-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message }
        });
    } else if (status === 'alreadyExist') {
        const title = lang['alert-tooearly-title'];
        const message = lang['alert-tooearly-message'];
        user.interface.popup.OpenT({
            type: 'ok',
            data: { title, message }
        });
    }

    return status === 'added' || status === 'edited';
}

/**
 * @param {() => void} callback
 */
function RemActivity(callback) {
    const title = langManager.curr['activity']['alert-remove-title'];
    const message = langManager.curr['activity']['alert-remove-message'];
    user.interface.popup.OpenT({
        type: 'yesno',
        data: { title, message },
        callback: (button) => {
            if (button === 'yes') {
                callback();
            }
        }
    });
}

function Back() {
    if (user.interface.history.length > 1) {
        user.interface.BackHandle();
    } else {
        user.interface.ChangePage('calendar');
    }
}

export {
    TIME_STEP_MINUTES,
    MIN_TIME_MINUTES,
    MAX_TIME_MINUTES,
    StartActivityNow,
    AddActivityNow,
    AddActivity,
    RemActivity
};

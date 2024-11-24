import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import Notifications from 'Utils/Notifications';
import { MinMax } from 'Utils/Functions';
import { GetDate, GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').Activity} Activity
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
        user.interface.popup?.OpenT({
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
    user.SaveLocal();
    user.interface.ChangePage('activitytimer', { storeInHistory: false });
}

/**
 * @param {number} skillID
 * @param {number} startTime
 * @param {number} endTime
 * @param {Array<number>} friendsIDs
 * @param {() => void} funcBack
 * @returns {Promise<boolean>} True if activity was added successfully
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
            return Promise.resolve(false);
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
 * @returns {Promise<boolean>} True if activity was added or edited successfully
 */
async function AddActivity(activity) {
    const lang = langManager.curr['activity'];

    const { status } = user.activities.Add({
        skillID: activity.skillID,
        startTime: activity.startTime,
        duration: activity.duration,
        comment: activity.comment,
        timezone: 0,
        addedType: activity.addedType,
        addedTime: 0,
        friends: activity.friends
    });

    if (status === 'added') {
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
                action: async () => {
                    await Back();

                    // Move the calendar to the new day
                    const calendar = user.interface.GetPage('calendar');
                    if (calendar !== null) {
                        const activityDate = GetDate(activity.startTime);
                        const day = activityDate.getDate();
                        const month = activityDate.getMonth();
                        const year = activityDate.getFullYear();
                        const newDay = calendar.state.days.find(
                            (d) => d.day === day && d.month === month && d.year === year
                        );
                        if (newDay) {
                            calendar.onDayPress(newDay);
                        }
                    }
                }
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
        return true;
    } else if (status === 'notFree') {
        const title = lang['alert-wrongtiming-title'];
        const message = lang['alert-wrongtiming-message'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
    } else if (status === 'tooEarly') {
        const title = lang['alert-alreadyexist-title'];
        const message = lang['alert-alreadyexist-message'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
    } else if (status === 'alreadyExist') {
        const title = lang['alert-tooearly-title'];
        const message = lang['alert-tooearly-message'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
    }

    return false;
}

/**
 * @param {Activity} oldActivity
 * @param {Activity} newActivity
 * @param {boolean} confirm
 * @returns {Promise<boolean>} True if activity was edited successfully
 */
async function EditActivity(oldActivity, newActivity, confirm = false) {
    const lang = langManager.curr['activity'];

    const { status, activity } = user.activities.Edit(oldActivity, newActivity, confirm);

    // Manage confirmation
    if (status === 'needConfirmation') {
        return new Promise((resolve) => {
            user.interface.popup?.OpenT({
                type: 'yesno',
                data: {
                    title: lang['alert-needconfirmation-title'],
                    message: lang['alert-needconfirmation-message']
                },
                callback: async (button) => {
                    if (button === 'yes') {
                        resolve(EditActivity(oldActivity, newActivity, true));
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    // Manage errors
    else if (status === 'notFree') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-wrongtiming-title'],
                message: lang['alert-wrongtiming-message']
            }
        });
        return false;
    } else if (status === 'tooEarly') {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-alreadyexist-title'],
                message: lang['alert-alreadyexist-message']
            }
        });
        return false;
    } else if (status !== 'edited' || activity === null) {
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['alert-error-title'],
                message: lang['alert-error-message'].replace('{}', status)
            }
        });
        return false;
    }

    return true;
}

/**
 * @param {Activity} activity
 * @returns {Promise<boolean>} True if activity was removed successfully
 */
async function RemoveActivity(activity) {
    const lang = langManager.curr['activity'];

    return new Promise((resolve) => {
        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-remove-title'],
                message: lang['alert-remove-message']
            },
            callback: (button) => {
                if (button !== 'yes') {
                    resolve(false);
                    return;
                }

                const removedStatus = user.activities.Remove(activity);

                if (removedStatus === 'notExist' || removedStatus !== 'removed') {
                    user.interface.popup?.OpenT({
                        type: 'ok',
                        data: {
                            title: lang['alert-error-not-exist-title'],
                            message: lang['alert-error-not-exist-message']
                        }
                    });
                    resolve(false);
                    return;
                }

                resolve(true);
            }
        });
    });
}

/**
 * @returns {Promise<void>}
 */
function Back() {
    return new Promise((resolve) => {
        if (user.interface.history.length === 0 || user.interface.GetCurrentPageName() === 'activitytimer') {
            user.interface.ChangePage('calendar', { callback: resolve });
            return;
        } else {
            user.interface.BackHandle({ callback: resolve });
        }
    });
}

export {
    TIME_STEP_MINUTES,
    MIN_TIME_MINUTES,
    MAX_TIME_MINUTES,
    StartActivityNow,
    AddActivityNow,
    AddActivity,
    EditActivity,
    RemoveActivity
};

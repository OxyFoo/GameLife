import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import Notifications from 'Utils/Notifications';
import { MinMax } from 'Utils/Functions';
import { GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 */

const TIME_STEP_MINUTES = 5;
const MIN_TIME_MINUTES =  1 * TIME_STEP_MINUTES; // 5m
const MAX_TIME_MINUTES = 48 * TIME_STEP_MINUTES; // 4h

/** @param {number} skillID */
function StartActivityNow(skillID) {
    const startTime = GetLocalTime();
    const roundedTime = RoundTimeTo(TIME_STEP_MINUTES, startTime, 'near');

    if (!user.activities.TimeIsFree(roundedTime, MIN_TIME_MINUTES)) {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const text = langManager.curr['activity']['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
        return;
    }

    user.activities.currentActivity.Set({
        skillID,
        startTime,
        timezone: GetTimeZone(),
        friendsIDs: []
    });
    user.LocalSave();
    user.interface.ChangePage('activitytimer', undefined, true);
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
    const endTimeRounded = RoundTimeTo(TIME_STEP_MINUTES, endTime, 'next');

    let duration = (endTimeRounded - startTimeRounded) / 60;
    duration = MinMax(MIN_TIME_MINUTES, duration, MAX_TIME_MINUTES);

    // Get the max duration possible
    while (!user.activities.TimeIsFree(startTimeRounded, duration)) {
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

    /** @type {Activity} */
    const newActivity = {
        skillID:    skillID,
        startTime:  startTimeRounded,
        duration:   duration,
        comment:    '',
        timezone:   0,
        addedType:  'start-now',
        addedTime:  0,
        friends:    friendsIDs
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

        const args = {
            'icon': 'success',
            'text': lang['display-activity-text'],
            'quote': dataManager.quotes.GetRandomQuote(),
            'button': lang['display-activity-button'],
            'button2': lang['display-activity-button2'],
            'action': Back,
            'action2': () => user.interface.ChangePage('activity', { time: newActivity.startTime + newActivity.duration * 60 }, true)
        };

        const skill = dataManager.skills.GetByID(activity.skillID);
        if (skill === null) {
            const lang = langManager.curr['activity'];
            user.interface.ChangePage('display', {
                /** @type {Icons} */
                'icon': 'error',
                'iconRatio': .4,
                'text': lang['display-fail-text'].replace('{}', 'skill not found'),
                'button': lang['display-fail-button'],
                'action': Back
            }, true);
        }

        user.interface.ChangePage('display', args, true);
        user.GlobalSave()
        .then(() => user.RefreshStats(false));
    }

    else if (status === 'edited') {
        user.GlobalSave()
        .then(() => user.RefreshStats(false));
    }

    else if (status === 'notFree') {
        const title = lang['alert-wrongtiming-title'];
        const text = lang['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    else if (status === 'tooEarly') {
        const title = lang['alert-alreadyexist-title'];
        const text = lang['alert-alreadyexist-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    else if (status === 'alreadyExist') {
        const title = lang['alert-tooearly-title'];
        const text = lang['alert-tooearly-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    return status === 'added' || status === 'edited';
}

/**
 * @param {() => void} callback
 */
function RemActivity(callback) {
    const title = langManager.curr['activity']['alert-remove-title'];
    const text = langManager.curr['activity']['alert-remove-text'];
    user.interface.popup.Open('yesno', [ title, text ], (button) => {
        if (button === 'yes') {
            callback();
        }
    });
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
    StartActivityNow, AddActivityNow, AddActivity, RemActivity
};

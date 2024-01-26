import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
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
        startNow:   true,
        addedTime:  0
    };

    return AddActivity(newActivity);
}

/**
 * @param {Activity} activity
 * @returns {boolean} True if activity was added or edited successfully
 */
function AddActivity(activity) {
    const lang = langManager.curr['activity'];

    const addState = user.activities.Add({
        skillID: activity.skillID,
        startTime: activity.startTime,
        duration: activity.duration,
        comment: activity.comment,
        timezone: null,
        startNow: activity.startNow,
        addedTime: null
    });

    if (addState === 'added') {
        Notifications.Evening.RemoveToday();

        const text = lang['display-activity-text'];
        const quoteObject = dataManager.quotes.GetRandomQuote();
        const quote = quoteObject != undefined ? quoteObject.Quote[langManager.currentLangageKey] : '';
        const button = lang['display-activity-button'];
        const args = {
            'icon': 'success',
            'text': text,
            'quote': quote,
            'button': button,
            'action': Back
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

    else if (addState === 'edited') {
        user.GlobalSave()
        .then(() => user.RefreshStats(false));
    }

    else if (addState === 'notFree') {
        const title = lang['alert-wrongtiming-title'];
        const text = lang['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    else if (addState === 'tooEarly') {
        const title = lang['alert-alreadyexist-title'];
        const text = lang['alert-alreadyexist-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

    else if (addState === 'alreadyExist') {
        const title = lang['alert-tooearly-title'];
        const text = lang['alert-tooearly-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }

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

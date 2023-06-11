import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetTime } from 'Utils/Time';
import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('.').default} ActivityPanel
 * @typedef {import('Class/Activities').Activity} Activity
 */

/**
 * @param {Activity} activity
 * @returns {Promise<string|null>}
 */
async function AskActivityComment(activity) {
    return new Promise((resolve) => {   
        const titleCommentary = langManager.curr['activity']['title-commentary'];
        const onClose = () => resolve(null);
        user.interface.screenInput.Open(titleCommentary, activity.comment, resolve, true, onClose);
    });
}
/**
 * @param {() => void} callback
 */
async function onRemComment(callback) {
    const title = langManager.curr['activity']['alert-remcomment-title'];
    const text = langManager.curr['activity']['alert-remcomment-text'];
    const cb = (button) => button === 'yes' && callback();
    user.interface.popup.Open('yesno', [ title, text ], callback);
}

/**
 * @param {number} skillID
 * @param {Activity} activity
 */
function AddActivity(skillID, activity) {
    const addState = user.activities.Add(skillID, activity.startTime, activity.duration, activity.comment);
    if (addState === 'added') {
        Notifications.Evening.RemoveToday();
        const text = langManager.curr['activity']['display-activity-text'];
        const button = langManager.curr['activity']['display-activity-button'];
        user.interface.ChangePage('display', { 'icon': 'success', 'text': text, 'button': button }, true);
        user.GlobalSave();
        user.RefreshStats();
    } else if (addState === 'edited') {
        user.GlobalSave();
        user.RefreshStats();
    } else if (addState === 'notFree') {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const text = langManager.curr['activity']['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }
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
/** @this ActivityPanel */
function StartActivity() {
    const skillID = this.state.selectedSkillID;
    const startTime = GetTime();

    if (!user.activities.TimeIsFree(startTime, 15)) {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const text = langManager.curr['activity']['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
        return;
    }

    user.activities.currentActivity = { skillID, startTime };
    user.LocalSave();
    user.interface.ChangePage('activitytimer', undefined, true);
}

export {
    AskActivityComment, onRemComment,
    AddActivity, RemActivity, StartActivity
};
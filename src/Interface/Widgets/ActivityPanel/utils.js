import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import Notifications from 'Utils/Notifications';
import { GetMidnightTime, GetTime, RoundToQuarter } from 'Utils/Time';

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
    user.interface.popup.Open('yesno', [ title, text ], cb);
}

/**
 * @param {number} skillID
 * @param {Activity} activity
 */
function AddActivity(skillID, activity) {
    const lang = langManager.curr['activity'];
    const now = GetTime();
    const addState = user.activities.Add(skillID, activity.startTime, activity.duration, activity.comment);

    if (addState === 'added') {
        Notifications.Evening.RemoveToday();
        const text = lang['display-activity-text'];
        const button = lang['display-activity-button'];
        const args = { 'icon': 'success', 'text': text, 'button': button };

        // If activity starts today
        const isBeforeMidnight = activity.startTime < GetMidnightTime(now + 86400000);
        const isAfterMidnight = activity.startTime > GetMidnightTime(now);
        if (isBeforeMidnight && isAfterMidnight) {
            const skill = dataManager.skills.GetByID(skillID);
            const tasks = user.tasks.Get()
                            .filter(task => task.Skill !== null)
                            .filter(task => task.Skill.isCategory ? task.Skill.id === skill.CategoryID : task.Skill.id === skillID)
                            .filter(task => task.Checked === 0);

            if (tasks.length > 0) {
                tasks.forEach(task => user.tasks.Check(task, now));
                const text = lang['display-task-complete-text'];
                const completeArgs = { 'icon': 'success', 'text': text, 'button': button };
                args['action'] = () => user.interface.ChangePage('display', completeArgs, true, true);
            }
        }

        user.interface.ChangePage('display', args, true);
        user.GlobalSave();
        user.RefreshStats();
    } else if (addState === 'edited') {
        user.GlobalSave();
        user.RefreshStats();
    } else if (addState === 'notFree') {
        const title = lang['alert-wrongtiming-title'];
        const text = lang['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }
    // TODO: Manage other states
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
    const startTime = RoundToQuarter(GetTime(undefined, 'local'), 'prev');
    const localTime = GetTime(undefined, 'local');

    if (!user.activities.TimeIsFree(startTime, 15)) {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const text = langManager.curr['activity']['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
        return;
    }

    user.activities.currentActivity = { skillID, startTime, localTime };
    user.LocalSave();
    user.interface.ChangePage('activitytimer', undefined, true);
}

export {
    AskActivityComment, onRemComment,
    AddActivity, RemActivity, StartActivity
};
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';
import { MIN_TIME_MINUTES, TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('./index').default} ActivityPanel
 * @typedef {import('Class/Activities').Activity} Activity
 */

/**
 * @param {Activity} activity
 * @returns {Promise<string | null>}
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

/** @this ActivityPanel */
function StartActivity() {
    const skillID = this.state.selectedSkillID;
    const startTime = GetTime(undefined, 'local');
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

export { AskActivityComment, onRemComment, StartActivity };

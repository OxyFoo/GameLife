import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

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

export { AskActivityComment, onRemComment };

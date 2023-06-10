import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetTime } from 'Utils/Time';
import Notifications from 'Utils/Notifications';

/**
 * @typedef {import('./Panel').default} ActivityPanel
 */

/** @this ActivityPanel */
function onAddComment() {
    if (this.state.comment !== '') return;
    const save = () => this.editMode && this.AddActivity();
    /** @param {string} text */
    const callback = (text) => {
        this.setState({ comment: text }, save);
    };
    const titleCommentary = langManager.curr['activity']['title-commentary'];
    user.interface.screenInput.Open(titleCommentary, '', callback, true);
}
/** @this ActivityPanel */
function onEditComment() {
    const titleCommentary = langManager.curr['activity']['title-commentary']
    const save = () => {
        if (this.editMode) {
            this.AddActivity();
        }
        // TODO: Hide empty space under panel after comment edition
        this.refPanelScreen.RefreshPosition();
    };
    /** @param {string} text */
    const callback = (text) => {
        this.setState({ comment: text }, save);
    };
    user.interface.screenInput.Open(titleCommentary, this.state.comment, callback, true);
}
/** @this ActivityPanel */
function onRemComment() {
    const title = langManager.curr['activity']['alert-remcomment-title'];
    const text = langManager.curr['activity']['alert-remcomment-text'];
    const save = () => {
        if (this.editMode) {
            this.AddActivity();
        }
        // TODO: Hide empty space under panel after comment edition
        this.refPanelScreen.RefreshPosition();
    };
    const callback = (btn) => btn === 'yes' && this.setState({ comment: '' }, save);
    user.interface.popup.Open('yesno', [ title, text ], callback);
}

/** @this ActivityPanel */
function AddActivity() {
    const skillID = this.state.selectedSkill.id;
    const { activityStart, activityDuration, comment } = this.state;

    const addState = user.activities.Add(skillID, activityStart, activityDuration, comment);
    if (addState === 'added') {
        Notifications.Evening.RemoveToday();
        const text = langManager.curr['activity']['display-activity-text'];
        const button = langManager.curr['activity']['display-activity-button'];
        user.interface.ChangePage('display', { 'icon': 'success', 'text': text, 'button': button }, true);
        user.GlobalSave();
        user.RefreshStats();
    } else if (addState === 'edited') {
        //user.interface.BackPage();
    } else if (addState === 'notFree') {
        const title = langManager.curr['activity']['alert-wrongtiming-title'];
        const text = langManager.curr['activity']['alert-wrongtiming-text'];
        user.interface.popup.Open('ok', [ title, text ]);
    }
}
/** @this ActivityPanel */
function RemActivity() {
    const remove = (button) => {
        if (button === 'yes') {
            user.activities.Remove(this.props.args.activity);
            user.interface.BackPage();
            user.GlobalSave();
        }
    }
    const title = langManager.curr['activity']['alert-remove-title'];
    const text = langManager.curr['activity']['alert-remove-text'];
    user.interface.popup.Open('yesno', [ title, text ], remove);
}
/** @this ActivityPanel */
function StartActivity() {
    const skillID = this.state.selectedSkill.id;
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
    onAddComment, onEditComment, onRemComment,
    AddActivity, RemActivity, StartActivity
};
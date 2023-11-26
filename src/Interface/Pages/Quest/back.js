import { Keyboard } from 'react-native';

import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Class/Quests').Quest} Quest
 * @typedef {import('Class/Quests').RepeatModes} RepeatModes
 * 
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * 
 * @typedef {'new'|'edit'|'remove'} States
 * 
 * @typedef {import('./Sections/activity').default} SectionActivity
 * @typedef {import('./Sections/schedule').default} SectionSchedule
 * @typedef {import('./Sections/schedule').OnChangeScheduleEvent} OnChangeScheduleEvent
 * @typedef {import('./Sections/tasks').default} SectionTasks
 * @typedef {import('./Sections/description').default} SectionDescription
 */

class BackQuest extends PageBack {
    state = {
        /** @type {States} */
        action: 'new',
        button: {
            /** @type {string} */
            text: langManager.curr['quest']['button-add'],

            /** @type {ThemeColor | ThemeText} */
            color: 'main2'
        },

        /** @type {string} */
        title: '',

        /** @type {string} Error message to display */
        error: ''
    };

    /** @type {SectionActivity|null} */
    refSectionSkill = null;

    /** @type {SectionSchedule|null} */
    refSectionSchedule = null;

    /** @type {SectionTasks|null} */
    refSectionTasks = null;

    /** @type {SectionDescription|null} */
    refSectionDescription = null;

    /** @type {Quest|null} */
    selectedQuest = null;

    /** @type {RepeatModes} */
    lastRepeatMode = 'none';

    constructor(props) {
        super(props);

        if (this.props.args?.quest) {
            /** @type {Quest|null} */
            const quest = this.props.args.quest || null;
            this.selectedQuest = quest;
            this.lastRepeatMode = quest.Schedule.Type;

            if (quest === null) {
                user.interface.BackHandle();
                user.interface.console.AddLog('error', 'Quest: Quest not found');
                return;
            }

            this.state = {
                action: 'remove',
                button: {
                    text: langManager.curr['quest']['button-remove'],
                    color: 'danger'
                },

                title: quest.Title,
                error: ''
            };
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const { selectedQuest } = this;
        if (selectedQuest === null) return;

        const { Deadline, Schedule: { Type, Repeat } } = selectedQuest;
        this.refSectionSchedule.SetValues(Deadline, Type, Repeat);
        this.refSectionTasks.SetTasks(selectedQuest.Tasks);
        this.refSectionSkill.SetSkill(selectedQuest.Skill);
        this.refSectionDescription.SetDescription(selectedQuest.Description);
    }

    componentDidFocused = () => {
        user.interface.SetCustomBackHandler(this.BackHandler);
    }

    /**
     * @param {boolean} askPopup Show a popup to ask the user if he wants to
     *                           leave the page when he is editing a quest
     * @returns {boolean}
     */
    BackHandler = (askPopup = true) => {
        const { action } = this.state;

        // Don't show popup or quest not edited => leave
        if (!askPopup || action === 'remove') {
            return true;
        }

        const callback = (btn) => {
            if (btn === 'yes') {
                user.interface.ResetCustomBackHandler();
                user.interface.BackHandle();
            }
        }
        const title = langManager.curr['quest']['alert-back-title'];
        const text = langManager.curr['quest']['alert-back-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
        return false;
    }

    onEditQuest = () => {
        if (this.selectedQuest !== null && this.state.action !== 'edit') {
            this.setState({
                action: 'edit',
                button: {
                    text: langManager.curr['quest']['button-save'],
                    color: 'success'
                }
            });
        }
    }

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    }

    /**
     * @param {string} title 
     * @param {boolean} [init=false]
     */
    onChangeTitle = (title, init = false) => {
        // Edition mode if title is modified
        if (!init) this.onEditQuest();

        this.checkTitleErrors(title);
        this.setState({ title });
    }

    /**
     * @param {string} title 
     * @returns {boolean} True if error
     */
    checkTitleErrors = (title) => {
        let message = '';

        const titleIsCurrent = title === (this.selectedQuest?.Title || null);
        const titleUsed = user.quests.Get().some(t => t.Title === title);

        if (title.trim().length <= 0) {
            message = langManager.curr['quest']['error-title-empty'];
        }

        else if (!titleIsCurrent && titleUsed) {
            message = langManager.curr['quest']['error-title-exists'];
        }

        this.setState({ error: message });
        return message.length > 0;
    }

    /** @type {OnChangeScheduleEvent} */
    onChangeSchedule = (deadline, repeatMode, repeatDays) => {
        // Check if repeat mode has changed to reset scroll position
        if (this.lastRepeatMode !== repeatMode) {
            this.lastRepeatMode = repeatMode;
            this.refPage.GotoY(0);
        }

        this.onEditQuest();
    }

    onButtonPress = () => {
        const { action } = this.state;
        switch (action) {
            case 'new': this.addQuest(); break;
            case 'edit': this.editQuest(); break;
            case 'remove': this.remQuest(); break;
            default:
                user.interface.console.AddLog('error', 'Quest: Unknown action');
        }
    }
    addQuest = () => {
        const { title } = this.state;
        const { deadline, repeatMode, selectedDays } = this.refSectionSchedule.GetValues();

        const skill = this.refSectionSkill.GetSkill();
        const tasks = this.refSectionTasks.GetTasks()
        const description = this.refSectionDescription.GetDescription();

        if (this.checkTitleErrors(title)) {
            return;
        }

        const addition = user.quests.Add(
            title,
            description,
            deadline,
            repeatMode,
            selectedDays,
            skill,
            tasks
        );

        if (addition === 'added') {
            user.GlobalSave();
            user.interface.ResetCustomBackHandler();
            user.interface.BackHandle();
        } else if (addition === 'alreadyExist') {
            user.interface.console.AddLog('warn', 'Quest: Quest already exist');
        }
    }
    editQuest = () => {
        const { title } = this.state;
        const { deadline, repeatMode, selectedDays } = this.refSectionSchedule.GetValues();

        const skill = this.refSectionSkill.GetSkill();
        const tasks = this.refSectionTasks.GetTasks();
        const description = this.refSectionDescription.GetDescription();

        if (this.selectedQuest === null) {
            user.interface.console.AddLog('error', 'Quest: Selected quest is null');
            return;
        }

        if (this.checkTitleErrors(title)) {
            return;
        }

        const edition = user.quests.Edit(
            this.selectedQuest,
            title,
            description,
            deadline,
            repeatMode,
            selectedDays,
            skill,
            tasks
        );

        if (edition === 'edited') {
            user.GlobalSave();
            user.interface.ResetCustomBackHandler();
            user.interface.BackHandle();
        } else if (edition === 'notExist') {
            user.interface.console.AddLog('warn', 'Quest: Quest not exist');
        }
    }
    remQuest = () => {
        if (this.selectedQuest === null) {
            user.interface.console.AddLog('error', 'Quest: Selected quest is null');
            return;
        }

        const callback = (btn) => {
            if (btn === 'yes') {
                const remove = user.quests.Remove(this.selectedQuest);
                if (remove === 'removed') {
                    user.GlobalSave();
                    user.interface.ResetCustomBackHandler();
                    user.interface.BackHandle();
                } else if (remove === 'notExist') {
                    user.interface.console.AddLog('warn', 'Quest: Quest not exist');
                }
            }
        }
        const title = langManager.curr['quest']['alert-remquest-title'];
        const text = langManager.curr['quest']['alert-remquest-text'];
        user.interface.popup.Open('yesno', [ title, text ], callback);
    }
}

export default BackQuest;

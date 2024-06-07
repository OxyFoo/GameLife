import { Keyboard } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import StartMission from './mission';

/**
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('Class/Quests/MyQuests').InputsError} InputsError
 * @typedef {import('Class/Quests/MyQuests').RepeatModes} RepeatModes
 * 
 * @typedef {'add' | 'save' | 'remove'} States
 * 
 * @typedef {import('./Sections/skills').default} SectionActivity
 * @typedef {import('./Sections/schedule').default} SectionSchedule
 * @typedef {import('./Sections/comment').default} SectionComment
 */

const BackQuestProps = {
    args: {
        /** @type {MyQuest | null} */
        quest: null
    }
};

class BackQuest extends PageBase {
    state = {
        /** @type {States} */
        action: 'add',

        /** @type {string} */
        title: '',

        /** @type {Array<number>} */
        skills: [],

        schedule: {
            /** @type {RepeatModes} */
            type: 'week',

            /** @type {Array<number>} */
            repeat: []
        },

        /** @type {number} */
        duration: 60,

        /** @type {string} */
        comment: '',

        /** @type {Array<InputsError>} Error message to display */
        errors: []
    }

    /** @type {SectionActivity | null} */
    refSectionSkill = null;

    /** @type {SectionSchedule | null} */
    refSectionSchedule = null;

    /** @type {SectionComment | null} */
    refSectionComment = null;

    /** @type {MyQuest | null} */
    selectedQuest = null;

    constructor(props) {
        super(props);

        if (this.props.args?.quest) {
            /** @type {MyQuest | null} */
            const quest = this.props.args.quest || null;
            this.selectedQuest = quest;

            if (quest === null) {
                user.interface.BackHandle();
                user.interface.console.AddLog('error', 'Quest: Quest not found');
                return;
            }

            this.state = {
                action: 'remove',
                title: quest.title,
                skills: quest.skills,
                schedule: {
                    type: quest.schedule.type,
                    repeat: quest.schedule.repeat
                },
                duration: quest.schedule.duration,
                comment: quest.comment,
                errors: []
            };
        }
    }

    componentDidFocused = (args) => {
        StartMission.call(this, args?.missionName);
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

    keyboardDismiss = () => {
        Keyboard.dismiss();
        return false;
    }

    /** @returns {boolean} True if no errors */
    onEditQuest = () => {
        const newStates = {};

        const errors = user.quests.myquests.VerifyInputs({
            title: this.state.title,
            comment: this.state.comment,
            created: this.selectedQuest?.created || 0,
            schedule: {
                type: this.state.schedule.type,
                repeat: this.state.schedule.repeat,
                duration: this.state.duration
            },
            skills: this.state.skills,
            maximumStreak: 0
        });
        if (this.state.errors.join() !== errors.join()) {
            newStates.errors = errors;
        }

        if (this.selectedQuest !== null && this.state.action !== 'save') {
            newStates.action = 'save';
        }

        if (Object.keys(newStates).length > 0) {
            this.setState(newStates);
        }

        return errors.length === 0;
    }

    /** @param {string} title */
    onChangeTitle = (title) => {
        this.setState({ title }, this.onEditQuest);
    }

    /** @param {Array<number>} skills */
    onChangeSkills = (skills) => {
        this.setState({ skills }, this.onEditQuest);
    }

    /**
     * @param {RepeatModes} repeatMode
     * @param {Array<number>} repeatDays
     */
    onScheduleChange = (repeatMode, repeatDays) => {
        const schedule = { type: repeatMode, repeat: repeatDays };
        this.setState({ schedule }, this.onEditQuest);
    }

    /** @param {number} duration */
    onChangeDuration = (duration) => {
        this.setState({ duration }, this.onEditQuest);
    }

    /** @param {string} comment */
    onChangeComment = (comment) => {
        this.setState({ comment }, this.onEditQuest);
    }

    onButtonPress = () => {
        const { action } = this.state;
        switch (action) {
            case 'add': this.addOrEditQuest(false); break;
            case 'save': this.addOrEditQuest(true); break;
            case 'remove': this.removeQuest(); break;
            default:
                user.interface.console.AddLog('error', 'Quest: Unknown action');
        }
    }

    addOrEditQuest = (edit = false) => {
        const { title, skills, schedule, duration, comment } = this.state;

        if (edit && this.selectedQuest === null) {
            user.interface.console.AddLog('error', 'Quest: Selected quest is null');
            return;
        }

        if (!this.onEditQuest()) {
            return;
        }

        const addition = user.quests.myquests.AddOrEdit({
            title,
            comment: comment,
            created: edit ? this.selectedQuest.created : null,
            schedule: {
                type: schedule.type,
                repeat: schedule.repeat,
                duration: duration
            },
            skills,
            maximumStreak: 0
        });

        if (addition === 'added' || addition === 'edited') {
            // Update mission
            user.missions.SetMissionState('mission2', 'completed');

            user.GlobalSave();
            user.interface.ResetCustomBackHandler();
            user.interface.BackHandle();
        } else {
            user.interface.console.AddLog('error', 'Quest: Unknown error');
        }
    }

    removeQuest = () => {
        if (this.selectedQuest === null) {
            user.interface.console.AddLog('error', 'Quest: Selected quest is null');
            return;
        }

        const callback = (btn) => {
            if (btn === 'yes') {
                const remove = user.quests.myquests.Remove(this.selectedQuest);
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

BackQuest.defaultProps = BackQuestProps;
BackQuest.prototype.props = BackQuestProps;

export default BackQuest;

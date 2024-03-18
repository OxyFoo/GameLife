import React from 'react';
import { View, Animated, Keyboard } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Sleep } from 'Utils/Functions';
import { StartActivityNow } from 'Utils/Activities';
import { GetGlobalTime, GetTimeZone } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';
import { AskActivityComment, onRemComment } from './utils';
import { AddActivity, RemActivity, TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {'schedule' | 'now' | 'zap-gpt'} StartModes
 * @typedef {{ id: number, name: string, icon: string }} ItemCategory
 * @typedef {{ id: number, value: string, categoryID: number, onPress: () => void }} ItemSkill
 * 
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Interface/Widgets').PanelScreen} PanelScreen
 * @typedef {import('Interface/Widgets/ActivitySchedule').default} ActivitySchedule
 */

/** @type {Array<StartModes>} */
const START_MODES = ['schedule', 'now', 'zap-gpt'];

const ActivityPanelProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0,

    /** @type {boolean} */
    variantTheme: false
};

class ActivityPanelBack extends React.Component {
    state = {
        /** @type {number} */
        selectedSkillID: 0,

        /** @type {string} */
        activityText: langManager.curr['activity']['title-activity'],

        /** @type {StartModes} */
        startMode: 'schedule',

        /** @type {Animated.Value} */
        animState: new Animated.Value(0),

        /** @type {'activity' | 'skill'} */
        mode: 'activity',

        /** @type {Activity | null} Selected activity or null */
        activity: {
            skillID: 0,
            comment: '',
            duration: 60,
            startTime: GetGlobalTime(),
            timezone: GetTimeZone(),
            addedType: 'normal',
            addedTime: 0,
            friends: []
        },

        layoutHeight1: 0,
        layoutHeight2: 0,
        layoutHeight3: 0
    };

    /** @type {Activity | null} */
    __selectedActivity = null;

    __callback_removed = () => {};
    __callback_closed = () => {};

    /** @type {PanelScreen} */
    refPanelScreen = null;

    /** @type {React.RefObject<View>} */
    refPanelContent = React.createRef();

    /** @type {React.RefObject<ActivitySchedule>} */
    refActivitySchedule = React.createRef();

    indexHour = -1;
    indexMinute = -1;

    refHelp1 = null;
    refHelp3 = null;
    refHelp4 = null;

    /**
     * @param {Skill} skill
     * @returns {boolean} True if the skill is valid
     */
    SelectSkill = (skill) => {
        const { activity, selectedSkillID } = this.state;
        user.interface.SetCustomBackHandler(this.Close);

        // Skill is already selected
        if (selectedSkillID === skill.ID) {
            return false;
        }

        activity.skillID = skill.ID;
        if (skill.ID !== 168 && activity.duration > 4 * 60) {
            activity.duration = 4 * 60;
        }

        this.setState({
            mode: 'skill',
            activity: activity,
            selectedSkillID: skill.ID,
            activityText: langManager.GetText(skill.Name)
        });

        // Update digits
        this.indexHour = Math.floor(activity.duration / 60);
        this.indexMinute = (activity.duration % 60) / TIME_STEP_MINUTES;
        if (this.indexHour !== -1 && this.indexMinute !== -1) {
            this.refActivitySchedule.current.refDigitHour.current.SetDigitsIndex(this.indexHour);
            this.refActivitySchedule.current.refDigitMinute.current.SetDigitsIndex(this.indexMinute);
        }

        this.refPanelScreen.Open();
        return true;
    }

    /**
     * @param {Activity | null} activity
     * @param {() => void} callbackRemoved Callback called when the activity is removed
     * @param {() => void} callbackClosed Callback called when the panel is closed
     * @returns {boolean} True if the activity is valid
     */
    SelectActivity = (activity, callbackRemoved = () => {}, callbackClosed = () => {}) => {
        const skill = dataManager.skills.GetByID(activity?.skillID ?? 0);
        if (activity === null || skill === null) {
            console.error('SelectActivity: Invalid activity or skill', activity, skill);
            this.Close();
            return false;
        }

        user.interface.SetCustomBackHandler(this.Close);

        this.setState({
            mode: 'activity',
            selectedSkillID: skill.ID,
            activityText: langManager.GetText(skill.Name),
            activity: { ...activity }
        });

        this.__callback_removed = callbackRemoved;
        this.__callback_closed = callbackClosed;
        this.refPanelScreen.Open();
        return true;
    }

    Close = () => {
        // Skill is already deselected
        if (this.state.selectedSkillID === 0) {
            return false;
        }

        user.interface.ResetCustomBackHandler();
        this.__callback_closed();
        this.__callback_closed = () => {};

        this.refPanelScreen?.Close();
        setTimeout(() => {
            this.setState({
                selectedSkillID: 0,
                activityText: langManager.curr['activity']['title-activity']
            });
        }, 200);
        return false;
    }

    /** @param {LayoutChangeEvent} event */
    onLayout1 = (event) => {
        this.setState({ layoutHeight1: event.nativeEvent.layout.height });
    }

    /** @param {LayoutChangeEvent} event */
    onLayout2 = (event) => {
        this.setState({ layoutHeight2: event.nativeEvent.layout.height });
    }

    /** @param {LayoutChangeEvent} event */
    onLayout3 = (event) => {
        this.setState({ layoutHeight3: event.nativeEvent.layout.height });
    }

    onOpenSkill = async () => {
        const { selectedSkillID } = this.state;
        const { selectedPage } = user.interface.state;

        if (selectedPage !== 'skill') {
            this.Close();
            await Sleep(50);
            user.interface.ChangePage('skill', { skillID: selectedSkillID });
        }
    }

    /** @param {number} index */
    onChangeMode = (index) => {
        this.setState({ startMode: START_MODES[index] });
        SpringAnimation(this.state.animState, index).start();
        Keyboard.dismiss();
    }

    SetChangeSchedule(startTime, duration) {
        this.indexHour = Math.floor(duration / 60);
        this.indexMinute = (duration % 60) / TIME_STEP_MINUTES;
        this.onChangeSchedule(startTime, duration);
    }

    onChangeSchedule = (startTime, duration) => {
        const { activity } = this.state;
        if (activity === null) {
            console.error('onChangeSchedule: Invalid activity', activity);
            return;
        }

        activity.startTime = startTime;
        activity.duration = duration;

        this.setState({ activity });
    }

    onChangeStateSchedule = (opened) => {
        if (opened) {
            this.refPanelScreen.GotoY(this.props.topOffset - 100);
            this.refPanelScreen.DisableScroll();
        } else {
            this.refPanelScreen.EnableScroll();
        }
    }

    onEditComment = async () => {
        const { activity, mode } = this.state;
        const comment = await AskActivityComment(activity);

        if (comment === null) {
            return;
        }

        activity.comment = comment;
        this.setState({ activity }, () => {
            if (mode === 'activity') {
                AddActivity(activity);
            }
            // TODO: Hide empty space under panel after comment edition
            this.refPanelScreen?.RefreshPosition();
        });
    }
    onRemComment = () => {
        onRemComment(() => {
            const { activity, mode } = this.state;
            activity.comment = '';

            this.setState({ activity }, () => {
                if (mode === 'activity') {
                    AddActivity(activity);
                }
                // TODO: Hide empty space under panel after comment edition
                this.refPanelScreen.RefreshPosition();
            });
        });
    }

    onAddActivity = () => {
        const { activity } = this.state;
        const added = AddActivity(activity);
        if (added) {
            this.Close();
        }
    }

    onStartNow = () => StartActivityNow(this.state.selectedSkillID);

    onRemoveActivity = () => {
        RemActivity(() => {
            this.Close();
            user.activities.Remove(this.state.activity);
            user.GlobalSave();
            this.__callback_removed();
        });
    }
}

ActivityPanelBack.prototype.props = ActivityPanelProps;
ActivityPanelBack.defaultProps = ActivityPanelProps;

export { START_MODES };
export default ActivityPanelBack;

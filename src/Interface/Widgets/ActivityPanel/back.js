import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { GetTime, GetTimeZone } from 'Utils/Time';
import { SpringAnimation } from 'Utils/Animations';
import { AskActivityComment, onRemComment } from './utils';
import { AddActivity, RemActivity, TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {{ id: number, name: string, icon: string }} ItemCategory
 * @typedef {{ id: number, value: string, categoryID: number, onPress: () => void }} ItemSkill
 * 
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Interface/Widgets').PanelScreen} PanelScreen
 * @typedef {import('Interface/Widgets/ActivitySchedule').default} ActivitySchedule
 */

const ActivityPanelProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} Render after delay in ms */
    delay: 0,

    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0,

    /** @type {boolean} */
    variantTheme: false
}

class ActivityPanelBack extends React.Component {
    state = {
        /** @type {boolean} Enable render after the first layout */
        loaded: false,

        /** @type {number} */
        selectedSkillID: 0,

        /** @type {string} */
        activityText: langManager.curr['activity']['title-activity'],

        /** @type {'schedule'|'now'} */
        startMode: 'schedule',

        /** @type {Animated.Value} */
        animButtonNow: new Animated.Value(0),

        /** @type {'activity'|'skill'} */
        mode: 'activity',

        /** @type {Activity|null} Selected activity or null */
        activity: {
            skillID: 0,
            comment: '',
            duration: 60,
            startTime: GetTime(),
            timezone: GetTimeZone(),
            startNow: false
        }
    };

    /** @type {Activity|null} */
    __selectedActivity = null;

    __callback_removed = () => { };
    __callback_closed = () => { };

    /** @type {PanelScreen} */
    refPanelScreen = null;

    /** @type {React.RefObject<ActivitySchedule>} */
    refActivitySchedule = React.createRef();

    indexHour = -1;
    indexMinute = -1;

    refHelp1 = null;
    refHelp3 = null;
    refHelp4 = null;

    /**
     * @param {ActivityPanelProps} props
     */
    constructor(props) {
        super(props);

        if (props.delay <= 0) {
            this.state.loaded = true;
        }
    }

    componentDidMount() {
        const { delay } = this.props;

        if (delay > 0) {
            const enableRender = () => this.setState({ loaded: true });
            setTimeout(enableRender, delay);
        }
    }

    /**
     * @param {Skill} skill
     * @returns {boolean} True if the skill is valid
     */
    SelectSkill = (skill) => {
        const { activity, selectedSkillID } = this.state;

        // Skill is already selected
        if (selectedSkillID === skill.ID) {
            return false;
        }

        activity.skillID = skill.ID;

        this.setState({
            mode: 'skill',
            activity: activity,
            selectedSkillID: skill.ID,
            activityText: dataManager.GetText(skill.Name)
        });

        // Update digits
        if (this.indexHour !== -1 && this.indexMinute !== -1) {
            this.refActivitySchedule.current.refDigitHour.current.SetDigitsIndex(this.indexHour);
            this.refActivitySchedule.current.refDigitMinute.current.SetDigitsIndex(this.indexMinute);
        }

        this.refPanelScreen.Open();
        return true;
    }

    /**
     * @param {Activity|null} activity
     * @param {() => void} callbackRemoved Callback called when the activity is removed
     * @param {() => void} callbackClosed Callback called when the panel is closed
     * @returns {boolean} True if the activity is valid
     */
    SelectActivity = (activity, callbackRemoved = () => { }, callbackClosed = () => { }) => {
        const skill = dataManager.skills.GetByID(activity?.skillID ?? 0);
        if (activity === null || skill === null) {
            console.error('SelectActivity: Invalid activity or skill', activity, skill);
            this.Close();
            return false;
        }

        this.setState({
            mode: 'activity',
            selectedSkillID: skill.ID,
            activityText: dataManager.GetText(skill.Name),
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
            return;
        }

        this.__callback_closed();
        this.__callback_closed = () => { };

        this.refPanelScreen.Close();
        setTimeout(() => {
            this.setState({
                selectedSkillID: 0,
                activityText: langManager.curr['activity']['title-activity']
            });
        }, 200);
    }

    onChangeMode = (index) => {
        const modes = ['schedule', 'now'];
        this.setState({ startMode: modes[index] });
        SpringAnimation(this.state.animButtonNow, index).start();
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
            this.refPanelScreen.RefreshPosition();
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
        AddActivity(activity);
    }

    onRemoveActivity = () => {
        RemActivity(() => {
            this.Close();
            user.activities.Remove(this.state.activity);
            user.GlobalSave();
            this.__callback_removed();
        });
    }

    onOpenSkill = () => {
        user.interface.ChangePage(
            'skill',
            { skillID: this.state.selectedSkillID }
        );
    }
}

ActivityPanelBack.prototype.props = ActivityPanelProps;
ActivityPanelBack.defaultProps = ActivityPanelProps;

export default ActivityPanelBack;
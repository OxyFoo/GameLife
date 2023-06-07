import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { SkillToItem } from './types';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('../back').ItemSkill} ItemSkill
 * @typedef {import('Interface/Widgets').PanelScreen} PanelScreen
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const ActivityPanelProps = {
    /** @type {number} Render after delay in ms */
    delay: 0,

    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0,

    /** @type {boolean} Edition enabled */
    editMode: false
}

class ActivityPanelBack extends React.Component {
    state = {
        /** @type {boolean} Enable render after the first layout */
        loaded: false,

        /** @type {ItemSkill} */
        selectedSkill: SkillToItem(),

        /** @type {string} */
        activityText: langManager.curr['activity']['title-activity'],

        /** @type {'schedule'|'now'} */
        startMode: 'schedule',

        animButtonNow: new Animated.Value(0),

        /** @type {string} */
        comment: '',

        /** @type {number} Unix timestamp or null */
        activityStart: 0,

        /** @type {number} Duration in minutes */
        activityDuration: 15
    };

    /** @type {PanelScreen} */
    refPanelScreen = null;

    /**
     * @param {ActivityPanelProps} props
     */
    constructor(props) {
        super(props);

        if (props.editMode || props.delay <= 0) {
            this.state.loaded = true;
        }
    }

    componentDidMount() {
        const { editMode, delay } = this.props;

        if (!editMode && delay > 0) {
            const enableRender = () => this.setState({ loaded: true });
            setTimeout(enableRender, delay);
        }
    }

    /**
     * @param {Skill} skill
     * @returns {boolean} True if the skill is valid
     */
    SelectSkill = (skill) => {
        // Skill is already selected
        if (this.state.selectedSkill.id === skill.ID) {
            return false;
        }

        this.setState({
            selectedSkill: SkillToItem(skill, this.SelectSkill),
            activityText: dataManager.GetText(skill.Name)
        });

        this.refPanelScreen.Open();
        return true;
    }

    /**
     * @param {Activity|null} activity
     * @returns {boolean} True if the activity is valid
     */
    SelectActivity = (activity) => {
        const skill = dataManager.skills.GetByID(activity.skillID);
        if (activity === null || skill === null) {
            console.error('SelectActivity: Invalid activity or skill', activity, skill);
            this.Close();
            return false;
        }

        this.setState({
            selectedSkill: SkillToItem(skill, this.SelectSkill),
            activityText: dataManager.GetText(skill.Name),
            comment: activity.comment || '',
            activityStart: activity.startTime,
            activityDuration: activity.duration
        });

        this.refPanelScreen.Open();
        return true;
    }

    Close = () => {
        // Page is render only for activity edition, so we can go back
        if (this.props.editMode) {
            user.interface.BackPage();
            return;
        }

        // Skill is already deselected
        if (this.state.selectedSkill.id === 0) {
            return;
        }

        this.refPanelScreen.Close();
        setTimeout(() => {
            this.setState({
                selectedSkill: SkillToItem(null),
                activityText: langManager.curr['activity']['title-activity']
            });
        }, 200);
    }

    onChangeMode = (index) => {
        const modes = [ 'schedule', 'now' ];
        this.setState({ startMode: modes[index] });
        SpringAnimation(this.state.animButtonNow, index).start();
    }

    onChangeSchedule = (startTime, duration) => {
        this.setState({
            activityStart: startTime,
            activityDuration: duration
        });
    }

    onChangeStateSchedule = (opened) => {
        if (opened) {
            this.refPanelScreen.GotoY(this.props.topOffset - 100);
            this.refPanelScreen.DisableScroll();
        } else {
            this.refPanelScreen.EnableScroll();
        }
    }
}

ActivityPanelBack.prototype.props = ActivityPanelProps;
ActivityPanelBack.defaultProps = ActivityPanelProps;

export default ActivityPanelBack;
import React from 'react';
import { Animated } from 'react-native';

import langManager from '../../../../Managers/LangManager';
import dataManager from '../../../../Managers/DataManager';

import { SkillToItem } from './types';
import { SpringAnimation } from '../../../../Utils/Animations';

/**
 * @typedef {import('../back').ItemSkill} ItemSkill
 * @typedef {import('../../../../Data/Skills').Skill} Skill
 * @typedef {import('../../../../Class/Activities').Activity} Activity
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const ActivityPanelProps = {
    /** @type {number} Top distance of the panel when it's opened */
    topOffset: 0
}

class ActivityPanelBack extends React.Component {
    state = {
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

    /** @type {import('../../../Widgets').PanelScreen} */
    refPanelScreen = null;

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
     * @param {Activity} activity
     * @returns {boolean} True if the activity is valid
     */
    SelectActivity = (activity) => {
        const skill = dataManager.skills.GetByID(activity.SkillID);
        if (activity === null || skill === null) {
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

    getCategoryName = () => {
        const checkCategory = cat => cat.id === this.selectedCategory;
        const category = this.categories.find(checkCategory) || null;

        if (category !== null)
            return category.name;
        return langManager.curr['activity']['input-activity'];
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
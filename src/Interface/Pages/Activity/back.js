import React from 'react';
import { Animated, FlatList } from 'react-native';

import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';
import themeManager from '../../../Managers/ThemeManager';

import { PageBack } from '../../Components';
import { CategoryToItem, SkillToItem } from './Components/types';
import { GetTime } from '../../../Utils/Time';
import { SpringAnimation } from '../../../Utils/Animations';
import Notifications from '../../../Utils/Notifications';

/**
 * @typedef {import('../../../Class/Activities').Activity} Activity
 * @typedef {import('../../../Data/Skills').Category} Category
 * @typedef {import('../../../Data/Skills').Skill} Skill
 * @typedef {import('./Components/activityPanel').default} ActivityPanel
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * 
 * @typedef {{ id: number, value: string, onPress: () => {} }} ItemSkill
 * @typedef {{ id: number, name: string, icon: string }} ItemCategory
 */

class BackActivity extends PageBack {
    state = {
        /** @type {LayoutRectangle|null} */
        layoutActivities: null,

        /** @type {Array<ItemSkill>} */
        skills: [],

        /** @type {number|null} */
        selectedCategory: null,

        /** @type {string} */
        skillSearch: ''
    };

    /** @type {Array<ItemSkill>} */
    allSkillItems = [];

    /** @type {ActivityPanel} */
    refPanel = React.createRef();

    /** @type {React.RefObject<FlatList>} */
    refActivities = React.createRef();

    /** @type {Array<ItemCategory>} */
    categories = [];

    /** @type {boolean} If true, the page is in edition mode */
    editMode = false;

    /** @type {Array<number>} [StartTime, Duration] */
    initialSchedule = [ null, null ];

    backgroundCard = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };

    constructor(props) {
        super(props);

        // Check if the page is in edition mode
        this.editMode = this.props.args.hasOwnProperty('activity');

        // TODO: Enable this feature ?
        //if (user.tempSelectedTime !== null) {
        //    this.initialSchedule = [ user.tempSelectedTime, 15 ];
        //}

        // Get categories and skills
        const { categories, skills } = dataManager.skills;

        const convert = (skill) => SkillToItem(skill, this.refPanel.SelectSkill);
        this.state.skills = skills.map(convert);
        this.allSkillItems = this.state.skills;

        this.categories = categories.map(CategoryToItem);
        if (categories.length % 6 !== 0) {
            const emptyCount = 6 - (categories.length % 6);
            this.categories.push(...Array(emptyCount).fill(0));
        }

        // Set default values to open the page with a skill selected
        if (this.props.args.hasOwnProperty('skillID')) {
            const { skillID } = this.props.args;
            const skill = dataManager.skills.GetByID(skillID);
            this.state.selectedSkill = { id: skillID, value: dataManager.GetText(skill.Name) };
        }

        // Set default values to edit an activity
        else if (this.editMode) {
            /** @type {Activity} */
            const activity = this.props.args.activity;

            this.initialSchedule = [ activity.startTime, activity.duration ];

            const skill = dataManager.skills.GetByID(activity.skillID);
            this.state.selectedCategory = skill?.CategoryID || null;
            this.state.selectedSkill = { id: activity.skillID, value: dataManager.GetText(skill.Name) };

            // TODO: Load comment, activityStart, activityDuration
            //this.state.comment = activity.comment || '';
            //this.state.activityStart = activity.startTime;
            //this.state.activityDuration = activity.duration;
        }
    }

    componentDidMount() {
        // TODO: Open at start => Props ? Ref function ?
        // Add function: SetSkill & SetActivity
        //const isSetSkillID = this.props.args.hasOwnProperty('skillID');
        //if (isSetSkillID) {
        //    SpringAnimation(this.state.animPosY, 1).start();
        //}
    }

    /** @param {LayoutRectangle} event */
    onLayoutActivities = (event) => {
        this.setState({ layoutActivities: event.nativeEvent.layout });
    }

    /** @param {string} text */
    onSearchChange = (text) => {
        if (text.length > 0) {
            const searchMatch = (skill) => skill.value.toLowerCase().includes(text.toLowerCase());
            const skills = this.allSkillItems.filter(searchMatch);
            this.setState({ skillSearch: text, skills: skills });
        } else {
            this.setState({ skillSearch: text, skills: this.allSkillItems });
        }
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
    }

    selectCategory = (ID, checked) => {
        const filter = skill => !checked || skill.CategoryID === ID;
        const convert = (skill) => SkillToItem(skill, this.refPanel?.SelectSkill);
        const skills = dataManager.skills.skills.filter(filter).map(convert);

        this.allSkillItems = skills;
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
        this.setState({ selectedCategory: checked ? ID : null, skills });
        this.refPanel.Close();
    }
}

export default BackActivity;
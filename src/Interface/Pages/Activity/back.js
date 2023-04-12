import React from 'react';
import { FlatList } from 'react-native';

import dataManager from '../../../Managers/DataManager';
import themeManager from '../../../Managers/ThemeManager';

import { PageBack } from '../../Components';
import { CategoryToItem, SkillToItem } from './Components/types';

/**
 * @typedef {import('./Components/types').ItemSkill} ItemSkill
 * @typedef {import('./Components/types').ItemCategory} ItemCategory
 * @typedef {import('../../../Class/Activities').Activity} Activity
 * @typedef {import('./Components/activityPanel').default} ActivityPanel
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

class BackActivity extends PageBack {
    state = {
        /** @type {number} */
        topPanelOffset: 0,

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
    refActivityPanel = React.createRef();

    /** @type {React.RefObject<FlatList>} */
    refActivities = React.createRef();

    /** @type {Array<ItemCategory>} */
    categories = [];

    /** @type {boolean} If true, the page is in edition mode */
    editMode = false;

    backgroundCard = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };

    constructor(props) {
        super(props);

        // Check if the page is in edition mode
        this.editMode = this.props.args.hasOwnProperty('activity');

        // Get categories and skills
        const { categories } = dataManager.skills;

        this.categories = categories.map(CategoryToItem);
        if (categories.length % 6 !== 0) {
            const emptyCount = 6 - (categories.length % 6);
            this.categories.push(...Array(emptyCount).fill(0));
        }

        // Set default values to edit an activity
        else if (this.editMode) {
            /** @type {Activity} */
            const activity = this.props.args.activity;

            const skill = dataManager.skills.GetByID(activity.skillID);
            this.state.selectedCategory = skill?.CategoryID || null;
        }
    }

    componentDidMount() {
        const { skills } = dataManager.skills;

        // Define all skills
        const convert = (skill) => SkillToItem(skill, this.refActivityPanel.SelectSkill);
        this.allSkillItems = skills.map(convert);
        this.setState({ skills: this.allSkillItems });

        // Set default values to open the page with a skill selected
        if (this.props.args.hasOwnProperty('skillID')) {
            const { skillID } = this.props.args;
            const skill = dataManager.skills.GetByID(skillID);
            this.refActivityPanel.SelectSkill(skill);
        }

        // Set default values to edit an activity
        else if (this.editMode) {
            /** @type {Activity} */
            const activity = this.props.args.activity;
            this.refActivityPanel.SelectActivity(activity);
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutCategories = (event) => {
        const { y, height } = event.nativeEvent.layout;
        this.setState({ topPanelOffset: y + height });
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
        const convert = (skill) => SkillToItem(skill, this.refActivityPanel?.SelectSkill);
        const skills = dataManager.skills.skills.filter(filter).map(convert);

        this.allSkillItems = skills;
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
        this.setState({ selectedCategory: checked ? ID : null, skills });
        this.refActivityPanel.Close();
    }
}

export default BackActivity;
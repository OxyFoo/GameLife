import React from 'react';
import { FlatList } from 'react-native';

import StartMission from './mission';
import { GetRecentSkills, CategoryToItem, SkillToItem } from './types';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { Sleep } from 'Utils/Functions';
import { FormatForSearch } from 'Utils/String';
import { GetLocalTime, RoundTimeTo } from 'Utils/Time';
import { MIN_TIME_MINUTES, MAX_TIME_MINUTES, TIME_STEP_MINUTES } from 'Utils/Activities';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('./types').ItemSkill} ItemSkill
 * @typedef {import('./types').EnrichedSkill} EnrichedSkill
 * @typedef {import('./types').ItemCategory} ItemCategory
 *
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Widgets').ActivityPanel} ActivityPanel
 *
 * @typedef {Object} BackActivityPropsType
 * @property {Object} [args]
 * @property {number | null} [args.categoryID]
 * @property {number | null} [args.skillID]
 * @property {number | null} [args.time]
 * @property {Array<number>} [args.skills]
 */

/** @type {BackActivityPropsType} */
const BackActivityProps = {
    args: {
        categoryID: undefined,
        skillID: undefined,
        time: undefined,
        skills: []
    }
};

class BackActivity extends React.Component {
    state = {
        /** @type {number} */
        topPanelOffset: 0,

        /** @type {Array<ItemSkill>} */
        skills: [],

        /** @type {number | null} */
        selectedCategory: null,

        /** @type {string} Search input */
        skillSearch: '',

        /** @type {string} Header of input - Name of category */
        inputText: ''
    };

    refTuto1 = null;

    /** @type {ActivityPanel | null} */
    refActivityPanel = null;

    /** @type {FlatList | null} */
    refActivities = null;

    categoriesNames = dataManager.skills.categories.map((category) => langManager.GetText(category.Name));

    /** @type {Array<number>} Defined with props args 'skills' (disable categories) */
    preselectedSkillsIDs = [];

    /** @type {Array<ItemSkill>} All skills converted to ItemSkill used as source for the FlatList */
    allSkillsItems = [];

    /** @type {Array<ItemSkill>} Recent skills converted to ItemSkill used as source */
    allRecentSkillsItems = [];

    /** @type {Array<ItemCategory | null>} All categories converted to ItemCategory used as source for the FlatList */
    allCategoriesItems = [];

    constructor(props) {
        super(props);

        // Define all categories
        this.allCategoriesItems = dataManager.skills.categories.map(CategoryToItem);

        // Define all skills
        this.allSkillsItems = dataManager.skills.Get().map((skill) => SkillToItem(skill, this.selectSkill));

        // Get recent skills
        this.allRecentSkillsItems = GetRecentSkills(this.selectSkill);

        this.state.skills = this.allSkillsItems;
        this.state.inputText = langManager.curr['activity']['input-activity'];

        // Preselected skills
        if (this.props.args.hasOwnProperty('skills')) {
            if (this.props.args.skills.length > 0) {
                this.preselectedSkillsIDs = this.props.args.skills;
                this.state.skills = this.allSkillsItems.filter((skill) => this.preselectedSkillsIDs.includes(skill.id));
            }
        }

        // Set default to recent if there is more than 5 skills
        if (this.allRecentSkillsItems.length > 5 && this.preselectedSkillsIDs.length === 0) {
            this.state.selectedCategory = 0;
        }

        // Select default category
        if (this.props.args.hasOwnProperty('categoryID')) {
            const { categoryID } = this.props.args;
            this.state.selectedCategory = categoryID;
        }

        // Update state
        this.state = {
            ...this.state,
            ...this.refreshSkills(this.state.skillSearch, this.state.selectedCategory, false)
        };
    }

    async componentDidMount() {
        // Wait for the layout to be calculated
        while (this.state.topPanelOffset === 0) {
            await Sleep(100);
        }

        // Set default values to open the page with a skill selected
        if (this.props.args.hasOwnProperty('skillID')) {
            const { skillID } = this.props.args;
            const skill = dataManager.skills.GetByID(skillID);
            if (skill !== null) {
                this.refActivityPanel?.SelectSkill(skill);
            }
        }

        // If default skills is defined and contains only one skill
        if (this.preselectedSkillsIDs.length === 1) {
            const skill = dataManager.skills.GetByID(this.preselectedSkillsIDs[0]);
            if (skill !== null) {
                this.refActivityPanel?.SelectSkill(skill);
            }
        }

        //const fromCalendar = user.interface.history.at(-1)[0] === 'calendar';

        // Set default time (UTC) to add an activity
        if (this.props.args.hasOwnProperty('time')) {
            const { time } = this.props.args;
            const activities = user.activities.GetByTime(time).filter((activity) => activity.startTime > time);

            let duration = 60;
            if (activities.length > 0) {
                const delta = activities[0].startTime - time;
                if (delta <= MAX_TIME_MINUTES * 60) {
                    duration = RoundTimeTo(TIME_STEP_MINUTES, delta) / 60;
                    duration = Math.max(MIN_TIME_MINUTES, duration);
                }
            }
            this.refActivityPanel?.SetChangeSchedule(time, duration);
        }

        // User from calendar
        else if (false && user.tempSelectedTime !== null /* && fromCalendar*/) {
            //this.refActivityPanel?.SetChangeSchedule(user.tempSelectedTime, 60);
        }

        // Default time (local) to add an activity
        else {
            const time = GetLocalTime();
            const activities = user.activities.GetByTime(time).filter((activity) => activity.startTime > time);

            let duration = 60;
            if (activities.length > 0) {
                const delta = activities[0].startTime - time;
                if (delta <= MAX_TIME_MINUTES * 60) {
                    duration = RoundTimeTo(TIME_STEP_MINUTES, delta) / 60;
                    duration = Math.max(MIN_TIME_MINUTES, duration);
                }
            }

            this.refActivityPanel?.SetChangeSchedule(RoundTimeTo(TIME_STEP_MINUTES, time), duration);
        }
    }

    componentDidFocused = (args) => {
        StartMission.call(this, args?.missionName);
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutCategories = (event) => {
        const { y, height } = event.nativeEvent.layout;
        this.setState({ topPanelOffset: y + height });
    };

    /**
     * @param {string} textSearch
     * @param {number | null} categoryID
     * @returns {object}
     */
    refreshSkills = (textSearch = '', categoryID = null, refreshState = true) => {
        const formattedSearch = FormatForSearch(textSearch);

        /** @param {ItemSkill} skill */
        const filter = (skill) => !categoryID || skill.categoryID === categoryID;
        /** @param {ItemSkill} skill */
        const filterPreselected = (skill) =>
            this.preselectedSkillsIDs.length === 0 || this.preselectedSkillsIDs.includes(skill.id);
        /** @param {ItemSkill} skill */
        const searchMatch = (skill) => FormatForSearch(skill.value).includes(formattedSearch);

        /** @type {ItemSkill[]} */
        let itemSkills = [];

        // Recent skills
        if (categoryID === 0) {
            itemSkills = this.allRecentSkillsItems.filter(searchMatch).slice(0, 10);
        }

        // Get skills by category
        else {
            itemSkills = this.allSkillsItems.filter(filter).filter(filterPreselected).filter(searchMatch);
        }

        let inputText = langManager.curr['activity']['input-activity'];
        if (categoryID !== null) {
            const category = dataManager.skills.GetCategoryByID(categoryID);
            inputText = langManager.GetText(category?.Name) || inputText;
        }

        const newState = {
            inputText,
            skills: itemSkills,
            skillSearch: textSearch,
            selectedCategory: categoryID
        };

        if (refreshState) {
            this.setState(newState);
        }

        return newState;
    };

    /** @param {string} text */
    onSearchChange = (text) => {
        this.refreshSkills(text, null);
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
    };

    /**
     * @param {number} ID
     * @param {boolean} checked
     */
    selectCategory = (ID, checked) => {
        this.refreshSkills(this.state.skillSearch, checked ? ID : null);
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
        this.refActivityPanel?.Close();
    };

    /**
     * @param {Skill} skill
     */
    selectSkill = (skill) => {
        StartMission.call(this, this.props.args?.missionName, true);
        this.refActivityPanel?.SelectSkill(skill);
    };
}

BackActivity.defaultProps = BackActivityProps;
BackActivity.prototype.props = BackActivityProps;

export default BackActivity;

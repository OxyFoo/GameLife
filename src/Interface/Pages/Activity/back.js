import { FlatList } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { GetTime } from 'Utils/Time';
import { Sleep } from 'Utils/Functions';
import { PageBack } from 'Interface/Components';
import { CategoryToItem, SkillToItem } from './types';

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
 */

class BackActivity extends PageBack {
    state = {
        /** @type {number} */
        topPanelOffset: 0,

        /** @type {Array<ItemSkill>} */
        skills: [],

        /** @type {number|null} */
        selectedCategory: null,

        /** @type {string} Search input */
        skillSearch: '',

        /** @type {string} Header of input - Name of category */
        inputText: ''
    };

    refTuto1 = null;

    /** @type {Array<ItemSkill>} */
    allSkillItems = [];

    /** @type {ActivityPanel|null} */
    refActivityPanel = null;

    /** @type {FlatList|null} */
    refActivities = null;

    /** @type {Array<ItemCategory|null>} */
    categories = [];

    /** @type {boolean} If true, the page is in edition mode */
    editMode = false;

    /** @type {number} */
    initTime = 0;

    backgroundCard = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };

    constructor(props) {
        super(props);

        // Check if the page is in edition mode
        this.editMode = this.props.args.hasOwnProperty('activity');
        this.categories = dataManager.skills.categories.map(CategoryToItem);

        // Define all skills
        if (!this.editMode) {
            const skills = dataManager.skills.Get();
            const convert = (skill) => SkillToItem(skill, this.selectSkill);

            this.allSkillItems = skills.map(convert);
            this.state.skills = this.allSkillItems;
            this.state.inputText = langManager.curr['activity']['input-activity'];
        }

        // Set default values to edit an activity
        if (this.editMode) {
            /** @type {Activity} */
            const activity = this.props.args.activity;

            const skill = dataManager.skills.GetByID(activity.skillID);
            this.state.selectedCategory = skill?.CategoryID || null;
        }
    }

    async componentDidMount() {
        super.componentDidMount();

        // Wait for the layout to be calculated
        while (this.state.topPanelOffset === 0 || !this.refActivityPanel?.state.loaded) {
            await Sleep(100);
        }

        // Set default values to open the page with a skill selected
        if (this.props.args.hasOwnProperty('skillID')) {
            const { skillID } = this.props.args;
            const skill = dataManager.skills.GetByID(skillID);
            if (skill !== null) {
                this.refActivityPanel.SelectSkill(skill);
                this.refreshSkills(this.state.skillSearch, skill.CategoryID);
            }
        }

        else if (this.props.args.hasOwnProperty('categoryID')) {
            const { categoryID } = this.props.args;
            this.refreshSkills(this.state.skillSearch, categoryID);
        }

        // Set default values to edit an activity
        else if (this.editMode) {
            /** @type {Activity} */
            const activity = this.props.args.activity;
            this.refActivityPanel.SelectActivity(activity);
        }

        // Set default time (UTC) to add an activity
        if (this.props.args.hasOwnProperty('time')) {
            const { time } = this.props.args;
            this.refActivityPanel.onChangeSchedule(time, 60);
        } else if (user.tempSelectedTime !== null) {
            this.refActivityPanel.onChangeSchedule(user.tempSelectedTime, 60);
        }

    }

    /** @param {LayoutChangeEvent} event */
    onLayoutCategories = (event) => {
        const { y, height } = event.nativeEvent.layout;
        this.setState({ topPanelOffset: y + height });
    }

    /**
     * @param {string} textSearch
     * @param {number|null} categoryID
     */
    refreshSkills = (textSearch = '', categoryID = null) => {
        /**
         * @param {Skill|EnrichedSkill} skill
         * @returns {ItemSkill}
         */
        const convert = (skill) => SkillToItem(skill, this.selectSkill);
        /** @param {ItemSkill} skill */
        const filter = skill => !categoryID || skill.categoryID === categoryID;
        /** @param {ItemSkill} skill */
        const searchMatch = skill => skill.value.toLowerCase().includes(textSearch.toLowerCase());

        /** @type {ItemSkill[]} */
        let itemSkills = [];

        // Recent skills
        if (categoryID === 0) {
            let skills = [];
            const now = GetTime(undefined, 'local');
            const usersActivities = user.activities.Get()
                .filter(activity => activity.startTime <= now)
                .sort((a, b) => b.startTime - a.startTime);
            for (const activity of usersActivities) {
                const skill = dataManager.skills.GetByID(activity.skillID);
                if (skill !== null && !skills.find(s => s.ID === skill.ID)) {
                    skills.push(skill);
                }
            }
            itemSkills = skills
                .slice(0, 10)
                .map(convert)
                .filter(searchMatch);
        }

        // Get skills by category
        else {
            itemSkills = this.allSkillItems
                .filter(filter)
                .filter(searchMatch);
        }

        let inputText = langManager.curr['activity']['input-activity'];
        if (categoryID !== null) {
            const category = dataManager.skills.GetCategoryByID(categoryID);
            inputText = dataManager.GetText(category?.Name) || inputText;
        }

        this.setState({
            skills: itemSkills, inputText,
            skillSearch: textSearch,
            selectedCategory: categoryID,
        });
    }

    /** @param {string} text */
    onSearchChange = (text) => {
        this.refreshSkills(text, this.state.selectedCategory);
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
    }

    /**
     * @param {number} ID
     * @param {boolean} checked
     */
    selectCategory = (ID, checked) => {
        this.refreshSkills(this.state.skillSearch, checked ? ID : null);
        this.refActivities.scrollToOffset({ offset: 0, animated: false });
        this.refActivityPanel.Close();
    }

    /**
     * @param {Skill} skill
     */
    selectSkill = (skill) => {
        this.refreshSkills(this.state.skillSearch, skill.CategoryID);
        this.refActivityPanel.SelectSkill(skill);
    }
}

export default BackActivity;
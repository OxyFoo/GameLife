import { FlatList } from 'react-native';

import dataManager from '../../../Managers/DataManager';
import langManager from '../../../Managers/LangManager';
import themeManager from '../../../Managers/ThemeManager';

import { Sleep } from '../../../Utils/Functions';
import { PageBack } from '../../Components';
import { CategoryToItem, SkillToItem } from './Components/types';

/**
 * @typedef {import('../../../Data/Skills').Skill} Skill
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

        /** @type {string} Search input */
        skillSearch: '',

        /** @type {string} Header of input - Name of category */
        inputText: ''
    };

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
            this.categories.push(...Array(emptyCount).fill(null));
        }

        // Define all skills
        if (!this.editMode) {
            const { skills } = dataManager.skills;
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
        // Wait for the layout to be calculated
        while (this.state.topPanelOffset === 0 || !this.refActivityPanel.state.loaded) {
            await Sleep(100);
        }

        // Set default values to open the page with a skill selected
        if (this.props.args.hasOwnProperty('skillID')) {
            const { skillID } = this.props.args;
            const skill = dataManager.skills.GetByID(skillID);
            this.refActivityPanel.SelectSkill(skill);
            this.refreshSkills(this.state.skillSearch, skill.CategoryID);
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

    /**
     * @param {string} textSearch
     * @param {number|null} categoryID
     */
    refreshSkills = (textSearch = '', categoryID = null) => {
        /** @param {ItemSkill} skill */
        const filter = skill => !categoryID || skill.categoryID === categoryID;
        /** @param {ItemSkill} skill */
        const searchMatch = skill => skill.value.toLowerCase().includes(textSearch.toLowerCase());

        const skills = this.allSkillItems
            .filter(filter)
            .filter(searchMatch);

        let inputText = langManager.curr['activity']['input-activity'];
        if (categoryID !== null) {
            const category = dataManager.skills.GetCategoryByID(categoryID);
            inputText = dataManager.GetText(category?.Name) || inputText;
        }

        this.setState({
            skills, inputText,
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
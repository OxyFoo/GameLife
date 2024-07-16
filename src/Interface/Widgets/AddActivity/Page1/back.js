import React from 'react';
import { Animated } from 'react-native';

import { GetRecentSkills, CategoryToItem, SkillToItem } from '../types';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Activity } from 'Class/Activities';
import { FormatForSearch } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').FlatList} FlatList
 *
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Interface/Components/InputText/Thin').InputTextThin} InputTextThin
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 *
 * @typedef {Object} BackActivityPage1PropsType
 * @prop {Activity} activity
 * @prop {(newActivity: Activity) => Promise<void>} changeActivity
 * @prop {() => void} unSelectActivity
 * @prop {number | null} categoryID
 * @prop {Array<number>} listSkillsIDs
 */

/** @type {BackActivityPage1PropsType} */
const BackActivityPage1Props = {
    activity: new Activity(),
    changeActivity: async () => {},
    unSelectActivity: () => {},

    categoryID: null,
    listSkillsIDs: []
};

class BackActivityPage1 extends React.Component {
    state = {
        /** @type {Array<ItemSkill>} */
        skills: [],

        /** @type {number | null} */
        selectedCategory: null,

        searchEnabled: false,
        skillSearch: '',
        animSearch: new Animated.Value(0),

        /** @type {string} Header of input - Name of category */
        inputText: ''
    };

    /** @type {React.RefObject<FlatList>} */
    refActivities = React.createRef();

    /** @type {React.RefObject<InputTextThin>} */
    refSearchInput = React.createRef();

    categoriesNames = dataManager.skills.categories.map((category) => langManager.GetText(category.Name));

    /** @type {Array<number>} Defined with props 'listSkillsIDs' (disable categories) */
    preselectedSkillsIDs = [];

    /** @type {Array<ItemSkill>} All skills converted to ItemSkill used as source for the FlatList */
    allSkillsItems = [];

    /** @type {Array<ItemSkill>} Recent skills converted to ItemSkill used as source */
    allRecentSkillsItems = [];

    /** @type {Array<ItemCategory | null>} All categories converted to ItemCategory used as source for the FlatList */
    allCategoriesItems = [];

    /** @param {BackActivityPage1PropsType} props */
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
        if (props.listSkillsIDs.length > 0) {
            this.preselectedSkillsIDs = props.listSkillsIDs;
            this.state.skills = this.allSkillsItems.filter((skill) => this.preselectedSkillsIDs.includes(skill.id));
        }

        // Set default to recent if there is more than 5 skills
        if (this.allRecentSkillsItems.length > 5 && this.preselectedSkillsIDs.length === 0) {
            this.state.selectedCategory = 0;
        }

        // Select default category
        if (props.categoryID !== null) {
            this.state.selectedCategory = props.categoryID;
        }

        // Update state
        this.state = {
            ...this.state,
            ...this.refreshSkills(this.state.skillSearch, this.state.selectedCategory, false)
        };
    }

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
            if (category !== null) {
                inputText = langManager.GetText(category.Name);
            }
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

    openSearch = () => {
        this.refSearchInput.current?.refInput.current?.focus();
        this.setState({ searchEnabled: true });
        SpringAnimation(this.state.animSearch, 1).start();
        this.refreshSkills('', null);
    };

    closeSearch = () => {
        this.refSearchInput.current?.refInput.current?.blur();
        this.setState({ searchEnabled: false, skillSearch: '' });
        SpringAnimation(this.state.animSearch, 0).start();
        this.refreshSkills('', this.state.selectedCategory);
    };

    /** @param {string} text */
    onSearchChange = (text) => {
        this.refreshSkills(text, this.state.selectedCategory);
        this.refActivities.current?.scrollToOffset({ offset: 0, animated: false });
    };

    /**
     * @param {number} ID
     * @param {boolean} checked
     */
    selectCategory = (ID, checked) => {
        this.refreshSkills(this.state.skillSearch, checked ? ID : null);
        this.refActivities.current?.scrollToOffset({ offset: 0, animated: false });
    };

    /**
     * @param {Skill} skill
     */
    selectSkill = (skill) => {
        const { activity, changeActivity } = this.props;
        changeActivity({
            ...activity,
            skillID: skill.ID
        });
    };
}

BackActivityPage1.defaultProps = BackActivityPage1Props;
BackActivityPage1.prototype.props = BackActivityPage1Props;

export default BackActivityPage1;

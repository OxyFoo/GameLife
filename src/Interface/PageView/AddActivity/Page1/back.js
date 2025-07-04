import React from 'react';
import { Animated } from 'react-native';

import styles from './style';
import { CreateSkill } from './AddSkill';
import { GetRecentSkills, CategoryToItem, SkillToItem } from '../types';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { DEFAULT_ACTIVITY } from 'Data/User/Activities/index';
import { FormatForSearch } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').FlatList} FlatList
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').Skill} Skill
 * @typedef {import('Interface/Components/InputText/Thin').InputTextThin} InputTextThin
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 *
 * @typedef {Object} BackActivityPage1PropsType
 * @property {React.RefObject<View | null>} nativeRef
 * @property {boolean} show
 * @property {Activity} activity
 * @property {(newActivity: Activity) => Promise<void>} changeActivity
 * @property {() => void} unSelectActivity
 * @property {number | null} categoryID
 * @property {number[]} listSkillsIDs
 */

/** @type {BackActivityPage1PropsType} */
const BackActivityPage1Props = {
    nativeRef: React.createRef(),
    show: false,
    activity: DEFAULT_ACTIVITY,
    changeActivity: async () => {},
    unSelectActivity: () => {},

    categoryID: null,
    listSkillsIDs: []
};

class BackActivityPage1 extends React.Component {
    state = {
        /** @type {ItemSkill[]} */
        skills: [],

        /** @type {number | null} */
        selectedCategory: null,

        searchEnabled: false,
        skillSearch: '',
        animSearch: new Animated.Value(0),

        flatlistHeight: 0,
        buttonHeight: 0,
        animScroll: new Animated.Value(0),

        /** @type {string} Header of input - Name of category */
        inputText: '',

        addSkillLoading: false
    };

    /** @type {React.RefObject<FlatList | null>} */
    refActivities = React.createRef();

    /** @type {React.RefObject<InputTextThin | null>} */
    refSearchInput = React.createRef();

    categoriesNames = dataManager.skills.categories.map((category) => langManager.GetText(category.Name));

    /** @type {number[]} Defined with props 'listSkillsIDs' (disable categories) */
    preselectedSkillsIDs = [];

    /** @type {ItemSkill[]} All skills converted to ItemSkill used as source for the FlatList */
    allSkillsItems = [];

    /** @type {ItemSkill[]} Recent skills converted to ItemSkill used as source */
    allRecentSkillsItems = [];

    /** @type {(ItemCategory | null)[]} All categories converted to ItemCategory used as source for the FlatList */
    allCategoriesItems = [];

    /** @param {BackActivityPage1PropsType} props */
    constructor(props) {
        super(props);

        // Define all categories
        this.allCategoriesItems = dataManager.skills.categories.map(CategoryToItem);

        // Define all skills
        this.allSkillsItems = dataManager.skills.Get().skills.map((skill) => SkillToItem(skill, this.selectSkill));

        // Get recent skills
        this.allRecentSkillsItems = GetRecentSkills(this.selectSkill);

        this.state.skills = this.allSkillsItems;
        this.state.inputText = langManager.curr['activity']['input-activity'];

        // Preselected skills
        if (props.listSkillsIDs.length > 0) {
            this.preselectedSkillsIDs = props.listSkillsIDs;
            this.state.skills = this.allSkillsItems.filter((skill) => this.preselectedSkillsIDs.includes(skill.id));
        }

        // Set default to recent if there is more than 3 skills
        if (this.allRecentSkillsItems.length >= 3 && this.preselectedSkillsIDs.length === 0) {
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
     * @param {ItemSkill} item
     * @param {number} index
     */
    keyExtractor = (item, index) => `act-skill-${item.id}-${index}`;

    handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: {
                        y: this.state.animScroll
                    }
                }
            }
        ],
        { useNativeDriver: true }
    );

    /**
     * @param {string} textSearch
     * @param {number | null} categoryID
     * @returns {object | Promise<object>}
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
            return new Promise((resolve) => {
                this.setState(newState, () => {
                    resolve(newState);
                });
            });
        }

        return newState;
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutFlatlist = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ flatlistHeight: height });
        user.interface.bottomPanel?.mover.onLayoutFlatList?.(event);
    };

    /** @param {number} w @param {number} _h */
    onContentSizeChange = (w, _h) => {
        const { skills, buttonHeight } = this.state;
        user.interface.bottomPanel?.mover.onContentSizeChange?.(w, skills.length * buttonHeight);
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutActivity = (event) => {
        const { height } = event.nativeEvent.layout;
        const margin = styles.activityElement.marginVertical * 2;

        if (height + margin !== this.state.buttonHeight) {
            this.setState({ buttonHeight: height + margin });
            user.interface.bottomPanel?.mover.onContentSizeChange?.(0, this.state.skills.length * (height + margin));
        }
    };

    /** @type {FlatList['props']['getItemLayout']} */
    getItemLayout = (_data, index) => ({
        length: this.state.buttonHeight,
        offset: this.state.buttonHeight * index,
        index
    });

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
    onSearchChange = async (text) => {
        await this.refreshSkills(text, this.state.selectedCategory);
        user.interface.bottomPanel?.mover.ScrollTo(0, false);
    };

    /**
     * @param {number} ID
     * @param {boolean} checked
     */
    selectCategory = async (ID, checked) => {
        await this.refreshSkills(this.state.skillSearch, checked ? ID : null);
        user.interface.bottomPanel?.mover.ScrollTo(0, false);
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

    /** @param {number} ID */
    openSkill = (ID) => {
        user.interface.ChangePage('skill', { args: { skillID: ID } });
    };

    createSkill = () => {
        const maxSkillNameLength = 64;
        this.setState({ addSkillLoading: true });
        user.interface.screenInput?.Open({
            label: langManager.curr['activity']['create-skill'],
            initialText: this.state.skillSearch.trim().slice(0, maxSkillNameLength),
            maxLength: maxSkillNameLength,
            callback: (text) => {
                if (!text) {
                    this.setState({ addSkillLoading: false });
                    return;
                }

                CreateSkill(text).then((result) => {
                    this.setState({ addSkillLoading: false }, async () => {
                        if (result === 'success') {
                            await dataManager.LoadOnline(user);
                            this.allSkillsItems = dataManager.skills
                                .Get()
                                .skills.map((skill) => SkillToItem(skill, this.selectSkill));
                            this.refreshSkills(text);
                        }
                    });
                });
            }
        });
    };
}

BackActivityPage1.defaultProps = BackActivityPage1Props;
BackActivityPage1.prototype.props = BackActivityPage1Props;

export default BackActivityPage1;

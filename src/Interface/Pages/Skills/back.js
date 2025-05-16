import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { AddActivity } from 'Interface/Widgets';
import { GetGlobalTime, GetLocalTime } from 'Utils/Time';
import { SortByKey } from 'Utils/Functions';
import { FormatForSearch } from 'Utils/String';

/**
 * @typedef {import('react-native').FlatList} FlatList
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').Skill} Skill
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 */

class BackSkills extends PageBase {
    state = {
        search: '',
        ascending: true,
        sortSelectedIndex: 0,

        /** @type {number[]} */
        selectedCategories: [],

        /** @type {EnrichedSkill[]} */
        skills: []
    };

    /** @type {React.RefObject<FlatList | null>} */
    refSkills = React.createRef();

    sortList = langManager.curr['skills']['top-sort-list'];

    /** @type {EnrichedSkill[]} */
    allSkills = [];

    /** @type {Symbol | null} */
    activitiesListener = null;

    /** @param {any} props */
    constructor(props) {
        super(props);

        this.allSkills = this.getAllSkills();
        this.state.skills = this.refreshSkills(false);
    }

    componentDidMount() {
        // Get all skills
        this.refreshSkills();

        // Listen to activities changes
        this.activitiesListener = user.activities.allActivities.AddListener(() => {
            this.allSkills = this.getAllSkills();
            this.refreshSkills();
        });
    }
    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * @param {Skill} skill
     * @returns {EnrichedSkill} Skill with Name, Logo & experience
     */
    upgradeSkill = (skill) => {
        const category = dataManager.skills.categories.find((c) => c.ID === skill.CategoryID);
        return {
            ...skill,
            FullName: langManager.GetText(skill.Name),
            LogoXML: dataManager.skills.GetXmlByLogoID(skill.LogoID || (category?.LogoID ?? 0)),
            Experience: user.experience.GetSkillExperience(skill)
        };
    };

    /** @returns {EnrichedSkill[]} All skills with their Name, Logo & experience */
    getAllSkills = () => {
        const now = GetGlobalTime();
        const usersActivities = user.activities.Get().filter((activity) => activity.startTime <= now);
        const usersActivitiesID = usersActivities.map((activity) => activity.skillID);

        return dataManager.skills
            .Get()
            .skills.filter((skill) => usersActivitiesID.includes(skill.ID))
            .map(this.upgradeSkill);
    };

    addActivity = () => {
        this.fe.bottomPanel?.Open({
            content: <AddActivity />
        });
    };

    /** @param {number} ID */
    onSwitchCategory = (ID) => {
        let newSelectedCategories = [];
        const contains = this.state.selectedCategories.includes(ID);
        if (contains) {
            newSelectedCategories = [...this.state.selectedCategories];
            const index = newSelectedCategories.indexOf(ID);
            newSelectedCategories.splice(index, 1);
        } else {
            newSelectedCategories = [...this.state.selectedCategories, ID];
        }

        this.setState({ selectedCategories: newSelectedCategories }, this.refreshSkills);
    };
    /** @param {string} search */
    onChangeSearch = (search) => {
        this.setState({ search: search }, this.refreshSkills);
    };
    onSwitchSort = () => {
        const newIndex = (this.state.sortSelectedIndex + 1) % this.sortList.length;
        this.setState({ sortSelectedIndex: newIndex }, this.refreshSkills);
    };
    switchOrder = () => {
        this.setState({ ascending: !this.state.ascending }, this.refreshSkills);
    };

    /** @param {boolean} [updateState] */
    refreshSkills = (updateState = true) => {
        /** @type {EnrichedSkill[]} */
        let newSkills = this.allSkills;
        const { search, selectedCategories } = this.state;

        // Categories filter
        if (selectedCategories.length) {
            newSkills = newSkills.filter((skill) => selectedCategories.includes(skill.CategoryID));
        }

        // Get recent skills
        if (selectedCategories.includes(0)) {
            /** @type {EnrichedSkill[]} */
            let recentSkills = [];
            const now = GetLocalTime();
            const usersActivities = user.activities
                .Get()
                .filter((activity) => activity.startTime <= now)
                .sort((a, b) => b.startTime - a.startTime);
            for (const activity of usersActivities) {
                const skill = dataManager.skills.GetByID(activity.skillID);
                if (skill === null) continue;

                if (!recentSkills.find((s) => s.ID === skill.ID)) {
                    recentSkills.push(this.upgradeSkill(skill));
                    if (recentSkills.length >= 10) {
                        break;
                    }
                }
            }

            newSkills.push(...recentSkills);
        }

        // Search filter
        if (search !== '') {
            const formattedSearch = FormatForSearch(search);
            newSkills = newSkills.filter((skill) => {
                return FormatForSearch(skill.FullName).includes(formattedSearch);
            });
        }

        const sort = this.state.sortSelectedIndex;
        // Sort by xp
        if (sort === 0) {
            /** @param {string | number} value */
            const format = (value) => (typeof value === 'string' ? value.toLowerCase() : value);

            newSkills = newSkills.sort((a, b) =>
                format(a.Experience?.totalXP) < format(b.Experience.totalXP) ? -1 : 1
            );
        }

        // Sort by name
        else if (sort === 1) {
            newSkills = SortByKey(newSkills, 'FullName').reverse();
        }

        // Sort by date
        else if (sort === 2) {
            /** @param {EnrichedSkill} a @param {EnrichedSkill} b */
            const compare = (a, b) => (a.Experience.lastTime < b.Experience.lastTime ? -1 : 1);
            newSkills = newSkills.sort(compare);
        }

        // Ascending
        if (this.state.ascending) {
            newSkills = newSkills.reverse();
        }

        if (updateState) {
            this.refSkills.current?.scrollToOffset({ offset: 0, animated: true });
            this.setState({ skills: newSkills });
        }

        return newSkills;
    };

    /** @param {string} newText */
    changeText = (newText) => {
        this.setState({ search: newText });
        setTimeout(this.refreshSkills, 50);
    };

    /** @param {number[]} indexes */
    filterChange = (indexes) => {
        this.setState({ selectedFiltersIndex: indexes });
        setTimeout(this.refreshSkills, 50);
    };

    handleBack = () => {
        user.interface.BackHandle();
    };
}

export default BackSkills;

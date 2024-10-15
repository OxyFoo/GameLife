import langManager from 'Managers/LangManager';

import { IAppData } from 'Types/Interface/IAppData';

import { GetByKey } from 'Utils/Functions';

/**
 * @typedef {import('Types/Data/Skills').Skill} Skill
 * @typedef {import('Types/Data/SkillIcons').SkillIcon} Icon
 * @typedef {import('Types/Data/SkillCategories').SkillCategory} Category
 *
 * @typedef {{ skills: Skill[], skillIcons: Icon[], skillCategories: Category[] }} DataType
 */

/** @extends {IAppData<DataType>} */
class Skills extends IAppData {
    /** @type {Skill[]} */
    skills = [];

    /** @type {Icon[]} */
    icons = [];

    /** @type {Category[]} */
    categories = [];

    Clear = () => {
        this.skills = [];
        this.icons = [];
        this.categories = [];
    };

    /**
     * @param {Object} data
     * @param {Skill[]} data.skills
     * @param {Icon[]} data.skillIcons
     * @param {Category[]} data.skillCategories
     */
    Load = (data) => {
        if (typeof data.skills !== 'undefined') this.skills = data.skills;
        if (typeof data.skillIcons !== 'undefined') this.icons = data.skillIcons;
        if (typeof data.skillCategories !== 'undefined') this.categories = data.skillCategories;
    };

    /** @returns {DataType} */
    Save = () => {
        return {
            skills: this.skills,
            skillIcons: this.icons,
            skillCategories: this.categories
        };
    };

    /** @returns {DataType} */
    Get = () => {
        return {
            skills: this.skills
                .filter((skill) => skill.Enabled)
                .sort((a, b) => {
                    const nameA = langManager.GetText(a.Name).toLowerCase();
                    const nameB = langManager.GetText(b.Name).toLowerCase();
                    return nameA.localeCompare(nameB);
                }),
            skillIcons: this.icons,
            skillCategories: this.categories
        };
    };

    /**
     * @param {number} ID
     * @returns {Skill | null} Return skill if exists or null
     */
    GetByID = (ID) => GetByKey(this.skills, 'ID', ID);

    /**
     * @param {number} ID
     * @returns {Category | null} Return category if exists or null
     */
    GetCategoryByID = (ID) => this.categories.find((category) => category.ID === ID) || null;

    /**
     * @param {number} ID
     * @returns {Skill[]} Return skills by category
     */
    GetByCategory = (ID) => this.Get().skills.filter((skill) => skill.CategoryID === ID);

    /**
     * Return XML of logo by ID
     * @param {number} ID
     * @returns {string} Representation of logo (XML)
     */
    GetXmlByLogoID = (ID) => {
        let currXml = '';
        for (let i = 0; i < this.icons.length; i++) {
            const skillIcon = this.icons[i];
            const skillIconID = skillIcon.ID;
            if (ID === skillIconID) {
                currXml = skillIcon.Content;
                break;
            }
        }
        return currXml;
    };
}

export default Skills;

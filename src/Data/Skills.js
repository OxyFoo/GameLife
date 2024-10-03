import langManager from 'Managers/LangManager';

import { GetByKey } from 'Utils/Functions';

/**
 * @typedef {import('Types/Data/Skills').Skill} Skill
 * @typedef {import('Types/Data/Skills').SkillIcon} Icon
 * @typedef {import('Types/Data/Skills').SkillCategory} Category
 */

/** @extends {DataClassTemplate<{ skills: Skill[], skillsIcon: Icon[], skillsCategory: Category[] }>} */
class Skills {
    /** @type {Skill[]} */
    skills = [];

    /** @type {Icon[]} */
    icons = [];

    /** @type {Category[]} */
    categories = [];

    Clear() {
        this.skills = [];
        this.icons = [];
        this.categories = [];
    }

    /**
     * @param {Object} data
     * @param {Skill[]} data.skills
     * @param {Icon[]} data.skillsIcon
     * @param {Category[]} data.skillsCategory
     */
    Load(data) {
        if (typeof data === 'object') {
            if (data.hasOwnProperty('skills')) this.skills = data.skills;
            if (data.hasOwnProperty('skillsIcon')) this.icons = data.skillsIcon;
            if (data.hasOwnProperty('skillsCategory')) this.categories = data.skillsCategory;
        }
    }

    Save() {
        return {
            skills: this.skills,
            skillsIcon: this.icons,
            skillsCategory: this.categories
        };
    }

    /**
     * @returns {Array<Skill>}
     */
    Get = () => {
        return this.skills
            .filter((skill) => skill.Enabled)
            .sort((a, b) => {
                const nameA = langManager.GetText(a.Name).toLowerCase();
                const nameB = langManager.GetText(b.Name).toLowerCase();
                return nameA.localeCompare(nameB);
            });
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
    GetByCategory = (ID) => this.Get().filter((skill) => skill.CategoryID === ID);

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

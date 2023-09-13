import { GetByKey } from 'Utils/Functions';

/**
 * @typedef {import('Managers/DataManager').DataManager} DataManager
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 */

class Skill {
    ID = 0;
    Name = { fr: '', en: '' };
    CategoryID = 0;
    Stats = {
        'int': 0,
        'soc': 0,
        'for': 0,
        'end': 0,
        'agi': 0,
        'dex': 0
    };
    LogoID = 0;
    Creator = '';
    XP = 0;
}

class EnrichedSkill extends Skill {
    /** @type {string} */
    FullName = '';

    /** @type {string} */
    LogoXML = '';

    /** @type {XPInfo|null} */
    Experience = null;
}

class Icon {
    ID = 0;
    //Name = ''; // Unused
    Content = '';
}

class Category {
    ID = 0;
    Name = { fr: '', en: '' };
    LogoID = 0;
}

class Skills {
    constructor(dataManager) {
        /** @type {Skill[]} */
        this.skills = [];

        /** @type {Icon[]} */
        this.icons = [];

        /** @type {Category[]} */
        this.categories = [];

        /** @type {DataManager} */
        this._dataManager = dataManager;
    }

    Load(data) {
        if (typeof(data) === 'object') {
            if (data.hasOwnProperty('skills')) this.skills = data.skills;
            if (data.hasOwnProperty('skillsIcon')) this.icons = data.skillsIcon;
            if (data.hasOwnProperty('skillsCategory')) this.categories = data.skillsCategory;
        }
    }
    Save() {
        const data = {
            skills: this.skills,
            skillsIcon: this.icons,
            skillsCategory: this.categories
        };
        return data;
    }

    /**
     * @param {number} ID
     * @returns {Skill|null} Return skill if exists or null
     */
    GetByID = (ID) => GetByKey(this.skills, 'ID', ID);

    /**
     * @param {number} ID
     * @returns {Category|null} Return category if exists or null
     */
    GetCategoryByID = (ID) => this.categories.find(category => category.ID === ID) || null;

    /**
     * @param {number} ID
     * @returns {Skill[]} Return skills by category
     */
    GetByCategory = (ID) => this.skills.filter(skill => skill.CategoryID === ID);

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
            if (ID == skillIconID) {
                currXml = skillIcon.Content;
                break;
            }
        }
        return currXml;
    }
}

export { Skill, EnrichedSkill, Category };
export default Skills;
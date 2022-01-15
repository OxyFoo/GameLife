import langManager from "../Managers/LangManager";
import { getByKey, sortByKey, strIsJSON } from "../Functions/Functions";

class Skill {
    ID = 0;
    Name = { fr: '', en: '' };
    CategoryID = 0; // TODO - Catégories par ID, dans ce fichier
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
    constructor() {
        /**
         * @type {Skill[]}
         */
        this.skills = [];

        /**
         * @type {Icon[]}
         */
        this.icons = [];

        /**
         * @type {Category[]}
         */
        this.categories = [];
    }

    /**
     * @returns {Skill[]}
     */
    getAll() {
        return this.skills;
    }
    /**
     * @param {Object} skills 
     */
    setAll(skills) {
        this.skills = skills;
    }

    save() {
        const data = {
            skills: this.skills,
            skillsIcons: this.icons,
            skillsCategories: this.categories
        };
        return JSON.stringify(data);
    }
    load(str) {
        if (strIsJSON(str)) {
            const json = JSON.parse(str);
            this.skills = json.skills;
            this.icons = json.skillsIcons;
            this.categories = json.skillsCategories;

            for (let i = 0; i < this.skills.length; i++)
                if (strIsJSON(this.skills[i].Name))
                    this.skills[i].Name = JSON.parse(this.skills[i].Name);
            for (let i = 0; i < this.categories.length; i++)
                if (strIsJSON(this.categories[i].Name))
                    this.categories[i].Name = JSON.parse(this.categories[i].Name);
        }
    }

    getAsObj(category) {
        let skills = [];
        for (let i = 0; i < this.skills.length; i++) {
            let skill = this.skills[i];
            if (typeof(category) === 'undefined' || category === skill.Category) {
                skills.push({ key: parseInt(skill.ID), value: skill.Name });
            }
        }
        return skills;
    }

    /**
     * @param {Number} ID
     * @returns {?Skill} - Return skill if exists or null
     */
    getByID = (ID) => getByKey(this.skills, 'ID', ID);

    getByCategory = (ID) => this.skills.filter(skill => skill.CategoryID === ID);

    getAllCategories(onlyUseful = false) {
        let output = [];
        let categories = sortByKey(this.categories, 'Name');
        categories = categories.map((el) => { return { key: el.ID, value: el.Name } });
        if (onlyUseful) {
            // TODO - End that
            //categories = categories.filter((el) => {});
        }
        return output;
        /*let sorted = this.categories.sort((a, b) => );
        for (let i = 0; i < this.categories.length; i++) {
            if ()
        }*/
    }

    getCategories(onlyUseful = false) {
        /*let cats = [];
        for (let i = 0; i < this.skills.length; i++) {
            let cat = this.skills[i].Category;
            // Search
            let isInCats = false;
            for (let c = 0; c < cats.length; c++) {
                if (cats[c].value == cat) {
                    isInCats = true;
                }
            }

            let curr = false;
            const activities = this.user.activities.getAll();
            for (let a = 0; a < activities.length; a++) {
                if (activities[a].skillID == this.skills[i].ID) {
                    curr = true;
                }
            }

            if (!isInCats && (!onlyUseful || curr) && !cats.includes(cat)) {
                cats.push(cat);
            }
        }

        // Sort
        cats.sort();
        let cats_sorted = [];
        for (const c in cats) {
            cats_sorted.push({ key: parseInt(c), value: cats[c] });
        }

        return cats_sorted;*/
    }

    /**
     * Return XML of logo by ID
     * @param {Number} ID
     * @returns {String} Representation of logo (XML)
     */
    getXmlByLogoID = (ID) => {
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

export default Skills;
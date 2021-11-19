import { strIsJSON } from "../Functions/Functions";

class Skill {
    ID = 0;
    Name = '';
    CategoryID = 0; // TODO - Catégories par ID, dans ce fichier
    Stats = {
        'sag': 0,
        'int': 0,
        'con': 0,
        'for': 0,
        'end': 0,
        'agi': 0,
        'dex': 0
    };
    LogoID = '';
    Creator = '';
    XP = 0;
}

class Skills {
    constructor() {
        this.skills = [];
        this.skillsIcons = [];
        this.skillsCategories = [];
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
            skillsIcons: this.skillsIcons,
            skillsCategories: this.skillsCategories
        };
        return JSON.stringify(data);
    }
    load(str) {
        if (strIsJSON(str)) {
            const json = JSON.parse(str);
            this.skills = json.skills;
            this.skillsIcons = json.skillsIcons;
            this.skillsCategories = json.skillsCategories;
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
     * @returns {Skill} - Return skill if exists or null
     */
    getByID(ID) {
        let skill = null;
        const skillsFilter = this.skills.filter(skill => skill.ID === ID);
        if (skillsFilter.length > 0) {
            skill = skillsFilter[0];
        }
        return skill;
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
        let currXml = null;
        for (let i = 0; i < this.skillsIcons.length; i++) {
            const skillIcon = this.skillsIcons[i];
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
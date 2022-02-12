import { GetByKey, SortByKey } from "../Utils/Functions";

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
    constructor(dataManager) {
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

        this._dataManager = dataManager;
    }

    Load(data) {
        if (typeof(data) === 'object') {
            if (data.hasOwnProperty('skills')) this.skills = data.skills;
            if (data.hasOwnProperty('skillsIcons')) this.icons = data.skillsIcons;
            if (data.hasOwnProperty('skillsCategories')) this.categories = data.skillsCategories;
        }
    }
    Save() {
        const data = {
            skills: this.skills,
            skillsIcons: this.icons,
            skillsCategories: this.categories
        };
        return data;
    }

    GetAsObj(category) {
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
    GetByID = (ID) => GetByKey(this.skills, 'ID', ID);
    GetCategoryByID = (ID) => this.categories.find(category => category.ID === ID);
    GetByCategory = (ID) => this.skills.find(skill => skill.CategoryID === ID);

    // TODO - Unused ?
    GetAllCategories(onlyUseful = false) {
        let output = [];
        let categories = SortByKey(this.categories, 'Name');
        categories = categories.map((el) => { return { key: el.ID, value: el.Name } });
        if (onlyUseful) {
            // TODO - End that
            //categories = categories.find((el) => {});
        }
        return output;
        /*let sorted = this.categories.sort((a, b) => );
        for (let i = 0; i < this.categories.length; i++) {
            if ()
        }*/
    }

    GetCategories(/*onlyUseful = false*/) {
        return this.categories.map(cat => ({ key: cat.ID, value: this._dataManager.GetText(cat.Name) }));
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
            const activities = this.user.activities.Get();
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

export { Skill };
export default Skills;
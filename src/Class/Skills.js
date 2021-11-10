import { UserManager } from "../Managers/UserManager";

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
    /**
     * Skills manager
     * @param {UserManager} user
     */
    constructor(user) {
        this.user = user;
        this.skills = [];
    }

    /**
     * @returns {Skill[]}
     */
    getAll() {
        return this.skills;
    }
    setAll(skills) {
        this.skills = skills;
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

    getByID(ID) {
        let skill;
        const skillsFilter = this.skills.filter(skill => skill.ID === ID);
        if (skillsFilter.length > 0) {
            skill = skillsFilter[0];
        }
        return skill;
    }

    getCategories(onlyUseful = false) {
        let cats = [];
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

        return cats_sorted;
    }
}

export default Skills;
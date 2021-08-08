import langManager from "./LangManager";

class UserManager {
    constructor() {
        this.changePage;

        this.pseudo = 'Pseudo-0000';
        this.email = 'Aucun';
        this.titre = 'Aucun';
        this.xp = 0;

        this.caracs = {
            'sag': 0,
            'int': 0,
            'conf': 0,
            'for': 0,
            'end': 0,
            'agil': 0,
            'dex': 0
        };

        this.skills = [
            new Skill('skill1', 10, 'DD/MM/YY')
        ];
    }


    /*getCategories = () => {
        let cats = [];
        for (let i = 0; i < this.skills.length; i++) {
            let skill = this.skills[i];

            // Check if category exists
            let index = -1;
            for (let c = 0; c < cats.length; c++) {
                if (cats[c].title === skill.category) {
                    index = c; break;
                }
            }

            // Add in cats
            if (index === -1) {
                cats.push({
                    title: skill.category,
                    xp: skill.xp,
                    nb: 1
                });
            } else {
                cats[index].xp += skill.xp;
                cats[index].nb++;
            }
        }

        return cats;
    }*/
}

class Skill {
    constructor(key, xp, lastTime) {
        this.key = key;
        this.title = this.getSkillName(key);
        this.cat = this.getCatName(key);
        this.xp = xp;
        this.lastTime = lastTime;
        this.caracs = {
            'sag': this.getCarac(key, 'sag'),
            'int': this.getCarac(key, 'int'),
            'conf': this.getCarac(key, 'conf'),
            'for': this.getCarac(key, 'for'),
            'end': this.getCarac(key, 'end'),
            'agil': this.getCarac(key, 'agil'),
            'dex': this.getCarac(key, 'dex')
        };
    }

    getSkillName = (key) => {
        return langManager.currentLangage[key]['name'];
    }
    getCatName = (key) => {
        return langManager.currentLangage[key]['cat'];
    }

    getCarac = (key, carac) => {
        return langManager.currentLangage[key][carac];
    }
}

const user = new UserManager();

export default user;
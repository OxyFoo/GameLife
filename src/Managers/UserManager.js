class UserManager {
    changePage;

    skills = [
        new Skill('Skill 1', 'Category 1', 10, 'DD/MM/YY'),
        new Skill('Skill 2', 'Category 1', 20, 'DD/MM/YY'),
        new Skill('Skill 3', 'Category 1', 30, 'DD/MM/YY'),
        new Skill('Skill 4', 'Category 2', 40, 'DD/MM/YY'),
        new Skill('Skill 5', 'Category 2', 50, 'DD/MM/YY'),
        new Skill('Skill 6', 'Category 2', 60, 'DD/MM/YY'),
        new Skill('Skill 7', 'Category 2', 70, 'DD/MM/YY'),
        new Skill('Skill 8', 'Category 3', 80, 'DD/MM/YY'),
        new Skill('Skill 9', 'Category 3', 90, 'DD/MM/YY'),
        new Skill('Skill 10', 'Category 3', 100, 'DD/MM/YY'),
        new Skill('Skill 11', 'Category 3', 110, 'DD/MM/YY'),
        new Skill('Skill 12', 'Category 3', 120, 'DD/MM/YY')
    ];

    getCategories = () => {
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
    }
}

class Skill {
    constructor(title, category, xp, lastTime) {
        this.title = title;
        this.category = category;
        this.xp = xp;
        this.lastTime = lastTime;
    }
}

const user = new UserManager();

export default user;
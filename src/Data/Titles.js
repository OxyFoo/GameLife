import { strIsJSON } from "../Functions/Functions";

class Title {
    ID = 0;
    Title = '';
    AchievementsCondition = 0;
}

class Titles {
    constructor() {
        /**
         * @type {Title[]}
         */
        this.titles = [];
    }

    save() {
        return JSON.stringify(this.titles);
    }
    load(titles) {
        if (strIsJSON(titles)) {
            this.titles = JSON.parse(titles);
        }
    }

    getTitleByID = (ID) => {
        let currTitle = null;
        for (let t = 0; t < this.titles.length; t++) {
            const title = this.titles[t];
            const titleID = parseInt(title.ID);
            if (ID == titleID) {
                currTitle = title.Title;
                break;
            }
        }
        return currTitle;
    }
}

export default Titles;
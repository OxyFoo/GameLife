import langManager from "../Managers/LangManager";
import { strIsJSON } from "../Functions/Functions";

class Title {
    ID = 0;
    Name = { fr: '', en: '' };
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

            for (let i = 0; i < this.titles.length; i++)
                if (strIsJSON(this.titles[i].Name))
                    this.titles[i].Name = JSON.parse(this.titles[i].Name);
        }
    }

    getTitleByID = (ID) => {
        let currTitle = null;
        for (let t = 0; t < this.titles.length; t++) {
            const title = this.titles[t];
            const titleID = parseInt(title.ID);
            if (ID == titleID) {
                currTitle = title.Name;
                break;
            }
        }
        return currTitle;
    }
}

export default Titles;
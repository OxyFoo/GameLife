import { strIsJSON } from "../Functions/Functions";

class Contributor {
    ID = 0;
    Lang = '';
    Quote = '';
    Author = '';
}

class Contributors {
    constructor() {
        /**
         * @type {Contributor[]}
         */
        this.contributors = [];
    }

    save() {
        return JSON.stringify(this.contributors);
    }
    load(achievements) {
        if (strIsJSON(achievements)) {
            this.contributors = JSON.parse(achievements);
        }
    }
}

export default Contributors;
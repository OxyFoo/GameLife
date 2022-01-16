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

    Load(contributors) {
        if (typeof(contributors) === 'object') {
            this.contributors = contributors;
        }
    }
    Save() {
        return this.contributors;
    }
}

export default Contributors;
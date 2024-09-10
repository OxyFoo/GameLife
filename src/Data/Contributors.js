/**
 * @typedef {import('Types/Data/Contributors').Contributor} Contributor
 */

class Contributors {
    /** @type {Contributor[]} */
    contributors = [];

    Clear() {
        this.contributors = [];
    }

    /** @param {Contributor[]} contributors */
    Load(contributors) {
        if (typeof contributors === 'object') {
            this.contributors = contributors;
        }
    }

    Save() {
        return this.contributors;
    }
}

export default Contributors;

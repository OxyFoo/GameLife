import DataClassTemplate from './_Template';

/**
 * @typedef {import('Types/Data/Contributors').Contributor} Contributor
 */

/** @extends {DataClassTemplate<Contributor[]>} */
class Contributors extends DataClassTemplate {
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

    Get() {
        return this.contributors;
    }
}

export default Contributors;

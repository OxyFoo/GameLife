import { IInternalData } from 'Types/Interface/IInternalData';

/**
 * @typedef {import('Types/Data/Contributors').Contributor} Contributor
 */

/** @extends {IInternalData<Contributor[]>} */
class Contributors extends IInternalData {
    /** @type {Contributor[]} */
    contributors = [];

    Clear = () => {
        this.contributors = [];
    };

    /** @param {Contributor[]} contributors */
    Load = (contributors) => {
        if (typeof contributors === 'object') {
            this.contributors = contributors;
        }
    };

    Save = () => {
        return this.contributors;
    };

    Get = () => {
        return this.contributors;
    };
}

export default Contributors;

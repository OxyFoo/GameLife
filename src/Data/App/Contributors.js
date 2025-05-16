import { IAppData } from '@oxyfoo/gamelife-types/Interface/IAppData';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Contributors').Contributor} Contributor
 */

/** @extends {IAppData<Contributor[]>} */
class Contributors extends IAppData {
    /** @type {Contributor[]} */
    contributors = [];

    Clear = () => {
        this.contributors = [];
    };

    /** @param {Contributor[] | undefined} contributors */
    Load = (contributors) => {
        if (typeof contributors !== 'undefined') {
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

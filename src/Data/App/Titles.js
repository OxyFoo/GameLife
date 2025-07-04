import { IAppData } from '@oxyfoo/gamelife-types/Interface/IAppData';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Titles').Title} Title
 */

/** @extends {IAppData<Title[]>} */
class Titles extends IAppData {
    /** @type {Title[]} */
    titles = [];

    Clear = () => {
        this.titles = [];
    };

    /** @param {Title[] | undefined} titles */
    Load = (titles) => {
        if (typeof titles === 'object') {
            this.titles = titles;
        }
    };

    /** @returns {Title[]} */
    Save = () => {
        return this.titles;
    };

    /** @returns {Title[]} */
    Get = () => {
        return this.titles;
    };

    /** @returns {Title[]} */
    GetBuyable = () => {
        return this.titles.filter((t) => t.Buyable);
    };

    /**
     * @param {number} ID
     * @returns {Title | null}
     */
    GetByID = (ID) => this.titles.find((title) => title.ID === ID) || null;
}

export default Titles;

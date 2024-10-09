import DataClassTemplate from './_Template';

/**
 * @typedef {import('Types/Data/Titles').Title} Title
 */

/** @extends {DataClassTemplate<Title[]>} */
class Titles extends DataClassTemplate {
    /** @type {Title[]} */
    titles = [];

    Clear() {
        this.titles = [];
    }

    /** @param {Title[]} titles */
    Load(titles) {
        if (typeof titles === 'object') {
            this.titles = titles;
        }
    }

    Save() {
        return this.titles;
    }

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

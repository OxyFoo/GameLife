/**
 * @typedef {import('Types/Data/Titles').Title} Title
 */

class Titles {
    /** @type {Array<Title>} */
    titles = [];

    Clear() {
        this.titles = [];
    }

    /** @param {Array<Title>} titles */
    Load(titles) {
        if (typeof titles === 'object') {
            this.titles = titles;
        }
    }

    Save() {
        return this.titles;
    }

    /** @returns {Array<Title>} */
    Get = () => {
        return this.titles;
    };

    /** @returns {Array<Title>} */
    GetBuyable = () => {
        return this.titles.filter((t) => t.Buyable === 1);
    };

    /**
     * @param {number} ID
     * @returns {Title | null}
     */
    GetByID = (ID) => this.titles.find((title) => title.ID === ID) || null;
}

export default Titles;

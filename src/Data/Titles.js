class Title {
    ID = 0;
    Name = { fr: '', en: '' };
    Value = 0;
    Buyable = 0;
}

class Titles {
    /** @type {Array<Title>} */
    titles = [];

    Clear() {
        this.titles = [];
    }
    Load(titles) {
        if (typeof(titles) === 'object') {
            this.titles = titles;
        }
    }
    Save() {
        return this.titles;
    }

    /** @returns {Array<Title>} */
    Get = () => {
        return this.titles;
    }

    /** @returns {Array<Title>} */
    GetBuyable = () => {
        return this.titles.filter(t => t.Buyable === 1);
    }

    /**
     * @param {number} ID 
     * @returns {?Title}
     */
    GetByID = (ID) => this.titles.find(title => title.ID == ID) || null;
}

export { Title };
export default Titles;

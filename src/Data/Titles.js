class Title {
    ID = 0;
    Name = { fr: '', en: '' };
}

class Titles {
    constructor() {
        /**
         * @type {Array<Title>}
         */
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

    /**
     * @param {Number} ID 
     * @returns {?Title}
     */
    GetByID = (ID) => this.titles.find(title => title.ID == ID) || null;
}

export { Title };
export default Titles;
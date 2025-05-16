import { IAppData } from '@oxyfoo/gamelife-types/Interface/IAppData';

import { Random } from 'Utils/Functions';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Quotes').Quote} Quote
 */

/** @extends {IAppData<Quote[]>} */
class Quotes extends IAppData {
    /** @type {Quote[]} */
    quotes = [];

    Clear = () => {
        this.quotes = [];
    };

    /** @param {Quote[] | undefined} quotes */
    Load = (quotes) => {
        if (typeof quotes !== 'undefined') {
            this.quotes = quotes;
        }
    };

    Save = () => {
        return this.quotes;
    };

    Get = () => {
        return this.quotes;
    };

    /** @returns {Quote|null} */
    GetRandomQuote() {
        let quote = null;
        if (this.quotes.length > 0) {
            const random_quote = Random(0, this.quotes.length - 1);
            quote = this.quotes[random_quote];
        }
        return quote;
    }
}

export default Quotes;

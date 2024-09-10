import { Random } from 'Utils/Functions';

/**
 * @typedef {import('Types/Data/Quotes').Quote} Quote
 */

class Quotes {
    /** @type {Quote[]} */
    quotes = [];

    Clear() {
        this.quotes = [];
    }

    /** @param {Quote[]} quotes */
    Load(quotes) {
        if (typeof quotes === 'object') {
            this.quotes = quotes;
        }
    }

    Save() {
        return this.quotes;
    }

    Get() {
        return this.quotes;
    }

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

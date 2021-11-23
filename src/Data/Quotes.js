import { random, strIsJSON } from "../Functions/Functions";

class Quote {
    ID = 0;
    Lang = '';
    Quote = '';
    Author = '';
}

class Quotes {
    constructor() {
        /**
         * @type {Quote[]}
         */
        this.quotes = [];
    }

    save() {
        return JSON.stringify(this.quotes);
    }
    load(achievements) {
        if (strIsJSON(achievements)) {
            this.quotes = JSON.parse(achievements);
        }
    }

    /**
     * @returns {?Quote}
     */
    getRandomQuote() {
        let quote = null;
        if (this.quotes.length > 0) {
            const random_quote = random(0, this.quotes.length - 1);
            quote = this.quotes[random_quote];
        }
        return quote;
    }
}

export default Quotes;
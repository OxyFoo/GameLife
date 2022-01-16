import { Random } from "../Functions/Functions";

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

        /**
         * @type {?Quote}
         */
        this.currentQuote = null;
    }

    Load(quotes) {
        if (typeof(quotes) === 'object') {
            this.quotes = quotes;
            this.currentQuote = this.GetRandomQuote();
        }
    }
    Save() {
        return this.quotes;
    }

    /**
     * @returns {?Quote}
     */
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
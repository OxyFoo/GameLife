import { Random } from 'Utils/Functions';

class Quote {
    ID = 0;
    Quote = { fr: '', en: '' };
    Author = '';
}

class Quotes {
    /** @type {Quote[]} */
    quotes = [];

    /** @type {Quote|null} */
    currentQuote = null;

    Clear() {
        this.quotes = [];
        this.currentQuote = null;
    }
    Load(quotes) {
        if (typeof(quotes) === 'object') {
            this.quotes = quotes;
        }
        if (this.quotes.length) {
            this.currentQuote = this.GetRandomQuote();
        }
    }
    Save() {
        return this.quotes;
    }

    Get() {
        return this.quotes;
    }

    /**
     * @returns {Quote|null}
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

export { Quote };
export default Quotes;

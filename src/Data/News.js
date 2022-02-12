/**
 * @typedef {{fr: '', en: ''}} LangText
 */

class New {
    ID = 0;

    /**
     * @type {LangText}
     */
    Content = { fr: '', en: '' };

    /**
     * @description XML of icon or null, if button is defined, icon will show in button
     * @type {String?}
     */
    Icon = null;

    /**
     * @description Text of button
     * @type {LangText?}
     */
    ButtonText = null;

    /**
     * @description Page name or url (https) to open
     * @type {String?}
     */
    ButtonEvent = null;

    /**
     * @description Show text to
     * @type {'auto'|'left'|'right'}
     */
    TextAlign = 'auto';
}

class News {
    constructor() {
        /**
         * @type {Array<New>}
         */
        this.news = [];
    }

    Load(news) {
        if (news !== null) {
            this.news = news;
        }
    }
}

export { New };
export default News;
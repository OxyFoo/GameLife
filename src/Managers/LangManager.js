import fr from '../../res/langs/fr.json';
import en from '../../res/langs/en.json';

DEFAULT_LANG = 'fr';

/**
 * @typedef {import('Ressources/langs/fr.json')} Lang
 */

class LangManager {
    constructor() {
        /** @type {Lang?} */
        this.curr = null;

        this.langages = {
            'fr': fr,
            'en': en
        };
        this.SetLangage();
    }

    SetLangage(lang) {
        let newLang = DEFAULT_LANG;
        if (Object.keys(this.langages).includes(lang)) {
            newLang = lang;
        }
        this.currentLangageKey = newLang;
        this.curr = this.langages[newLang];
    }
}

const langManager = new LangManager();

export default langManager;
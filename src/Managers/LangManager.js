import fr from '../../res/langs/fr.json';
import en from '../../res/langs/en.json';

const LANGAGES = {
    'fr': fr,
    'en': en
};

/**
 * @typedef {keyof LANGAGES} LangKey
 * @typedef {typeof LANGAGES[LangKey]} Lang
 */

/** @type {LangKey} */
const DEFAULT_LANG = 'fr';

class LangManager {
    /** @type {LangKey} */
    currentLangageKey = 'fr';

    /** @type {Lang} */
    curr = LANGAGES['fr'];

    GetAllLangs() {
        return LANGAGES;
    }

    GetLangsKeys() {
        return Object.keys(LANGAGES);
    }

    /** @param {LangKey | null} lang */
    SetLangage(lang = null) {
        let newLang = DEFAULT_LANG;
        if (Object.keys(LANGAGES).includes(lang)) {
            newLang = lang;
        }
        this.currentLangageKey = newLang;
        this.curr = LANGAGES[newLang];
    }
}

const langManager = new LangManager();

export default langManager;

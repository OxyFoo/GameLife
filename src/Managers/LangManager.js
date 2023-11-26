import fr from '../../res/langs/fr.json';
import en from '../../res/langs/en.json';

/**
 * @typedef {import('Ressources/langs/fr.json')} LangFr
 * @typedef {import('Ressources/langs/en.json')} LangEn
 * 
 * @typedef {'fr'|'en'} LangKey
 * @typedef {LangFr | LangEn} Lang
 */

/** @type {LangKey} */
const DEFAULT_LANG = 'fr';

/** @type {{[key in LangKey]: Lang}} */
const LANGAGES = {
    'fr': fr,
    'en': en
};

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

    /** @param {LangKey|null} lang */
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

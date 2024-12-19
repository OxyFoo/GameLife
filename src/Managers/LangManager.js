import fr from '../../res/langs/fr.json';
import en from '../../res/langs/en.json';
import { GetLangRegionLocale } from 'Utils/Device';

const LANGAGES = {
    fr: fr,
    en: en
};

/**
 * @typedef {keyof LANGAGES} LangKey
 * @typedef {typeof LANGAGES[LangKey]} Lang
 */

const INITIAL_LANG = GetLangRegionLocale() === 'en' ? 'en' : 'fr';

/** @type {LangKey} */
const DEFAULT_LANG = 'fr';

class LangManager {
    /** @type {LangKey} */
    currentLangageKey = INITIAL_LANG;

    /** @type {Lang} */
    curr = LANGAGES[INITIAL_LANG];

    GetAllLangs() {
        return LANGAGES;
    }

    /** @returns {LangKey[]} */
    GetLangsKeys() {
        // @ts-ignore
        return Object.keys(LANGAGES);
    }

    /**
     * @description Check is lang is available & convert it to a valid lang key
     * @param {string} lang
     * @returns {LangKey | null}
     */
    IsLangAvailable(lang) {
        const langs = this.GetLangsKeys();
        const index = langs.findIndex((l) => l === lang);
        return index !== -1 ? langs[index] : null;
    }

    /** @param {LangKey | null} lang */
    SetLangage(lang = null) {
        let newLang = DEFAULT_LANG;
        if (lang && Object.keys(LANGAGES).includes(lang)) {
            newLang = lang;
        }
        this.currentLangageKey = newLang;
        this.curr = LANGAGES[newLang];
    }

    /**
     * @param {{ [key in LangKey]: string }} value
     * @returns {string}
     */
    GetText(value) {
        let output = '';
        if (typeof value === 'object') {
            const key = this.currentLangageKey;
            if (value.hasOwnProperty(key)) output = value[key];
            else if (value.hasOwnProperty('fr')) output = value['fr'];
        }
        return output;
    }
}

const langManager = new LangManager();

export default langManager;

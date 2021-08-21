import fr from '../../ressources/langs/fr.json';
import en from '../../ressources/langs/en.json';

DEFAULT_LANG = 'fr';

class LangManager {
    constructor() {
        this.langages = {
            'fr': fr,
            'en': en
        };
        this.setLangage();
    }

    setLangage(lang = DEFAULT_LANG) {
        this.currentLangageKey = lang;
        this.curr = this.langages[lang];
    }

    switchLangage() {
        let select = false;
        let newlang = null;
        for (let lang in this.langages) {
            if (select) { newlang = lang; break; }
            if (this.langages[lang] == this.curr) select = true;
        }
        if (!select || newlang == null)
            newlang = Object.keys(this.langages)[0];
        if (newlang != null)
            this.curr = this.langages[newlang];
        return newlang;
    }

    getOtherLangs() {
        let langs = [];
        for (let l in this.langages) {
            if (this.langages[l] === this.curr) {
                continue;
            }
            const item = {
                key: l,
                value: this.langages[l]['name']
            };
            langs.push(item);
        }
        return langs;
    }
}

const langManager = new LangManager();

export default langManager;
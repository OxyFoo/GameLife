import fr from '../../ressources/langs/fr.json';

class LangManager {
    constructor(defaultLang = 'fr') {
        this.langages = {
            'fr': fr
        };
        this.setLangage(defaultLang);
    }

    setLangage(lang) {
        this.currentLangage = this.langages[lang];
    }

    switchLangage() {
        let select = false;
        let newlang = null;
        for (let lang in this.langages) {
            if (select) { newlang = lang; break; }
            if (this.langages[lang] == this.currentLangage) select = true;
        }
        if (!select || newlang == null)
            newlang = Object.keys(this.langages)[0];
        if (newlang != null)
            this.currentLangage = this.langages[newlang];
        return newlang;
    }
}

const langManager = new LangManager();

export default langManager;
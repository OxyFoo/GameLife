import DataStorage, { STORAGE } from '../Functions/DataStorage';
import { isUndefined } from '../Functions/Functions';

class ThemeManager {
    THEMES = {
        Dark: {
            globalBackground: '#000020',
            globalBackcomponent: '#000000',
            xpBar: '#ECECEC',
            text: {
                main: '#ECECEC',
                secondary: '#C2C2C2',
                dark: '#808080'
            }
        },
        Light: {
            globalBackground: '#000020',
            globalBackcomponent: '#000000',
            xpBar: '#ECECEC',
            text: {
                main: '#ECECEC',
                secondary: '#C2C2C2',
                dark: '#808080'
            }
        }
    }

    // Default value
    selectedTheme = 'Dark';

    // Get the color of the theme
    colors = this.THEMES[this.selectedTheme];

    constructor() {
        this.loadTheme();
    }

    async loadTheme() {
        const data = await DataStorage.Load(STORAGE.THEME, false);
        if (data !== null && data.hasOwnProperty('theme')) {
            const currentTheme = data['theme'];
            this.setTheme(currentTheme, false);
        }
    }

    saveTheme() {
        const data = { 'theme': this.selectedTheme };
        DataStorage.Save(STORAGE.THEME, data, false);
    }

    setTheme(theme, save = true) {
        let output = false;
        if (this.isTheme(theme)) {
            output = true;
            this.selectedTheme = theme;
            this.colors = this.THEMES[theme];
            if (save) this.saveTheme();
        }
        return output;
    }

    isTheme(theme) {
        return Object.keys(this.THEMES).includes(theme);
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };
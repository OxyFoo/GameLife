import DataStorage, { STORAGE } from '../Functions/DataStorage';

class ThemeManager {
    THEMES = {
        Dark: {
            globalBackground: '#000020',
            globalBackcomponent: '#000000',
            xpBar: '#ECECEC',
            text: {
                main: '#ECECEC',
                secondary: '#808080'
            }
        },
        Light: {
            globalBackground: '#000020',
            globalBackcomponent: '#000000',
            xpBar: '#ECECEC',
            text: {
                main: '#ECECEC',
                secondary: '#808080'
            }
        }
    }

    // Default value
    selectedTheme = 'Dark';

    // Get the color of the theme
    colors = this.THEMES[this.selectedTheme];

    setTheme(theme) {
        let output = false;
        if (this.isTheme(theme)) {
            output = true;
            this.selectedTheme = theme;
            this.colors = this.THEMES[theme];
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
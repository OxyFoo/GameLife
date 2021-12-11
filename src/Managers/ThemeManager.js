class ThemeManager {
    THEMES = {
        Dark: {
            main1: '#9095FF', // Purple
            main2: '#DBA1FF', // Pink
            main3: '#0B112F', // Dark (background)
            white: '#FFFFFF', // White
            border: '#808080', // Grey
            background: '#0E1247', // Dark purple
            backgroundGrey: '#222740', // Grey
            backgroundTransparent: '#FFFFFF33', // Transparent white

            globalBackground: '#000020', // Obsolete
            globalBackcomponent: '#000000', // Obsolete
            xpBar: '#ECECEC',
            text: {
                main: '#ECECEC', // Obsolete
                primary: '#ECECEC',
                secondary: '#808080',
                light: '#A7A4A4',
                error: '#CC0029'
            }
        }/*,
        Light: {
            globalBackground: '#000020',
            globalBackcomponent: '#000000',
            xpBar: '#ECECEC',
            text: {
                primary: '#ECECEC',
                secondary: '#808080',
                error: '#CC0029'
            }
        }*/
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

    /**
     * Check if theme is valid
     * @param {String} theme - Theme name
     * @returns {Boolean} - True if theme is valid
     */
    isTheme(theme) {
        return Object.keys(this.THEMES).includes(theme);
    }

    /**
     * @param {String} str - Name of theme color or hex color
     * @param {?String} subTheme - Key of subtheme (eg: text)
     * @returns {String} - Hex color
     */
    getColor(str, subTheme = null) {
        let output = null;
        if (str.includes('#')) {
            output = str;
        } else {
            let selectedColors = this.colors;
            if (subTheme !== null && selectedColors.hasOwnProperty(subTheme)) {
                selectedColors = selectedColors[subTheme];
            }
            if (selectedColors.hasOwnProperty(str)) {
                output = selectedColors[str];
            }
        }
        return output;
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };
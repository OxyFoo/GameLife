class ThemeManager {
    THEMES = {
        Dark: {
            main1: '#9095FF', // Purple
            main2: '#DBA1FF', // Pink
            main3: '#0B112F', // Dark (background)
            white: '#FFFFFF', // White
            border: '#808080', // Grey
            background: '#0E1247', // Dark purple
            backgroundCard: '#384065', // Transparent purple
            backgroundGrey: '#222740', // Grey
            backgroundTransparent: '#FFFFFF33', // Transparent white
            danger: '#CC0029',

            text: {
                main: '#ECECEC', // Obsolete
                primary: '#ECECEC',
                secondary: '#808080',
                light: '#A7A4A4',
                error: '#CC0029'
            },

            // Obsolete
            globalBackground: '#000020',
            globalBackcomponent: '#000000',
            xpBar: '#ECECEC'
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

    SetTheme(theme) {
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
     * @param {Number} opacity - Opacity of color, between 0 and 1
     * @returns {String} - Hex color
     */
    GetColor(str, subTheme = null, opacity = 1) {
        let output = null;

        // If already hex color, keep it
        if (str.includes('#')) {
            output = str;
        }

        // If not hex color, get the color from current theme
        else {
            let selectedColors = this.colors;
            if (subTheme !== null && selectedColors.hasOwnProperty(subTheme)) {
                selectedColors = selectedColors[subTheme];
            }
            if (selectedColors.hasOwnProperty(str)) {
                output = selectedColors[str];
            }
        }

        // Apply opacity
        if (output !== null && output.startsWith('#') && opacity < 1) {
            let opacityStr = Math.round(opacity * 255).toString(16);
            if (opacityStr.length === 1) {
                opacityStr = '0' + opacityStr;
            }
            output = output.substring(0, 7) + opacityStr;
        }

        return output;
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };
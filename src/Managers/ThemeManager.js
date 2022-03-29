/**
 * @typedef {'Dark'|'Light'} Theme
 * @typedef {'primary'|'secondary'|'light'|'warning'|'error'} ColorThemeText Color name or hexadecimal color
 * @typedef {'main1'|'main2'|'main3'|'white'|'black'|'border'|'background'|'backgroundCard'|'backgroundGrey'|'backgroundTransparent'|'danger'} ColorTheme Color name or hexadecimal color
 */

class ThemeManager {
    THEMES = {
        Dark: {
            main1: '#9095FF', // Purple
            main2: '#DBA1FF', // Pink
            main3: '#0B112F', // Dark (background)
            white: '#FFFFFF', // White
            black: '#000000', // Black
            border: '#808080', // Grey
            background: '#0E1247', // Dark purple
            backgroundCard: '#384065', // Transparent purple
            backgroundGrey: '#222740', // Grey
            backgroundTransparent: '#FFFFFF33', // Transparent white
            success: '#27AE60', // Green
            danger: '#C0392B', // Red

            text: {
                primary: '#ECECEC',
                secondary: '#808080',
                light: '#A7A4A4',
                warning: '#F1C40F',
                error: '#CC0029'
            }
        },
        Light: {
            main2: '#9095FF', // Purple
            main1: '#DBA1FF', // Pink
            main3: '#0B112F', // Dark (background)
            white: '#FFFFFF', // White
            black: '#000000', // Black
            border: '#808080', // Grey
            background: '#0E1247', // Dark purple
            backgroundCard: '#384065', // Transparent purple
            backgroundGrey: '#222740', // Grey
            backgroundTransparent: '#FFFFFF33', // Transparent white
            success: '#27AE60', // Green
            danger: '#CC0029',

            text: {
                primary: '#ECECEC',
                secondary: '#808080',
                light: '#A7A4A4',
                warning: '#F1C40F',
                error: '#CC0029'
            }
        }
    }

    // Default value
    selectedTheme = 'Dark';

    // Get the color of the theme
    colors = this.THEMES[this.selectedTheme];

    /**
     * @description Define the theme
     * @param {Theme} theme
     * @returns {Boolean} - True if theme is valid
     */
    SetTheme(theme) {
        if (this.isTheme(theme)) {
            this.selectedTheme = theme;
            this.colors = this.THEMES[theme];
            return true;
        }
        return false;
    }

    /**
     * @description Check if theme is valid
     * @param {String} theme - Theme name
     * @returns {Boolean} - True if theme is valid
     */
    isTheme(theme) {
        return Object.keys(this.THEMES).includes(theme);
    }

    /**
     * @description Get the theme color by name (or return the color if already hex color)
     * @param {ColorTheme|ColorThemeText} color - Name of theme color or hex color
     * @param {Number} [opacity=1] - Opacity of color, between 0 and 1
     * @returns {String} - Hex color (or same color than input if not found and not hex)
     */
    GetColor(color, opacity = 1) {
        if (color.startsWith('#')) return this.ApplyOpacity(color, opacity);
        if (this.colors.hasOwnProperty(color)) return this.ApplyOpacity(this.colors[color], opacity);
        if (this.colors.text.hasOwnProperty(color)) return this.ApplyOpacity(this.colors.text[color], opacity);
        return color;
    }

    /**
     * @description Apply opacity to a color (hex to hex)
     * @param {String} hexColor - Hex color
     * @param {Number} [opacity=1] - Opacity of color, between 0 and 1
     * @returns {String?} - Hex color (or null if not hex color)
     */
    ApplyOpacity(hexColor, opacity = 1) {
        if (!hexColor || !hexColor.startsWith('#') || hexColor.length < 4) return null;
        if (opacity === 1) return hexColor;

        let hexOpacityColor = Math.round(opacity * 255).toString(16);
        if (hexOpacityColor.length === 1) hexOpacityColor = '0' + hexOpacityColor;
        return hexColor.substring(0, 7) + hexOpacityColor;
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };
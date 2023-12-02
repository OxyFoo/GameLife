import THEMES from 'Ressources/themes';
import { Rarity } from 'Data/Items';

/**
 * @typedef {keyof typeof THEMES} ThemeName
 * @typedef {keyof typeof THEMES[ThemeName]} ThemeTypes
 * @typedef {keyof typeof THEMES[ThemeName]['Color']} ThemeColor
 * @typedef {keyof typeof THEMES[ThemeName]['Text']} ThemeText
 * @typedef {keyof typeof THEMES[ThemeName]['Rarity']} ThemeRarity
 */

class ThemeManager {
    /**
     * Default value
     * @type {ThemeName}
     * @default 'Main'
     */
    selectedTheme = 'Main';

    /**
     * @description Define the theme
     * @param {ThemeName} theme
     * @returns {boolean} True if theme is valid
     */
    SetTheme(theme) {
        if (this.isTheme(theme)) {
            this.selectedTheme = theme;
            this.colors = THEMES[theme];
            return true;
        }
        return false;
    }

    /**
     * @description Check if theme is valid
     * @param {string} theme Theme name
     * @returns {boolean} True if theme is valid
     * @private
     */
    isTheme(theme) {
        return Object.keys(THEMES).includes(theme);
    }

    /**
     * @description Get the theme color by name (or return the color if already hex color)
     * @param {ThemeColor | ThemeText | ThemeRarity} color Color name or hexadecimal color
     * @param {Object} [params] Parameters
     * @param {number} [params.opacity=1] Opacity of color, between 0 and 1
     * @param {ThemeName} [params.themeName] Theme name (if not defined, use current theme)
     * @param {ThemeTypes} [params.type] Type of theme (if not defined, defined automatically)
     * @returns {string} Hex color (or same color than input if not found and not hex)
     */
    GetColor(color, params = {}) {
        // Define parameters
        const param = { opacity: 1, themeName: null, type: null, ...params };
        const themeName = param.themeName || this.selectedTheme;

        // Wrong theme selected
        if (!this.isTheme(themeName)) {
            return color;
        }

        const theme = THEMES[themeName];
        for (const type of Object.keys(theme)) {
            if (param.type === null || param.type === type) {
                if (theme[type].hasOwnProperty(color)) {
                    return this.ApplyOpacity(theme[type][color], param.opacity);
                }
            }
        }

        return color;
    }

    /**
     * @description Apply opacity to a color (hex to hex)
     * @param {string} hexColor Hex color
     * @param {number} [opacity=1] Opacity of color, between 0 and 1
     * @returns {string?} Hex color (or null if not hex color)
     */
    ApplyOpacity(hexColor, opacity = 1) {
        if (!hexColor || !hexColor.startsWith('#') || hexColor.length < 4) return null;
        if (opacity === 1) return hexColor;

        let hexOpacityColor = Math.round(opacity * 255).toString(16);
        if (hexOpacityColor.length === 1) hexOpacityColor = '0' + hexOpacityColor;
        return hexColor.substring(0, 7) + hexOpacityColor;
    }

    /**
     * @param {number} rarity 0 to 4 (common, rare, epic, legendary, event)
     * @returns {string[]}
     */
    GetRariryColors = (rarity) => {
        let colors = [];
        switch (rarity) {

            case Rarity.common:
                colors = [ this.GetColor('common1'), this.GetColor('common2') ];
                break;

            case Rarity.rare:
                colors = [ this.GetColor('rare1'), this.GetColor('rare2') ];
                break;

            case Rarity.epic:
                colors = [ this.GetColor('epic1'), this.GetColor('epic2') ];
                break;

            case Rarity.legendary:
                colors = [ this.GetColor('legendary1'), this.GetColor('legendary2') ];
                break;

            case Rarity.event:
                colors = [ this.GetColor('event1'), this.GetColor('event2') ];
                break;
        }
        return colors;
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };

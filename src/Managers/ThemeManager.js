import THEMES from 'Ressources/themes';
import { MinMax } from 'Utils/Functions';

/**
 * @typedef {keyof typeof THEMES} ThemeName
 * @typedef {keyof typeof THEMES[ThemeName]} ThemeTypes
 * @typedef {keyof typeof THEMES[ThemeName]['Color']} ThemeColor
 * @typedef {keyof typeof THEMES[ThemeName]['Text']} ThemeText
 * @typedef {keyof typeof THEMES[ThemeName]['Rarity']} ThemeRarity
 * @typedef {import('Types/Global/Rarities').Rarities} Rarities
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
        /** @type {Array<keyof THEMES['Main']>} */ // @ts-ignore
        const THEME_KEYS = Object.keys(theme);

        for (const type of THEME_KEYS) {
            const themeType = theme[type];
            if (param.type !== null && param.type !== type) {
                continue;
            }
            if (!themeType.hasOwnProperty(color)) {
                continue;
            }

            /** @type {string} */ // @ts-ignore
            const _color = themeType[color];
            const newColor = this.ApplyOpacity(_color, param.opacity);
            if (newColor !== null) {
                return newColor;
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
        if (!hexColor || !hexColor.startsWith('#') || hexColor.length < 4) {
            return null;
        }
        if (opacity === 1) {
            return hexColor;
        }

        let hexOpacityColor = Math.round(opacity * 255).toString(16);
        if (hexOpacityColor.length === 1) {
            hexOpacityColor = '0' + hexOpacityColor;
        }
        return hexColor.substring(0, 7) + hexOpacityColor;
    }

    /**
     * @param {Rarities} rarity 0 to 4 (common, rare, epic, legendary, event)
     * @returns {string[]}
     */
    GetRariryColors = (rarity) => {
        /** @type {string[]} */
        let colors = [];
        switch (rarity) {
            case 'common':
                colors = [this.GetColor('common1'), this.GetColor('common2')];
                break;

            case 'rare':
                colors = [this.GetColor('rare1'), this.GetColor('rare2')];
                break;

            case 'epic':
                colors = [this.GetColor('epic1'), this.GetColor('epic2')];
                break;

            case 'legendary':
                colors = [this.GetColor('legendary1'), this.GetColor('legendary2')];
                break;
        }
        return colors;
    };

    /**
     * @param {string} color The color to shade, in hex format
     * @param {number} percent The percentage of shade to apply [-100, 100]
     * @returns {string} Final hex color
     */
    ShadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16);
        let G = parseInt(color.substring(3, 5), 16);
        let B = parseInt(color.substring(5, 7), 16);

        R = MinMax(0, Math.round(R * (1 + percent / 100)), 255);
        G = MinMax(0, Math.round(G * (1 + percent / 100)), 255);
        B = MinMax(0, Math.round(B * (1 + percent / 100)), 255);

        const RR = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
        const GG = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
        const BB = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);

        return `#${RR}${GG}${BB}`;
    }

    /**
     * @param {string | ThemeColor | ThemeText | ThemeRarity} hex Hexadecimal color like #RRGGBB
     * @returns {number} Luminance relative between 0 and 1
     */
    GetLuminance(hex) {
        if (!hex.includes('#')) {
            throw new Error('Hex color must start with #');
        }

        const _hex = hex.replace(/^#/, '');
        const bigint = parseInt(_hex, 16);

        const r = ((bigint >> 16) & 255) / 255;
        const g = ((bigint >> 8) & 255) / 255;
        const b = (bigint & 255) / 255;

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };

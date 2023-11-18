import { Rarity } from 'Data/Items';

/**
 * @typedef {'Dark'|'Light'} Theme
 * @typedef {'primary'|'secondary'|'light'|'warning'|'error'} ColorThemeText Color name or hexadecimal color
 * @typedef {'main1'|'main2'|'main3'|'white'|'black'|'border'|'background'|'backgroundCard'|'backgroundGrey'|'backgroundTransparent'|'success'|'danger'|'ground1'|'ground1a'|'ground1b'|'ground2'|'transparent'|'dataBigKpi'|'dataSmallKpi'} ColorTheme Color name or hexadecimal color
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
            transparent: '#00000000', // Transparent
            dataBigKpi: '#232B5D', // Dark blue
            dataSmallKpi: '#38406550', // Transparent blue

            ground1: '#03052E',
            ground1a: '#0C0E35',
            ground1b: '#303253',
            ground2: '#353657',

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
            transparent: '#00000000',
            dataBigKpi: '#232B5D', // Dark blue
            dataSmallKpi: '#38406550', // Transparent blue

            ground1: '#FFFFFF',
            ground1a: '#FFFFFF',
            ground1b: '#FFFFFF',
            ground2: '#FFFFFF',

            text: {
                primary: '#ECECEC',
                secondary: '#808080',
                light: '#A7A4A4',
                warning: '#F1C40F',
                error: '#CC0029'
            }
        }
    };

    ABSOLUTE = {
        rarity_common: [
            '#3D8B25',
            '#0F5904'
        ],
        rarity_rare: [
            '#1B72C1',
            '#0D4389'
        ],
        rarity_epic: [
            '#B650D8',
            '#712AA0'
        ],
        rarity_legendary: [
            '#E7743B',
            '#A74A1E'
        ],
        rarity_event: [
            '#1B72C1',
            '#B650D8',
            '#E7743B'
        ]
    };

    // Default value
    selectedTheme = 'Dark';

    // Get the color of the theme
    colors = this.THEMES[this.selectedTheme];

    /**
     * @description Define the theme
     * @param {Theme} theme
     * @returns {boolean} True if theme is valid
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
     * @param {string} theme Theme name
     * @returns {boolean} True if theme is valid
     */
    isTheme(theme) {
        return Object.keys(this.THEMES).includes(theme);
    }

    /**
     * @description Get the theme color by name (or return the color if already hex color)
     * @param {ColorTheme|ColorThemeText} color Name of theme color or hex color
     * @param {number} [opacity=1] Opacity of color, between 0 and 1
     * @returns {string} Hex color (or same color than input if not found and not hex)
     */
    GetColor(color, opacity = 1) {
        if (this.colors.hasOwnProperty(color)) return this.ApplyOpacity(this.colors[color], opacity);
        if (this.colors.text.hasOwnProperty(color)) return this.ApplyOpacity(this.colors.text[color], opacity);
        return color;
    }

    /**
     * @description Get absolute color (independant of theme)
     */
    GetAbsoluteColors() {
        return this.ABSOLUTE;
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
        const absoluteColors = this.GetAbsoluteColors();
        switch (rarity) {
            case Rarity.common:     colors = absoluteColors.rarity_common;      break;
            case Rarity.rare:       colors = absoluteColors.rarity_rare;        break;
            case Rarity.epic:       colors = absoluteColors.rarity_epic;        break;
            case Rarity.legendary:  colors = absoluteColors.rarity_legendary;   break;
            case Rarity.event:      colors = absoluteColors.rarity_event;       break;
        }
        return colors;
    }
}

const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };
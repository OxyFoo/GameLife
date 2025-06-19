import { Component, createRef } from 'react';

import THEMES from 'Ressources/themes';
import { MinMax } from 'Utils/Functions';

const THEME_VARIANTS = {
    ALL: {
        gameLife: ['#9095FF', '#DBA1FF', '#8CF7FF'],
        modern: ['#A1B2FF', '#D6A1FF', '#FFE9A1'],
        analog: ['#B6B8FF', '#FFB8DB', '#B8FFFF'],
        naturalTones: ['#A1FFC3', '#A1DBFF', '#FFA1A1'],
        dynamic: ['#FF8CCF', '#FFDB8C', '#8CFFBF']
    },
    DARK: {
        volcanic: ['#FAD88E', '#FFB56C', '#FF9494'],
        abyss: ['#4BDEFF', '#82AAFF', '#636BFF']
    },
    LIGHT: {}
};

/**
 * @typedef {keyof typeof THEMES} ThemeName
 * @typedef {keyof typeof THEMES[ThemeName]} ThemeTypes
 * @typedef {keyof typeof THEMES[ThemeName]['Color']} ThemeColor
 * @typedef {keyof typeof THEMES[ThemeName]['Text']} ThemeText
 * @typedef {keyof typeof THEMES[ThemeName]['Rarity']} ThemeRarity
 * @typedef {keyof typeof THEME_VARIANTS} ThemeVariantType
 * @typedef {keyof typeof THEME_VARIANTS['ALL']} ThemeDefaultVariantKeys
 * @typedef {keyof typeof THEME_VARIANTS['DARK']} ThemeVariantDarkKeys
 * @typedef {keyof typeof THEME_VARIANTS['LIGHT']} ThemeVariantLightKeys
 * @typedef {ThemeDefaultVariantKeys | ThemeVariantDarkKeys | ThemeVariantLightKeys} ThemeVariantAllKeys
 * @typedef {import('@oxyfoo/gamelife-types/Global/Rarities').Rarities} Rarities
 */

class ThemeManager {
    _listeners = new Map();

    /**
     * @description Default value of theme
     * @type {ThemeName}
     * @default 'DARK'
     */
    selectedTheme = 'DARK';

    /**
     * @description Default value for variant of theme
     * @type {ThemeVariantAllKeys}
     * @default 'gameLife'
     */
    selectedThemeVariant = 'gameLife';

    /**
     * @description All variants available via the selected theme
     */
    get variants() {
        return {
            ...THEME_VARIANTS.ALL,
            ...THEME_VARIANTS[this.selectedTheme]
        };
    }

    /**
     * @description All variant keys available through the selected theme
     */
    get variantsKeys() {
        return /** @type {(keyof this['variants'])[]} */ ([...new Set(Object.keys(this.variants))]);
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
     * @description Define the theme
     * @param {ThemeName} themeName
     * @returns {boolean} True if theme is valid
     */
    setTheme(themeName) {
        if (this.isTheme(themeName)) {
            this.selectedTheme = themeName;
            this.colors = THEMES[themeName];
            this._emit('theme', themeName);

            return true;
        }

        return false;
    }

    /** @param {ThemeVariantAllKeys} variantName */
    setVariant = (variantName) => {
        if (!this.variantsKeys.includes(variantName)) {
            variantName = 'gameLife';
        }

        this.selectedThemeVariant = variantName;

        const variant = this.variants[this.selectedThemeVariant];
        if (!variant) return;

        const [color1, color2, color3] = variant;

        THEMES[this.selectedTheme].Color.main1 = color1;
        THEMES[this.selectedTheme].Color.main2 = color2;
        THEMES[this.selectedTheme].Color.main3 = color3;

        this._emit('variant', variantName);
    };

    /**
     * @description Get the theme color by name (or return the color if already hex color)
     * @param {ThemeColor | ThemeText | ThemeRarity} color Color name or hexadecimal color
     * @param {Object} [params] Parameters
     * @param {number} [params.opacity=1] Opacity of color, between 0 and 1
     * @param {number} [params.luminance=1] Luminance of color, between 0 and 1
     * @param {ThemeName} [params.themeName] Theme name (if not defined, use current theme)
     * @param {ThemeTypes} [params.type] Type of theme (if not defined, defined automatically)
     * @returns {string} Hex color (or same color than input if not found and not hex)
     */
    GetColor(color, params = {}) {
        // Define parameters
        const param = {
            opacity: 1,
            luminance: 1,
            themeName: null,
            type: null,
            ...params
        };

        const themeName = param.themeName || this.selectedTheme;

        if (!this.isTheme(themeName)) {
            return color;
        }

        const theme = THEMES[themeName];
        const THEME_KEYS = /** @type {(ThemeTypes)[]} */ (Object.keys(theme));

        for (const type of THEME_KEYS) {
            const themeType = theme[type];

            if (param.type !== null && param.type !== type) {
                continue;
            }

            if (!themeType.hasOwnProperty(color)) {
                continue;
            }

            const _color = /** @type {any} */ (themeType)[color];

            let _newColor = this.ApplyOpacity(_color, param.opacity);
            _newColor = this.applyLuminance(_color, param.luminance);

            if (_newColor !== null) {
                return _newColor;
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
     * @description Apply luminance to a color (hex to hex)
     * @param {string} hexColor Hex color
     * @param {number} [luminance=1] Luminance of color, between 0 and 1
     * @returns {string?} Hex color (or null if not hex color)
     */
    applyLuminance(hexColor, luminance = 1) {
        if (!hexColor || !hexColor.startsWith('#') || hexColor.length < 4) {
            return null;
        }

        if (luminance === 1) {
            return hexColor;
        }

        let hex = hexColor.slice(1);
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((char) => char + char)
                .join('');
        }

        const newColor = [0, 1, 2]
            .map((i) => {
                const channel = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
                const adjusted = Math.min(255, Math.max(0, Math.round(channel * luminance)));
                return adjusted.toString(16).padStart(2, '0');
            })
            .join('');

        return `#${newColor}`;
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

    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    subscribe(eventName, callback) {
        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, new Set());
        }

        this._listeners.get(eventName).add(callback);
    }

    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    unsubscribe(eventName, callback) {
        if (this._listeners.has(eventName)) {
            this._listeners.get(eventName).delete(callback);
        }
    }

    /**
     * @param {string} eventName
     * @param {any} value
     */
    _emit(eventName, value) {
        if (this._listeners.has(eventName)) {
            // @ts-ignore
            this._listeners.get(eventName).forEach((cb) => cb(value));
        }
    }
}

export const themeManager = new ThemeManager();

/**
 * @deprecated
 * @description Utility function to force component reload when a variant theme changes
 * @param {any} WrappedComponent
 */
export const withThemeForceUpdate = (WrappedComponent) => {
    return class extends Component {
        wrappedRef = createRef();

        onThemeChanged = () => {
            if (this.wrappedRef.current) {
                this.wrappedRef.current.forceUpdate();
            }
        };

        componentDidMount() {
            themeManager.subscribe('variant', this.onThemeChanged);
        }

        componentWillUnmount() {
            themeManager.unsubscribe('variant', this.onThemeChanged);
        }

        render() {
            return <WrappedComponent ref={this.wrappedRef} {...this.props} />;
        }
    };
};

export default themeManager;

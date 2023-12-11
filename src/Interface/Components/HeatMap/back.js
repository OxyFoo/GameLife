import * as React from 'react';

import langManager from 'Managers/LangManager';

import { Svg, Path, Text, Defs, LinearGradient, Stop } from 'react-native-svg';


/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const HeatMapProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Object} */
    yearData: {},

    /** @type {number} */
    numberOfCellsOnColumn: 1,
}

class HeatMapBack extends React.Component {

}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;
import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {Object} HeatMapDataType
 * @property {number} level Between 0 and 1
 * @property {ThemeText | ThemeColor} backgroundColor Background color with level as opacity
 * @property {ThemeText | ThemeColor} [borderColor] Border color with level as opacity
 *
 * @typedef {Object} HeatMapPropsType
 * @property {StyleProp} style
 * @property {Array<HeatMapDataType>} data Array of activity levels between 0 and 1, or -1 for no data
 * @property {number} gridSize
 * @property {number} borderSize
 */

/** @type {HeatMapPropsType} */
const HeatMapProps = {
    style: {},
    data: [],
    gridSize: 5,
    borderSize: 1.2
};

class HeatMapBack extends React.Component {
    /** @param {HeatMapProps} nextProps */
    shouldComponentUpdate(nextProps) {
        if (nextProps.gridSize !== this.props.gridSize) {
            return true;
        }

        if (nextProps.data !== this.props.data || nextProps.data.length !== this.props.data.length) {
            return true;
        }

        for (let i = 0; i < nextProps.data.length; i++) {
            if (
                nextProps.data[i].level !== this.props.data[i].level ||
                nextProps.data[i].borderColor !== this.props.data[i].borderColor ||
                nextProps.data[i].backgroundColor !== this.props.data[i].backgroundColor
            ) {
                return true;
            }
        }

        return false;
    }
}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;

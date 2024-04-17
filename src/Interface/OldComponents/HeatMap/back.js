import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const HeatMapProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Array<number>} */
    data: [],

    /** @type {number} */
    gridSize: 5
};

/** Number of different color levels */
const LEVELS = 7;

class HeatMapBack extends React.Component {
    /** @param {HeatMapProps} nextProps */
    shouldComponentUpdate(nextProps) {
        if (nextProps.gridSize !== this.props.gridSize) {
            return true;
        }

        if (nextProps.data.length !== this.props.data.length) {
            return true;
        }

        for (let i = 0; i < nextProps.data.length; i++) {
            if (nextProps.data[i] !== this.props.data[i]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Green color with varying intensity
     * @param {number} level 
     * @returns {string} Returns a color string
     */
    activityLevelToColor (level) {
        const colorLevel = Math.floor((255 * level) / (LEVELS - 1));
        return `rgb(0, ${colorLevel}, 0)`;
    }
}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;

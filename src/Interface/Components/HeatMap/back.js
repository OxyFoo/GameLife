import * as React from 'react';
import { View } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 */

const HeatMapProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Object} */
    data: {},

    /** @type {number} */
    gridSize: 5
}

const LEVELS = 7; // Number of different color levels

class HeatMapBack extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {

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

    activityLevelToColor (level) {
        const colorLevel = Math.floor((255 * level) / (LEVELS - 1));
        return `rgb(0, ${colorLevel}, 0)`; // Green color with varying intensity
    };

}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;
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
const WEEKS = 52; // Number of weeks in a year

class HeatMapBack extends React.Component {

    state = {
        styleCell: {
            height: 5,
            width: 5,
            margin: 1,
        },

        /** @type {number[]} */
        dataToDisplay: []
    }

    componentDidMount() {
        this.compute();
    }

    shouldComponentUpdate(nextProps, nextState) {

        // lui si je le met pas, j'ai rien au premier rendering, enfin genre un élément vide quoi 
        if (nextState.dataToDisplay.length !== this.state.dataToDisplay.length) {
            return true;
        }

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

    componentDidUpdate(prevProps, prevState) {
        this.compute();
    }

    activityLevelToColor = (level) => {
        const colorLevel = Math.floor((255 * level) / (LEVELS - 1));
        return `rgb(0, ${colorLevel}, 0)`; // Green color with varying intensity
    };

    compute() {
        const { data, gridSize } = this.props;
        const styleCell = {
            height: gridSize,
            width: gridSize,
            margin: gridSize / 5,
        }

        // Du coup si je calcule le dataToDisplay ici, il n'y a plus de décalage. 
        const dataToDisplay = data.map((weekLevel, i) => (
            <View
                key={i}
                style={[
                    styleCell,
                    { backgroundColor: this.activityLevelToColor(weekLevel) },
                ]}
            />
        ))

        this.setState({ styleCell, dataToDisplay });
    }
}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;
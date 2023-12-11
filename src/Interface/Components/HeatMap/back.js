import * as React from 'react';
import { View } from 'react-native';

import langManager from 'Managers/LangManager';

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
    gridSize: 10,
}

class HeatMapBack extends React.Component {

    state = {
        styleCell: {
            height: 5,
            width: 5,
            margin: 1,
        },

        dataToDisplay: null
    }

    LEVELS = 7; // Number of different color levels
    WEEKS = 52; // Number of weeks in a year

    getColor (level) {
        const colorLevel = Math.floor((255 * level) / (this.LEVELS - 1));
        return `rgb(0, ${colorLevel}, 0)`; // Green color with varying intensity
    };

    compute() {
        const { yearData, gridSize } = this.props;

        const styleCell = {
            height: gridSize,
            width: gridSize,
            margin: gridSize / 5,
        }

        console.log(styleCell)

        let dataToDisplay = 
            yearData.map((weekLevel, i) => (
                <View
                    key={i}
                    style={[
                        this.state.styleCell,
                        { backgroundColor: this.getColor(weekLevel) },
                    ]}
                />
            ))
        ;

        this.setState({ styleCell, dataToDisplay });
    }

    componentDidMount() {
        this.compute();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.yearData !== this.props.yearData || nextState.styleCell !== this.state.styleCell;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.yearData !== this.props.yearData) {
            this.compute();
        }
    }
}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;
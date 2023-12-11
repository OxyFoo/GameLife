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
    gridSize: 10,
}

class HeatMapBack extends React.Component {

    state = {
        styleCell: {
            height: 5,
            width: 5,
            margin: 1,
        }
    }

    compute() {
        const { yearData, gridSize } = this.props;
        const styleCell = {
            height: gridSize,
            width: gridSize,
            margin: gridSize / 5,
        }
        this.setState({ styleCell });
    }

    componentDidMount() {
        this.compute();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.yearData !== this.props.yearData || nextState.styleCell !== this.state.styleCell;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.yearData !== this.props.yearData ) {
            this.compute();
        }
    }
}

HeatMapBack.prototype.props = HeatMapProps;
HeatMapBack.defaultProps = HeatMapProps;

export default HeatMapBack;
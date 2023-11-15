import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {{date:string, value:number}[]} */
    data: [],

    /** @type {ColorTheme|ColorThemeText} */
    lineColor: 'black',

    /** @type {number} */
    graph_height: 200,
}

class LineChartSvgBack extends React.Component {

    state = {
        layoutWidth: 0,
        maxValue: 0,
        points: [],
        yAxisValues: null,
    }
    leftMargin = 40;

    firstDate = null;
    lastDate = null;

    // Calculate the y-coordinate in pixels based on graph_height
    scaleY = (value, maxValue) => (value / maxValue) * (this.props.graph_height - 20);

    // Create 5 values for Y axis (0, max, and 3 intermediaries)
    getYAxisValues = (maxValue) => {
        const step = maxValue / 4;
        return [0, step, 2 * step, 3 * step, maxValue];
    };

    // Calculate the x-coordinate in pixels based on layoutWidth
    getXCoordinate = (index, arrayLength, layoutWidth) => {
        const spacing = (layoutWidth - this.leftMargin * 1.1) / (arrayLength - 1);
        return this.leftMargin + (index * spacing);
    };

    onLayout(layoutWidth) {
        this.compute(layoutWidth);
    }

    compute(layoutWidth) {

        const maxValue = Math.max(...this.props.data.map(d => d.value)) * 1.05; // Increase max value for padding
        const yAxisValues = this.getYAxisValues(maxValue);

        const points = this.props.data.map((item, index) => {
            const x = this.getXCoordinate(index, this.props.data.length, layoutWidth); // Get the x-coordinate in pixels
            const y = this.props.graph_height - this.scaleY(item.value, maxValue);  // Calculate the y-coordinate
            return `${x},${y}`; // Return the coordinate pair
        }).join(' ');

        if (Array.isArray(this.props.data) && this.props.data.length > 1) {
            this.firstDate = this.props.data[0].date;
            this.lastDate = this.props.data[this.props.data.length - 1].date;
        }

        this.setState({ maxValue: maxValue, points: points, yAxisValues: yAxisValues, layoutWidth: layoutWidth });
    }

}

LineChartSvgBack.prototype.props = InputProps;
LineChartSvgBack.defaultProps = InputProps;

export default LineChartSvgBack;

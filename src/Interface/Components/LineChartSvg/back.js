import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const LineChartSvgProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {{date:string, value:number}[]} */
    data: [],

    /** @type {ColorTheme|ColorThemeText} */
    lineColor: 'black',

    /** @type {number} */
    graphHeight: 200
}

class LineChartSvgBack extends React.Component {
    state = {
        layoutWidth: 0,
        maxValue: 0,
        points: '',
        yAxisValues: null
    };

    leftMargin = 40;
    firstDate = null;
    lastDate = null;

    /** @description Calculate the y-coordinate in pixels based on graphHeight */
    scaleY = (value, maxValue) => (value / maxValue) * (this.props.graphHeight - 20);

    /** @description Create 5 values for Y axis (0, max, and 3 intermediaries) */
    getYAxisValues = (maxValue) => {
        const step = maxValue / 4;
        return [0, step, 2 * step, 3 * step, maxValue];
    };

    /** @description Calculate the x-coordinate in pixels based on layoutWidth */
    getXCoordinate = (index, arrayLength, layoutWidth) => {
        if (arrayLength === 1) return this.leftMargin * 1.5;
        const spacing = (layoutWidth - this.leftMargin * 1.1) / (arrayLength - 1);
        return this.leftMargin + (index * spacing);
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        this.compute(width);
    }

    /** @param {number} layoutWidth */
    compute(layoutWidth) {
        let maxValue = 100;
        if (this.props.data.length > 0) {
            maxValue = Math.max(...this.props.data.map(d => d.value)) * 1.05; 
        }

        const yAxisValues = this.getYAxisValues(maxValue);

        const points = this.props.data.map((item, index) => {
            const x = this.getXCoordinate(index, this.props.data.length, layoutWidth); // Get the x-coordinate in pixels
            const y = this.props.graphHeight - this.scaleY(item.value, maxValue);  // Calculate the y-coordinate
            return `${x},${y}`; // Return the coordinate pair for SVG polyline
        }).join(' ');

        if (Array.isArray(this.props.data) && this.props.data.length > 1) {
            this.firstDate = this.props.data[0].date;
            this.lastDate = this.props.data[this.props.data.length - 1].date;
        }

        this.setState({ maxValue, points, yAxisValues, layoutWidth });
    }
}

LineChartSvgBack.prototype.props = LineChartSvgProps;
LineChartSvgBack.defaultProps = LineChartSvgProps;

export default LineChartSvgBack;
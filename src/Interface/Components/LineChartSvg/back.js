import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {{date:string, value:number}[]} */
    data: [],

    /** @type {string} */
    lineColor: "#000000",

    /** @type {number} */
    graph_height: 200,
}

class LineChartSvgBack extends React.Component {

    state = {
        layoutWidth: 0,
        maxValue: 0,
        points: [],
        yAxisValues: null,
        dataReady: false
    }
    svgRef = React.createRef();
    left_margin = 40;


    // Calculate the y-coordinate in pixels based on graph_height
    scaleY = (value, maxValue) => (value / maxValue) * (this.props.graph_height - 20);

    // Create 5 values for Y axis (0, max, and 3 intermediaries)
    getYAxisValues = (maxValue) => {
        const step = maxValue / 4;
        return [0, step, 2 * step, 3 * step, maxValue];
    };

    // Calculate the x-coordinate in pixels based on layoutWidth
    getXCoordinate = (index, arrayLength) => {
        const layoutWidth = this.state.layoutWidth;
        const spacing = (layoutWidth - this.left_margin * 1.1) / (arrayLength - 1);
        return this.left_margin + (index * spacing);
    };

    compute() {

        const maxValue = Math.max(...this.props.data.map(d => d.value)) * 1.05; // Increase max value for padding
        const yAxisValues = this.getYAxisValues(maxValue);

        const points = this.props.data.map((item, index) => {
            const x = this.getXCoordinate(index, this.props.data.length); // Get the x-coordinate in pixels
            const y = this.props.graph_height - this.scaleY(item.value, maxValue);  // Calculate the y-coordinate
            return `${x},${y}`; // Return the coordinate pair
        }).join(' ');

        this.setState({maxValue: maxValue, points: points, yAxisValues: yAxisValues});
    }

    // Only re-compute if layoutWidth has changed
    componentDidUpdate(prevProps, prevState) {
        if (prevState.layoutWidth !== this.state.layoutWidth) {
            this.compute();
            this.setState({dataReady: true});
        }
    }


}

LineChartSvgBack.prototype.props = InputProps;
LineChartSvgBack.defaultProps = InputProps;

export default LineChartSvgBack;

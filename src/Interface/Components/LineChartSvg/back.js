import * as React from 'react';
import { lttbDownsample } from './downsample';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const LineChartSvgProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {{ date:string, value:number }[]} */
    data: [],

    /** @type {ThemeColor | ThemeText} */
    lineColor: 'black',

    /** @type {number} */
    graphHeight: 200,

    /** @type {boolean} */
    isAreaChart: false,

    /** @type {boolean} - If true, applies LTTB downsampling algorithm to reduce points */
    enableDownsampling: false,

    /** @type {number} - Maximum number of points after downsampling (only used if enableDownsampling is true) */
    downsamplingMaxPoints: 40,

    /** @type {number} Smoothness factor for curve (0 = straight lines, 0.5 = default/recommended, 1 = very smooth) */
    smoothness: 0.5
};

class LineChartSvgBack extends React.Component {
    state = {
        layoutWidth: 0,
        maxValue: 0,

        /** @type {{ x: number, y: number }[]} */
        points: [],

        /** @type {number[]} */
        yAxisValues: []
    };

    leftMargin = 40;

    /** @type {string | null} */
    firstDate = null;

    /** @type {string | null} */
    lastDate = null;

    /**
     * @description Calculate the y-coordinate in pixels based on graphHeight
     * @param {number} value
     * @param {number} maxValue
     */
    scaleY = (value, maxValue) => (value / maxValue) * (this.props.graphHeight - 20);

    /**
     * @description Create 5 values for Y axis (0, max, and 3 intermediaries)
     * @param {number} maxValue
     */
    getYAxisValues = (maxValue) => {
        const step = maxValue / 4;
        return [0, step, 2 * step, 3 * step, maxValue];
    };

    /**
     * @description Calculate the x-coordinate in pixels based on layoutWidth
     * @param {number} index
     * @param {number} arrayLength
     * @param {number} layoutWidth
     */
    getXCoordinate = (index, arrayLength, layoutWidth) => {
        if (arrayLength === 1) return this.leftMargin * 1.5;
        const spacing = (layoutWidth - this.leftMargin * 1.1) / (arrayLength - 1);
        return this.leftMargin + index * spacing;
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        this.compute(width);
    };

    /**
     * @param {typeof LineChartSvgProps} prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data && this.state.layoutWidth > 0) {
            this.compute(this.state.layoutWidth);
        }
    }

    /** @param {number} layoutWidth */
    compute(layoutWidth) {
        const { enableDownsampling, data, downsamplingMaxPoints, graphHeight } = this.props;

        // Apply LTTB downsampling (no-op if data.length <= downsamplingMaxPoints)
        const processedData = enableDownsampling ? lttbDownsample(data, downsamplingMaxPoints) : data;

        let maxValue = 100;
        if (processedData.length > 0) {
            const dataMax = processedData.reduce((max, d) => Math.max(max, d.value), 0);
            maxValue = Math.max(dataMax * 1.05, 1); // Minimum of 1 to avoid division by 0
        }

        const yAxisValues = this.getYAxisValues(maxValue);

        const points = processedData.map((item, index) => {
            const x = this.getXCoordinate(index, processedData.length, layoutWidth);
            const y = graphHeight - this.scaleY(item.value, maxValue);
            return { x, y };
        });

        if (Array.isArray(processedData) && processedData.length > 1) {
            this.firstDate = processedData[0].date;
            this.lastDate = processedData[processedData.length - 1].date;
        }

        this.setState({ maxValue, points, yAxisValues, layoutWidth });
    }
}

LineChartSvgBack.prototype.props = LineChartSvgProps;
LineChartSvgBack.defaultProps = LineChartSvgProps;

export default LineChartSvgBack;

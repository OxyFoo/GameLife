import React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {object} UpdatingData
 * @property {number} id
 * @property {number} value
 * @property {string} name
 * @property {number} valueMinutes
 * @property {string} color Hexadecimal color code
 * @property {string} gradientCenterColor Hexadecimal color code for gradient center
 *
 * @typedef {{ id: number, value: number, name: string }} FocusedActivity
 *
 * @typedef {object} PieChartProps
 * @param {StyleProp} style Style for the pie chart container
 * @property {Array<UpdatingData>} data Array of data to display in the pie chart
 * @property {boolean} isDonutView True to display donut chart, false for flat list
 * @property {FocusedActivity | null} focusedActivity Currently focused activity, null if none
 * @property {ThemeColor | ThemeText} insideBackgroundColor Background color for the inside of
 */

/** @typedef {PieChartProps} */
const PieChartProps = {
    style: /** @type {StyleProp} */ ({}),
    data: /** @type {Array<UpdatingData>} */ ([]),
    isDonutView: true,
    focusedActivity: /** @type {FocusedActivity | null} */ (null),
    insideBackgroundColor: /** @type {ThemeColor | ThemeText} */ ('dataBigKpi')
};

class BackPieChart extends React.Component {
    /**
     * Converts the data format to our custom DonutChart format
     * @param {Array<UpdatingData>} data - The original data array
     * @returns {Array<{label: string, value: number, stroke: string}>} Converted data for DonutChart
     */
    convertDataForDonutChart = (data) => {
        return data
            .filter((item) => item.value > 0) // Filter out items with 0 value
            .map((item) => ({
                label: item.name || 'Unknown',
                value: item.value,
                stroke: item.color || '#000000'
            }));
    };
}

BackPieChart.prototype.props = PieChartProps;
BackPieChart.defaultProps = PieChartProps;

export default BackPieChart;

import React from 'react';

/**
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {object} UpdatingData
 * @property {number} id
 * @property {number} value
 * @property {string} name
 * @property {number} valueMinutes
 * @property {string} color
 * @property {string} gradientCenterColor
 *
 * @typedef {object} itemType // object from lib gifted-charts
 * @typedef {{ id: number, value: number, name: string }} FocusedActivity
 */

const PieChartProps = {
    /** @type {Array<UpdatingData>} */
    data: [],

    /** @type {boolean} True to display donut chart, false for flat list */
    isDonutView: true,

    /** @type {FocusedActivity | null} */
    focusedActivity: null,

    /** @type {FocusedActivity | null} */
    focusedActivityFullDay: null,

    /** @type {ThemeColor | ThemeText} */
    insideBackgroundColor: 'dataBigKpi'
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

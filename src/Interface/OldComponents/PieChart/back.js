import React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Interface/Widgets/TodayPieChart/back').UpdatingData} UpdatingData
 *
 * @typedef {Object} itemType // object from lib gifted-charts
 * @typedef {{ id: number, value: number, name: string }} FocusedActivity
 */

const PieChartProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Array<UpdatingData>} */
    data: [],

    /** @type {FocusedActivity | null} */
    focusedActivity: null,

    /** @type {FocusedActivity | null} */
    focusedActivityFullDay: null,

    /** @type {ThemeColor | ThemeText} */
    insideBackgroundColor: 'dataBigKpi'
};

class BackPieChart extends React.Component {}

BackPieChart.prototype.props = PieChartProps;
BackPieChart.defaultProps = PieChartProps;

export default BackPieChart;

import React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';

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

    /** @type {Array<UpdatingData>} */
    dataFullDay: [],

    /** @type {FocusedActivity | null} */
    focusedActivity: null,

    /** @type {boolean} */
    switched: false,

    /** @type {number} */
    layoutWidth: 0,

    /** @type {ThemeColor | ThemeText} */
    insideBackgroundColor: 'dataBigKpi'
};

class BackPieChart extends React.Component {
    state = {
        animSwitch: new Animated.Value(0)
    }

    componentDidUpdate(prevProps) {
        SpringAnimation(this.state.animSwitch, this.props.switched ? 1 : 0).start();
    }
}

BackPieChart.prototype.props = PieChartProps;
BackPieChart.defaultProps = PieChartProps;

export default BackPieChart;

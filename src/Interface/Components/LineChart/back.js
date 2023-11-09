import * as React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';

import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {{activity:string, date:string, value:number}} DataPoint
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    chartWidth: 300,

    /** @type {number} */
    skillID: 0,

    /** @type {{date:string, value:number}[]}*/
    data: null,

    /** @type {number} */
    maxVal: 0,

    /** @type {number} */
    spacing: 0
}

class LineChartBack extends React.Component {

}

LineChartBack.prototype.props = InputProps;
LineChartBack.defaultProps = InputProps;

export default LineChartBack;
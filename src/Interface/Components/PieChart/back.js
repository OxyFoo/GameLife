import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {{ name: string, color:string, value: number }} Item
 * @typedef {{ id: number, valueMin: number, color: string }} ItemBase
 * @typedef {{ id: number, value: number, name: string }} FocusedActivity
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ItemBase[]} */
    data: [],

    /** @type {FocusedActivity|null} */
    focusedActivity: null
}

class PieChartBack extends React.Component {
}

PieChartBack.prototype.props = InputProps;
PieChartBack.defaultProps = InputProps;

export default PieChartBack;

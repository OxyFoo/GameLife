import * as React from 'react';

import user from 'Managers/UserManager';
import { GetTime } from 'Utils/Time';
import dataManager from 'Managers/DataManager';

/**
 * @typedef {import('./index').ItemBase} ItemBase
 * @typedef {import('./index').Item} Item
 * @typedef {import('./index').focusedActivity} focusedActivity
 * 
 * @typedef {import('react-native').ViewStyle} ViewStyle
 *  @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {ItemBase[]} */
    data: [],

    /** @type {focusedActivity} */
    focusedActivity: {},
}

class PieChartBack extends React.Component {

    state = {
        dataToDisplay: [],
        focusedActivity: {},
    }

    componentDidMount() {
        this.setState({ 
            dataToDisplay: this.props.data, 
            focusedActivity: this.props.focusedActivity 
        });
    }
}

PieChartBack.prototype.props = InputProps;
PieChartBack.defaultProps = InputProps;

export default PieChartBack;

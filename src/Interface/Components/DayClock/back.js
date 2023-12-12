import * as React from 'react';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {'normal' | 'full' | 'filling' | 'disabled'} DayClockStates
 */

const DayClockProps = {
    /** @type {StyleViewProp} */
    style: {},

    /** @type {number} [0,6] */
    day: 0,

    /** @type {DayClockStates} */
    state: 'normal',

    /** @type {number} Ratio of filling [0,1] */
    fillingValue: 0
};

class BackDayClock extends React.Component {
}

BackDayClock.prototype.props = DayClockProps;
BackDayClock.defaultProps = DayClockProps;

export default BackDayClock;

import * as React from 'react';
/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {string} */
    title: '',

    /** @type {number} */
    value: 0,

    /** @type {string} */
    unit: '',
}

class KPIBack extends React.Component {

}

KPIBack.prototype.props = InputProps;
KPIBack.defaultProps = InputProps;

export default KPIBack;
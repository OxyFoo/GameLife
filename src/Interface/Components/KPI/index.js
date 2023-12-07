import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import Text from '../Text';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const KPIProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    height: 100,

    /** @type {string} */
    title: '',

    /** @type {number} */
    value: 0,

    /** @type {string} */
    unit: ''
};

class KPI extends React.Component {
    render() {
        const primaryText = `${this.props.value} ${this.props.unit}`;
        const secondaryText = this.props.title;
        const kpiBackground = {
            backgroundColor: themeManager.GetColor('dataSmallKpi')
        };
        const kpiSize = {
            height: this.props.height
        };

        return (
            <View style={[kpiBackground, this.props.style, styles.container, kpiSize]}>
                <Text style={styles.value} color='primary' fontSize={30}>{primaryText}</Text>
                <Text style={styles.title} color='light' fontSize={15}>{secondaryText}</Text>
            </View>
        )
    }
}

KPI.prototype.props = KPIProps;
KPI.defaultProps = KPIProps;

export default KPI;

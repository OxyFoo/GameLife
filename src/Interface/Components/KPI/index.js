import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const KPIProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {string} */
    title: '',

    /** @type {number} */
    value: 0,

    /** @type {string} */
    unit: ''
}

class KPI extends React.Component {
    render() {
        const primaryText = `${this.props.value} ${this.props.unit}`;
        const secondaryText = this.props.title;
        const kpiBackground = {
            backgroundColor: themeManager.GetColor('dataSmallKpi')
        };

        return (
            <View style={[kpiBackground, this.props.style, styles.container]}>
                <Text style={styles.value} color='primary' fontSize={30}>{primaryText}</Text>
                <Text style={styles.title} color='light' fontSize={15}>{secondaryText}</Text>
            </View>
        )
    }
}

KPI.prototype.props = KPIProps;
KPI.defaultProps = KPIProps;

export default KPI;
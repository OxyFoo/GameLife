import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager'

import { Text } from 'Interface/Components';

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

class KPI extends React.Component {
    render() {
        const kpiBackground = {
            backgroundColor: themeManager.GetColor('dataSmallKpi')
        };

        return (
            <View style={[kpiBackground, this.props.style, styles.container]}>
                <Text style={styles.value} color='primary' fontSize={30}>{this.props.value} {this.props.unit}</Text>
                <Text style={styles.title} color='light' fontSize={15}>{this.props.title}</Text>
            </View>
        )
    }
}

KPI.prototype.props = InputProps;
KPI.defaultProps = InputProps;

export default KPI;
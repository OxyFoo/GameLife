import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import KPIBack from './back';

import { Text } from 'Interface/Components';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 */

class KPI extends KPIBack {
    render() {
        const kpi_background = themeManager.GetColor('da_kpi');

        return (
            <View style={[this.props.style, styles.container, {backgroundColor:kpi_background}]}>
                <Text style={styles.value}>{this.props.value} {this.props.unit}</Text>
                <Text style={styles.title}>{this.props.title}</Text>
            </View>
        )
    }
}

export default KPI;
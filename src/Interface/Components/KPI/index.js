import * as React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Text } from '../Text';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {Object} KPIPropsType
 * @property {StyleProp} style
 * @property {StyleProp} containerStyle
 * @property {string} title
 * @property {string | number} value
 */

/** @type {KPIPropsType} */
const KPIProps = {
    style: {},
    containerStyle: {},
    title: '',
    value: 0
};

class KPI extends React.Component {
    render() {
        const { title, value } = this.props;

        return (
            <LinearGradient
                style={[styles.gradient, this.props.containerStyle]}
                colors={[
                    themeManager.GetColor('border', { opacity: 0.2 }),
                    themeManager.GetColor('border', { opacity: 0.06 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={[styles.container, this.props.style]}>
                    <Text style={styles.value} color='primary'>
                        {`${value}`}
                    </Text>
                    <Text style={styles.title} color='light'>
                        {title}
                    </Text>
                </View>
            </LinearGradient>
        );
    }
}

KPI.defaultProps = KPIProps;
KPI.prototype.props = KPIProps;

export { KPI };

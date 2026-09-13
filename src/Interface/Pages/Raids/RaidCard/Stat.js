import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { GradientView } from 'Interface/Primitives';
import { Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

/**
 * Small KPI of the raid card: label above the value (unlike `KPI`), optional right element and
 * optional content below (a progress bar)
 * @param {object} props
 * @param {StyleProp} [props.style]
 * @param {string} props.label
 * @param {string} props.value
 * @param {ThemeColor | ThemeText} [props.valueColor]
 * @param {boolean} [props.inline] Value on the label line, top right (stats carrying a progress bar)
 * @param {React.ReactNode} [props.right]
 * @param {React.ReactNode} [props.children]
 */
function Stat({ style, label, value, valueColor = 'primary', inline = false, right, children }) {
    return (
        <GradientView
            style={[styles.stat, style]}
            colors={[
                themeManager.GetColor('border', { opacity: 0.2 }),
                themeManager.GetColor('border', { opacity: 0.06 })
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            {inline ? (
                <View style={styles.statInlineRow}>
                    <Text style={styles.statLabel} fontSize={11} color='light'>
                        {label}
                    </Text>
                    <Text style={styles.statInlineValue} fontSize={12} color={valueColor} bold>
                        {value}
                    </Text>
                </View>
            ) : (
                <>
                    <Text style={styles.statLabel} fontSize={11} color='light'>
                        {label}
                    </Text>
                    <View style={styles.statValueRow}>
                        <Text style={styles.statValue} fontSize={16} color={valueColor} bold>
                            {value}
                        </Text>
                        {right}
                    </View>
                </>
            )}
            {children}
        </GradientView>
    );
}

export { Stat };

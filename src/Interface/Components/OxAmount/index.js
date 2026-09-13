import * as React from 'react';
import { View } from 'react-native';

import styles from './style';

import { Text } from '../Text';
import { Icon } from '../Icon';

/**
 * @typedef {import('react-native').StyleProp<import('react-native').ViewStyle>} StyleProp
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

/**
 * An amount of ox: the number followed by the ox logo, like the shop badge.
 * @param {object} props
 * @param {number} props.value Amount, shown with its sign when `signed` is true
 * @param {boolean} [props.signed] Prefix the amount with '+' or '−' (a change, not a balance)
 * @param {number} [props.fontSize]
 * @param {number} [props.iconSize] Defaults to the font size
 * @param {ThemeColor | ThemeText} [props.color]
 * @param {boolean} [props.bold]
 * @param {StyleProp} [props.style]
 * @returns {React.JSX.Element}
 */
const OxAmount = ({ value, signed = false, fontSize = 16, iconSize, color = 'primary', bold = false, style = {} }) => {
    const text = signed ? `${value < 0 ? '−' : '+'} ${Math.abs(value)}` : value.toString();

    return (
        <View style={[styles.parent, style]}>
            <Text fontSize={fontSize} color={color} bold={bold}>
                {text}
            </Text>
            <Icon style={styles.icon} icon='ox' size={iconSize ?? fontSize} />
        </View>
    );
};

export { OxAmount };

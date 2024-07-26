import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {object} PageHeaderPropsType
 * @prop {StyleProp} style
 * @prop {string | null} title
 * @prop {(event: GestureResponderEvent) => void} onBackPress
 * @prop {IconsName} [secondaryIcon]
 * @prop {ThemeColor | ThemeText | 'gradient'} [secondaryIconColor]
 * @prop {(event: GestureResponderEvent) => void} [onSecondaryIconPress]
 */

/** @type {PageHeaderPropsType} */
const PageHeaderProps = {
    style: {},
    title: null,
    onBackPress: () => {},
    secondaryIcon: 'info-circle-outline',
    secondaryIconColor: 'white',
    onSecondaryIconPress: undefined
};

class PageHeader extends React.Component {
    render() {
        const {
            title,
            onBackPress,
            secondaryIcon: helpIcon,
            secondaryIconColor,
            onSecondaryIconPress: onHelpPress
        } = this.props;
        const text = title ?? langManager.curr['modal']['back'];

        return (
            <View style={[styles.header, onHelpPress && styles.headerWithIcon, this.props.style]}>
                <TouchableOpacity style={styles.headerLeft} activeOpacity={0.5} onPress={onBackPress}>
                    <Icon
                        style={styles.headerLeftArrow}
                        icon='arrow-square-outline'
                        color='gradient'
                        size={24}
                        angle={-90}
                    />

                    {title === null ? <Text fontSize={16}>{text}</Text> : <Text style={styles.text}>{text}</Text>}
                </TouchableOpacity>
                {onHelpPress && (
                    <Button
                        style={styles.secondaryButton}
                        appearance='uniform'
                        color='transparent'
                        onPress={(e) => onHelpPress(e)}
                    >
                        <Icon icon={helpIcon} color={secondaryIconColor} size={30} />
                    </Button>
                )}
            </View>
        );
    }
}

PageHeader.prototype.props = PageHeaderProps;
PageHeader.defaultProps = PageHeaderProps;

export { PageHeader };

import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {object} PageHeaderPropsType
 * @prop {StyleProp} style
 * @prop {string | null} title
 * @prop {(event: GestureResponderEvent) => void} onBackPress
 * @prop {(event: GestureResponderEvent) => void} [onHelpPress]
 */

/** @type {PageHeaderPropsType} */
const PageHeaderProps = {
    style: {},
    title: null,
    onBackPress: () => {},
    onHelpPress: undefined
};

class PageHeader extends React.Component {
    render() {
        const { title, onBackPress, onHelpPress } = this.props;
        const text = title ?? langManager.curr['modal']['back'];

        return (
            <View style={[styles.header, this.props.style]}>
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
                {onHelpPress && <Icon onPress={onHelpPress} icon='info-circle-outline' size={30} />}
            </View>
        );
    }
}

PageHeader.prototype.props = PageHeaderProps;
PageHeader.defaultProps = PageHeaderProps;

export { PageHeader };

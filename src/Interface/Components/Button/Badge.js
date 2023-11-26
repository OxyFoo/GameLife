import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import Icon from 'Interface/Components/Icon';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('Interface/Components/Icon/index').Icons} Icons
 * 
 * @typedef {'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'} JustifyContentStyle
 * 
 * @typedef {object} ButtonBadgeProps Use for import props in Button component as type
 * @property {ViewStyle} [style={}]
 * @property {Icons} [icon='default']
 * @property {JustifyContentStyle} [badgeJustifyContent='center']
 * @property {React.ReactNode} [children]
 * @property {() => void} [onPress]
 * @property {boolean} [loading=false]
 * @property {boolean} [disabled=false]
 */

/** @type {ButtonBadgeProps} */
const ButtonBadgeProps = {
    style: {},
    icon: 'default',
    badgeJustifyContent: 'center',
    children: undefined,
    onPress: undefined,
    loading: false,
    disabled: false
};

class ButtonBadge extends React.PureComponent {
    render() {
        const { icon, loading, disabled,
            badgeJustifyContent, children } = this.props;

        const styleOpacity = {
            opacity: disabled ? 0.5 : 1
        };
        const styleBadge = {
            justifyContent: badgeJustifyContent
        };
        const styleIconBackground = {
            backgroundColor: themeManager.GetColor(disabled ? 'backgroundGrey' : 'main2')
        };
        const styleBadgeBackground = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <View style={styles.content}>
                <View style={[styles.icon, styleIconBackground]}>
                    <Icon
                        style={[styleIconBackground, styleOpacity]}
                        icon={icon}
                        size={22}
                        color={'white'}
                    />
                </View>
                <View style={[styles.badge, styleBadge, styleOpacity, styleBadgeBackground]}>
                    {loading ? <Icon icon='loadingDots' /> : children}
                </View>
                <View style={[styles.badgeLink, styleOpacity, styleBadgeBackground]} />
            </View>
        );
    }
}

ButtonBadge.prototype.props = ButtonBadgeProps;
ButtonBadge.defaultProps = ButtonBadgeProps;

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    icon: {
        padding: 6,
        justifyContent: 'center',
        borderRadius: 8
    },
    badge: {
        flex: 1,
        marginVertical: 3,
        paddingHorizontal: 6,

        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,

        zIndex: -1,
        elevation: -1
    },
    badgeLink: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 12,
        width: 22,
        marginVertical: 3,

        zIndex: -2,
        elevation: -2
    }
});

export default ButtonBadge;

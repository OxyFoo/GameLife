import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('Interface/Components/Icon/index').Icons} Icons
 * 
 * @typedef {'flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly'} JustifyContentStyle
 */

const ButtonBadgeProps = {
    /** @type {ViewStyle} */
    style: {},

    /** @type {Icons} */
    icon: 'default',

    /** @type {JustifyContentStyle} */
    badgeJustifyContent: 'center',

    /** @type {React.ReactNode} */
    children: undefined,

    /** @type {() => void} */
    onPress: undefined,

    /** @type {boolean} */
    loading: false,

    /** @type {boolean} */
    disabled: false
}

class ButtonBadge extends React.PureComponent {
    render() {
        const { style, icon, badgeJustifyContent, children, onPress, loading, disabled } = this.props;

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
            <Button
                style={[styles.button, style]}
                color='transparent'
                rippleColor='ground1'
                onPress={onPress}
            >
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
            </Button>
        );
    }
}

ButtonBadge.prototype.props = ButtonBadgeProps;
ButtonBadge.defaultProps = ButtonBadgeProps;

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        height: 'auto',
        maxHeight: 48,
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 8
    },
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
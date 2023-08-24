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
    children: undefined
}

class ButtonBadge extends React.PureComponent {
    render() {
        const { style, icon, badgeJustifyContent, children } = this.props;

        const styleBadge = {
            justifyContent: badgeJustifyContent,
            backgroundColor: themeManager.GetColor('backgroundCard')
        };
        const styleIconBackground = {
            backgroundColor: themeManager.GetColor('main2')
        };
        const styleBadgeBackground = {
            backgroundColor: themeManager.GetColor('backgroundCard')
        };

        return (
            <Button
                style={[styles.button, style]}
                color='transparent'
                rippleColor='ground1'
            >
                <View style={styles.content}>
                    <View style={[styles.icon, styleIconBackground]}>
                        <Icon
                            style={styleIconBackground}
                            icon={icon}
                            size={24}
                            color={'white'}
                        />
                    </View>
                    <View style={[styles.badge, styleBadge, styleBadgeBackground]}>
                        {children}
                    </View>
                    <View style={[styles.badgeLink, styleBadgeBackground]} />
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
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 8
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    icon: {
        padding: 8,
        borderRadius: 8
    },
    badge: {
        flex: 1,
        marginVertical: 3,
        paddingHorizontal: 8,
        paddingLeft: 8,

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
        left: 24,
        width: 36,
        marginVertical: 3,

        zIndex: -2,
        elevation: -2
    }
});

export { ButtonBadgeProps };
export default ButtonBadge;

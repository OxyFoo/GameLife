import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import BackNotificationsInApp from './back';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

class NotificationsInAppButton extends BackNotificationsInApp {
    render() {
        const styleBellAnim = {
            transform: [
                { rotate: this.state.animBell.interpolate({
                    inputRange: [0, .33, .66, 1],
                    outputRange: ['0deg', '-15deg', '15deg', '0deg']
                }) }
            ]
        };

        return (
            <Button
                style={[styles.container, this.props.style]}
                rippleColor='white'
                onPress={this.openNotificationsHandler}
            >
                <Animated.View style={styleBellAnim}>
                    <Icon icon='bell' color='white' size={28} />
                </Animated.View>
                {this.renderBadge()}
            </Button>
        );
    }

    renderBadge = () => {
        const { notificationsCount } = this.state;

        if (notificationsCount <= 0) {
            return null;
        }

        const styleBadge = {
            backgroundColor: themeManager.GetColor('error', { opacity: .95 })
        };

        return (
            <View style={[styles.badge, styleBadge]}>
                <Text color='primary' fontSize={15}>
                    {notificationsCount.toString()}
                </Text>
            </View>
        );
    }
}

export default NotificationsInAppButton;

import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import BackNotificationsInApp from './back';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';

class NotificationsInAppButton extends BackNotificationsInApp {
    render() {
        const { multiState, notificationsCount } = this.state;

        if (multiState !== 'connected' || notificationsCount <= 0) {
            return null;
        }

        return (
            <Button
                style={[styles.container, this.props.style]}
                rippleColor='white'
                onPress={this.openNotificationsHandler}
            >
                <Icon icon='bell' color='white' size={28} />
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

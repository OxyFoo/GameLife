import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Class/Multiplayer').ConnectionState} ConnectionState
 * @typedef {import('Types/NotificationInApp').NotificationInApp} NotificationInApp
 */

const NotificationsInAppProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackNotificationsInApp extends React.Component {
    state = {
        animBell: new Animated.Value(0),

        /** @type {ConnectionState} */
        multiState: user.multiplayer.state.Get(),
        notificationsCount: user.multiplayer.notifications.Get().length
    }

    componentDidMount() {
        this.listenerState = user.multiplayer.state.AddListener(this.onMultiStateChange);
        this.listenerNotifications = user.multiplayer.notifications.AddListener(this.onNotificationsChange);
    }
    componentWillUnmount() {
        user.multiplayer.state.RemoveListener(this.listenerState);
        user.multiplayer.notifications.RemoveListener(this.listenerNotifications);
    }

    openNotificationsHandler = () => {
        user.interface.notificationsInApp.Open();

        // Bell animation
        TimingAnimation(this.state.animBell, 1, 500).start(() => {
            TimingAnimation(this.state.animBell, 0, 0).start()
        });
    }
    closeNotificationsHandler = () => {
        user.interface.notificationsInApp.Close();
    }

    /** @param {ConnectionState} multiState */
    onMultiStateChange = (multiState) => {
        this.setState({ multiState });

        // Close notifications if disconnected
        if (multiState !== 'connected') {
            this.closeNotificationsHandler();
        }
    }
    /** @param {Array<NotificationInApp>} notifications */
    onNotificationsChange = (notifications) => {
        this.setState({ notificationsCount: notifications.length });
    }
}

BackNotificationsInApp.prototype.props = NotificationsInAppProps;
BackNotificationsInApp.defaultProps = NotificationsInAppProps;

export default BackNotificationsInApp;

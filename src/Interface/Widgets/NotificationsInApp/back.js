import * as React from 'react';

import user from 'Managers/UserManager';

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
    }
    closeNotificationsHandler = () => {
        user.interface.notificationsInApp.Close();
    }

    /** @param {ConnectionState} multiState */
    onMultiStateChange = (multiState) => {
        this.setState({ multiState });
    }
    /** @param {Array<NotificationInApp>} notifications */
    onNotificationsChange = (notifications) => {
        this.setState({ notificationsCount: notifications.length });
    }
}

BackNotificationsInApp.prototype.props = NotificationsInAppProps;
BackNotificationsInApp.defaultProps = NotificationsInAppProps;

export default BackNotificationsInApp;

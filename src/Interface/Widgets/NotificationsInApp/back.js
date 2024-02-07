import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 */

const NotificationsInAppProps = {
    /** @type {StyleViewProp} */
    style: {}
};

class BackNotificationsInApp extends React.Component {
    state = {
        animBell: new Animated.Value(0),

        notificationsCount: user.multiplayer.notifications.Get().length + user.achievements.GetNotifications().length
    }

    componentDidMount() {
        this.listenerNotifications = user.multiplayer.notifications.AddListener(this.onNotificationsCountChange);
        this.listenerAchievements = user.achievements.achievements.AddListener(this.onNotificationsCountChange);
    }
    componentWillUnmount() {
        user.multiplayer.notifications.RemoveListener(this.listenerNotifications);
        user.achievements.achievements.RemoveListener(this.listenerAchievements);
    }

    openNotificationsHandler = () => {
        user.interface.notificationsInApp.Open();

        // Bell animation
        TimingAnimation(this.state.animBell, 1, 500).start(() => {
            TimingAnimation(this.state.animBell, 0, 0).start()
        });
    }

    onNotificationsCountChange = () => {
        const notifMultiCount = user.multiplayer.notifications.Get().length;
        const notifAchievementCount = user.achievements.GetNotifications().length;
        this.setState({ notificationsCount: notifMultiCount + notifAchievementCount });
    }
}

BackNotificationsInApp.prototype.props = NotificationsInAppProps;
BackNotificationsInApp.defaultProps = NotificationsInAppProps;

export default BackNotificationsInApp;

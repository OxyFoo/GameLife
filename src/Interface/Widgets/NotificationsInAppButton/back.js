import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

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
        animBell: new Animated.Value(1),
        animOpenCount: new Animated.Value(0),

        notificationsCount: user.notificationsInApp.notifications.Get().length
    };

    /** @type {Symbol | null} */
    listener = null;

    /** @type {NodeJS.Timeout | null} */
    timeoutShowedCount = null;

    componentDidMount() {
        this.listener = user.notificationsInApp.notifications.AddListener((notifications) => {
            this.setState({ notificationsCount: notifications.length });
        });
    }

    componentWillUnmount() {
        if (this.timeoutShowedCount) {
            clearTimeout(this.timeoutShowedCount);
        }
    }

    /**
     * @param {number} delay
     * @param {number} duration
     */
    StartOpenCountAnimation = (duration = 3000, delay = 0) => {
        // Open after delay
        this.timeoutShowedCount = setTimeout(() => {
            SpringAnimation(this.state.animOpenCount, 1, false).start();

            // Close after duration
            this.timeoutShowedCount = setTimeout(() => {
                SpringAnimation(this.state.animOpenCount, 0, false).start();

                // Clear timeout
                if (this.timeoutShowedCount) {
                    clearTimeout(this.timeoutShowedCount);
                    this.timeoutShowedCount = null;
                }
            }, duration);
        }, delay);
    };

    openNotificationsHandler = () => {
        user.interface.notificationsInApp?.Open();

        // Bell animation
        TimingAnimation(this.state.animBell, 1, 500).start(() => {
            TimingAnimation(this.state.animBell, 0, 0).start();
        });
    };
}

BackNotificationsInApp.prototype.props = NotificationsInAppProps;
BackNotificationsInApp.defaultProps = NotificationsInAppProps;

export default BackNotificationsInApp;

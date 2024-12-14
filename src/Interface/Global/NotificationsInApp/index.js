import * as React from 'react';
import { Animated, FlatList } from 'react-native';

import styles from './style';
import { NIA_Template, NIA_Separator, NIA_Empty } from './templates';
import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<any>} NotificationInApp
 */

class NotificationsInApp extends React.Component {
    state = {
        /** @type {boolean} Enable or disable notifications rendering */
        opened: false,

        /** @type {Animated.Value} Show or hide the notifications */
        animOpen: new Animated.Value(1),

        /** @type {'auto' | 'none'} */
        pointerEvent: 'none',

        /** @type {Array<NotificationInApp>} */
        notifications: user.notificationsInApp.notifications.Get()
    };

    /**
     * @description Used to prevent the close animation from being interrupted by the open animation
     * @type {boolean}
     */
    opening = false;

    /** @type {Symbol | null} */
    listener = null;

    componentDidMount() {
        this.listener = user.notificationsInApp.notifications.AddListener((notifications) => {
            this.setState({ notifications });
        });
    }

    /**
     * @param {any} _prevProps
     * @param {this['state']} prevState
     */
    componentDidUpdate(_prevProps, prevState) {
        if (this.state.opened && this.state.notifications.length === 0 && prevState.notifications.length > 0) {
            this.Close();
        }
    }

    componentWillUnmount() {
        user.notificationsInApp.notifications.RemoveListener(this.listener);
    }

    /** @param {GestureResponderEvent} event */
    backgroundPressHandler = (event) => {
        if (event.target === event.currentTarget) {
            this.Close();
        }
    };

    Open = () => {
        this.opening = true;
        this.setState({ opened: true, pointerEvent: 'auto' });
        SpringAnimation(this.state.animOpen, 0).start();

        user.interface.AddCustomBackHandler(this.closeHandler);
    };

    Close = () => {
        user.interface.BackHandle();
    };

    /** @private */
    closeHandler = () => {
        this.opening = false;
        this.setState({ pointerEvent: 'none' });
        SpringAnimation(this.state.animOpen, 1).start(() => {
            if (!this.opening) {
                this.setState({ opened: false });
            }
        });

        user.interface.RemoveCustomBackHandler(this.closeHandler);
        return true;
    };

    render() {
        const { opened, animOpen, notifications, pointerEvent } = this.state;

        if (!opened) {
            return null;
        }

        const animOpacity = {
            opacity: animOpen.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        };
        const animStyle = {
            top: user.interface.userHeader?.state.height || 0,
            transform: [
                {
                    translateY: animOpen.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -50]
                    })
                }
            ]
        };

        return (
            <Animated.View
                style={[styles.background, animOpacity]}
                onTouchStart={this.backgroundPressHandler}
                pointerEvents={pointerEvent}
            >
                <Animated.View style={[styles.container, animStyle]}>
                    <FlatList
                        style={styles.flatlist}
                        data={notifications}
                        keyExtractor={(item) => `notif-in-app-${item.timestamp}`}
                        renderItem={({ item, index }) => <NIA_Template item={item} index={index} />}
                        ItemSeparatorComponent={NIA_Separator}
                        ListEmptyComponent={NIA_Empty}
                        onTouchStart={this.backgroundPressHandler}
                        showsVerticalScrollIndicator={true}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

export { NotificationsInApp };

import * as React from 'react';
import { Animated, FlatList } from 'react-native';

import styles from './style';
import { NIA_Template, NIA_Separator, NIA_Empty } from './template';
import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'friend-pending'>} NotificationInAppFriendPending
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'achievement-pending'>} NotificationInAppAchievementPending
 */

class Notifications extends React.Component {
    state = {
        /** @type {boolean} Enable or disable notifications rendering */
        opened: false,

        /** @type {Animated.Value} Show or hide the notifications */
        animOpen: new Animated.Value(1),

        /** @type {'auto' | 'none'} */
        pointerEvent: 'none',

        /** @type {Array<NotificationInAppFriendPending | NotificationInAppAchievementPending>} */
        notifications: [
            ...user.multiplayer.notifications.Get(),
            ...user.achievements.GetNotifications()
        ].sort((a, b) => b.timestamp - a.timestamp)
    };

    /**
     * @description Used to prevent the close animation from being interrupted by the open animation
     * @type {boolean}
     */
    opening = false;

    componentDidMount() {
        this.listener = user.multiplayer.notifications.AddListener(this.onUpdate);
        this.listenerAchievements = user.achievements.achievements.AddListener(this.onUpdate);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.opened && this.state.notifications.length === 0 && prevState.notifications.length > 0) {
            this.Close();
        }
    }

    componentWillUnmount() {
        user.multiplayer.notifications.RemoveListener(this.listener);
        user.achievements.achievements.RemoveListener(this.listenerAchievements);
    }

    onUpdate = () => {
        this.setState({
            notifications: [
                ...user.multiplayer.notifications.Get(),
                ...user.achievements.GetNotifications()
            ].sort((a, b) => b.timestamp - a.timestamp)
        });
    }

    backgroundPressHandler = (e) => {
        if (e.target === e.currentTarget) {
            this.Close();
        }
    }

    Open = () => {
        this.opening = true;
        this.setState({ opened: true, pointerEvent: 'auto'});
        SpringAnimation(this.state.animOpen, 0).start();

        user.interface.SetCustomBackHandler(this.Close);
    }

    Close = () => {
        this.opening = false;
        this.setState({ pointerEvent: 'none' });
        SpringAnimation(this.state.animOpen, 1).start(() => {
            if (!this.opening) {
                this.setState({ opened: false });
            }
        });

        user.interface.ResetCustomBackHandler();
        return false;
    }

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
            transform: [{
                translateY: animOpen.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50]
                })
            }]
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
                        keyExtractor={(item, index) => 'notif-in-app-' + item.timestamp.toString() + index}
                        renderItem={({ item, index }) => <NIA_Template item={item} index={index} />}
                        ItemSeparatorComponent={() => <NIA_Separator />}
                        ListEmptyComponent={() => <NIA_Empty />}
                        onTouchStart={this.backgroundPressHandler}
                        showsVerticalScrollIndicator={true}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

export default Notifications;

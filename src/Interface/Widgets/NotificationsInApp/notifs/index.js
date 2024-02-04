import * as React from 'react';
import { Animated, FlatList } from 'react-native';

import styles from './style';
import { NIA_Template, NIA_Separator } from './template';

import user from 'Managers/UserManager';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'friend-pending'>} NotificationInApp
 */

class Notifications extends React.Component {
    state = {
        /** @type {boolean} Enable or disable notifications rendering */
        opened: false,

        /** @type {Animated.Value} Show or hide the notifications */
        animOpen: new Animated.Value(1),

        /** @type {'auto' | 'none'} */
        pointerEvent: 'none',

        /** @type {Array<NotificationInApp>} */
        notifications: user.multiplayer.notifications.Get()
    };

    /**
     * @description Used to prevent the close animation from being interrupted by the open animation
     * @type {boolean}
     */
    opening = false;

    componentDidMount() {
        this.listener = user.multiplayer.notifications.AddListener(this.onUpdate);
    }

    componentDidUpdate() {
        if (this.state.opened && this.state.notifications.length === 0) {
            this.Close();
        }
    }

    componentWillUnmount() {
        user.multiplayer.notifications.RemoveListener(this.listener);
    }

    /** @param {Array<NotificationInApp>} notifications */
    onUpdate = (notifications) => {
        this.setState({ notifications });
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
                        renderItem={({ item, index }) => <NIA_Template item={item} index={index} />}
                        ItemSeparatorComponent={() => <NIA_Separator />}
                        onTouchStart={this.backgroundPressHandler}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

export default Notifications;

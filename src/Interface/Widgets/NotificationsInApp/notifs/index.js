import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import styles from './style';
import { NIA_Template, NIA_Separator } from './template';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'friend-pending'>} NotificationInApp
 */

class Notifications extends React.Component {
    state = {
        opened: false,

        /** @type {Array<NotificationInApp>} */
        notifications: user.multiplayer.notifications.Get()
    };

    componentDidMount() {
        // TODO: Animations
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
        this.setState({ opened: true });
        user.interface.SetCustomBackHandler(this.Close);
    }

    Close = () => {
        this.setState({ opened: false });
        user.interface.ResetCustomBackHandler();
        return false;
    }

    render() {
        const lang = langManager.curr['modal'];
        const { opened, notifications } = this.state;

        if (!opened) {
            return null;
        }

        return (
            <View
                style={styles.container}
                onTouchStart={this.backgroundPressHandler}
            >
                <TouchableOpacity style={styles.backButton} activeOpacity={.5} onPress={this.Close}>
                    <Icon style={styles.backButtonArrow} icon='arrowLeft' size={30} />
                    <Text fontSize={16}>{lang['back']}</Text>
                </TouchableOpacity>
                <FlatList
                    style={styles.flatlist}
                    data={notifications}
                    renderItem={({ item, index }) => <NIA_Template item={item} index={index} />}
                    ItemSeparatorComponent={() => <NIA_Separator />}
                    onTouchStart={this.backgroundPressHandler}
                />
            </View>
        );
    }
}

export default Notifications;

import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('Types/NotificationInApp').NotificationInApp<'friend-pending'>} NotificationInApp
 */

/**
 * @param {object} props
 * @param {NotificationInApp} props.notif
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_FriendPending({ notif, index }) {
    const onAccept = () => {
        user.multiplayer.AcceptFriend(notif.data.accountID);
    };
    const onDecline = () => {
        user.multiplayer.DeclineFriend(notif.data.accountID);
    }

    return (
        <View style={styles.friendPendingContainer}>
            <View style={styles.friendPendingText}>
                <Text fontSize={16}>
                    {`${notif.data.username} [vous a demandé en ami]`}
                </Text>
            </View>

            <View style={styles.friendPendingButtons}>
                <Button
                    style={styles.friendPendingButton}
                    color='main1'
                    onPress={onAccept}
                    icon='check'
                    iconSize={16}
                />
                <Button
                    style={styles.friendPendingButton}
                    color='danger'
                    onPress={onDecline}
                    icon='cross'
                    iconSize={16}
                />
            </View>
        </View>
    );
}

export default NIA_FriendPending;

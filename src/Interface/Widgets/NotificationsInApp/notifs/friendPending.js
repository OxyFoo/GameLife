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
        <View>
            <Text>{`${notif.data.username} [vous a demandé en amis]`}</Text>

            <View style={styles.friendPendingButtons}>
                <Button
                    style={styles.friendPendingButton}
                    color='success'
                    onPress={onAccept}
                >
                    <Text>[Accepter]</Text>
                </Button>
                <Button
                    style={styles.friendPendingButton}
                    color='danger'
                    onPress={onDecline}
                >
                    <Text>[Refuser]</Text>
                </Button>
            </View>
        </View>
    );
}

export default NIA_FriendPending;

import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button, Icon } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Types/Class/NotificationsInApp').NotificationInApp<'friend-pending'>} NotificationInApp
 */

/**
 * @param {object} props
 * @param {NotificationInApp} props.notif
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_FriendPending({ notif }) {
    const lang = langManager.curr['notifications']['in-app'];
    const [loading, setLoading] = React.useState(false);
    const [anim] = React.useState(new Animated.Value(0));
    const [askDecline, setAskDecline] = React.useState(false);

    const goToDeclineOrBlock = () => {
        setAskDecline(true);
        SpringAnimation(anim, 1).start();
    };
    const goBack = () => {
        setAskDecline(false);
        SpringAnimation(anim, 0).start();
    };

    const onAccept = async () => {
        setLoading(true);
        await user.multiplayer.AcceptFriend(notif.data.accountID);
        setLoading(false);
        goBack();
    };
    const onDecline = async () => {
        setLoading(true);
        await user.multiplayer.DeclineFriend(notif.data.accountID);
        setLoading(false);
        goBack();
    };
    const onBlock = async () => {
        setLoading(true);
        await user.multiplayer.BlockFriend(notif.data.accountID);
        setLoading(false);
        goBack();
    };

    // Ask for decline or block
    if (askDecline) {
        const styleAnim = {
            transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [200, 0] }) }]
        };
        return (
            <Animated.View style={styleAnim}>
                <Text fontSize={16}>{notif.data.username}</Text>

                <View style={styles.friendPendingBlockView}>
                    <Button
                        style={styles.friendPendingBlockButton}
                        styleContent={styles.friendPendingBlockButtonContent}
                        appearance='uniform'
                        color='danger'
                        onPress={onDecline}
                        loading={loading}
                    >
                        <Text>{lang['friend-pending-decline']}</Text>
                        <Icon icon='close' size={24} />
                    </Button>
                    <Button
                        style={styles.friendPendingBlockButton}
                        styleContent={styles.friendPendingBlockButtonContent}
                        appearance='uniform'
                        color='error'
                        onPress={onBlock}
                        loading={loading}
                    >
                        <Text>{lang['friend-pending-block']}</Text>
                        <Icon icon='trash' size={20} />
                    </Button>
                </View>
            </Animated.View>
        );
    }

    // Aknowledge the friend request
    return (
        <Animated.View style={styles.friendPendingContainer}>
            <View style={styles.friendPendingText}>
                <Text fontSize={16}>{lang['friend-pending-text'].replace('{}', notif.data.username)}</Text>
            </View>

            <View style={styles.friendPendingButtons}>
                <Button
                    style={styles.friendPendingButton}
                    appearance='uniform'
                    color='main1'
                    onPress={onAccept}
                    icon='check'
                    iconSize={16}
                    loading={loading}
                />
                <Button
                    style={styles.friendPendingButton}
                    appearance='uniform'
                    color='danger'
                    onPress={goToDeclineOrBlock}
                    icon='close'
                    iconSize={16}
                    loading={loading}
                />
            </View>
        </Animated.View>
    );
}

export default NIA_FriendPending;

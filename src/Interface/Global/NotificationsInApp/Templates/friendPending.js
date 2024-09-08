import * as React from 'react';
import { Animated, View } from 'react-native';

import styles from '../style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Types/Features/NotificationInApp').NotificationInApp<'friend-pending'>} NotificationInApp
 */

/**
 * @param {object} props
 * @param {NotificationInApp} props.notif
 * @param {number} props.index
 * @returns {JSX.Element}
 */
function NIA_FriendPending({ notif }) {
    const lang = langManager.curr['notifications']['in-app'];
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

    const onAccept = () => {
        user.multiplayer.AcceptFriend(notif.data.accountID);
        goBack();
    };
    const onDecline = () => {
        user.multiplayer.DeclineFriend(notif.data.accountID);
        goBack();
    };
    const onBlock = () => {
        user.multiplayer.BlockFriend(notif.data.accountID);
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
                        appearance='uniform'
                        color='danger'
                        onPress={onDecline}
                        icon='close'
                        iconSize={16}
                    >
                        {lang['friend-pending-decline']}
                    </Button>
                    <Button
                        style={styles.friendPendingBlockButton}
                        appearance='uniform'
                        color='error'
                        onPress={onBlock}
                        icon='trash'
                        iconSize={16}
                    >
                        {lang['friend-pending-block']}
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
                />
                <Button
                    style={styles.friendPendingButton}
                    appearance='uniform'
                    color='danger'
                    onPress={goToDeclineOrBlock}
                    icon='close'
                    iconSize={16}
                />
            </View>
        </Animated.View>
    );
}

export default NIA_FriendPending;

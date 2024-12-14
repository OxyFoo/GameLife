import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('Types/Data/User/Activities').CurrentActivity} CurrentActivity
 */

const ActivityFriendsProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerFriends extends React.Component {
    /** @type {Symbol | null} */
    currentActivityEvent = null;

    componentDidMount() {
        this.currentActivityEvent = user.multiplayer.friends.AddListener(this.onFriendsChange);
    }

    componentWillUnmount() {
        user.multiplayer.friends.RemoveListener(this.currentActivityEvent);
    }

    onFriendsChange = () => {
        // TODO: Optimize this
        this.forceUpdate();
    };

    render() {
        const lang = langManager.curr['activity'];
        const { currentActivity } = this.props;

        if (currentActivity === null || currentActivity.friendsIDs.length === 0) {
            return null;
        }

        const friendsText = currentActivity.friendsIDs
            .map((friendID) => {
                const friend = user.multiplayer.GetFriendByID(friendID);
                if (friend === null) {
                    return '';
                }

                return friend.username;
            })
            .join(', ');

        return (
            <View style={styles.friendsParent}>
                <Text style={styles.friendsTitle}>{lang['timer-friends']}</Text>

                <View style={styles.friendsContainer}>
                    <Text color={'primary'} fontSize={16}>
                        {friendsText}
                    </Text>
                </View>
            </View>
        );
    }
}

ActivityTimerFriends.prototype.props = ActivityFriendsProps;
ActivityTimerFriends.defaultProps = ActivityFriendsProps;

export default ActivityTimerFriends;

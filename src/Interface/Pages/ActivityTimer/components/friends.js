import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';

/**
 * @typedef {import('Types/UserOnline').CurrentActivity} CurrentActivity
 */

const ActivityFriendsProps = {
    /** @type {CurrentActivity | null} */
    currentActivity: null
};

class ActivityTimerFriends extends React.Component {
    componentDidMount() {
        this.currentActivityEvent = user.multiplayer.friends.AddListener(this.onFriendsChange);
    }

    componentWillUnmount() {
        user.multiplayer.friends.RemoveListener(this.currentActivityEvent);
    }

    onFriendsChange = () => {
        this.forceUpdate();
    }

    render() {
        const lang = langManager.curr['activity'];
        const { currentActivity } = this.props;

        if (currentActivity === null || currentActivity.friendsIDs.length === 0) {
            return null;
        }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{lang['timer-friends']}</Text>

                <View style={styles.containerFriends}>
                    {currentActivity.friendsIDs.map((friendID, index) => {
                        const friend = user.multiplayer.GetFriendByID(friendID);
                        if (friend === null) {
                            return null;
                        }

                        const friendIsHere = friend.status === 'online' &&
                            friend.currentActivity !== null &&
                            friend.currentActivity.skillID === currentActivity.skillID;

                        return (
                            <>
                                <Text
                                    key={`activity-timer-friend-${friendID}`}
                                    color={friendIsHere ? 'primary' : 'secondary'}
                                    fontSize={16}
                                >
                                    {friend.username}
                                </Text>
                                <Text key={`activity-timer-friend-${friendID}-comma`} color={'secondary'} fontSize={16}>
                                    {index < currentActivity.friendsIDs.length - 1 ? ', ' : ''}
                                </Text>
                            </>
                        );
                    })}
                </View>
            </View>
        );
    }
}

ActivityTimerFriends.prototype.props = ActivityFriendsProps;
ActivityTimerFriends.defaultProps = ActivityFriendsProps;

const styles = StyleSheet.create({
    container: {
        padding: 4,
        borderRadius: 10,
        backgroundColor: themeManager.GetColor('backgroundCard')
    },
    containerFriends: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginBottom: 4
    }
});

export default ActivityTimerFriends;

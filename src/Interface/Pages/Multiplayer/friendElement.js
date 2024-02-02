import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { USER_XP_PER_LEVEL } from 'Class/Experience';
import { Text, Button, Frame, Character } from 'Interface/Components';

/**
 * @typedef {import('Types/Friend').Friend} Friend
 */

/**
 * @param {object} param0
 * @param {Friend} param0.friend
 * @returns {JSX.Element}
 */
function FriendElement({ friend }) {
    const frameSize = { x: 200, y: 0, width: 500, height: 450 };

    let friendTitle = null;
    if (friend.title !== 0) {
        const friendTitleIndex = dataManager.titles.GetByID(friend.title);
        friendTitle = dataManager.GetText(friendTitleIndex.Name);
    }

    const friendExperience = user.experience.getXPDict(friend.xp, USER_XP_PER_LEVEL);

    const character = new Character(
        'character-player-' + friend.accountID.toString(),
        friend.avatar.Sexe,
        friend.avatar.Skin,
        friend.avatar.SkinColor
    );
    const stuff = [
        friend.avatar.Hair,
        friend.avatar.Top,
        friend.avatar.Bottom,
        friend.avatar.Shoes
    ];
    character.SetEquipment(stuff);

    const statusStyle = {};
    if (friend.status === 'online') {
        statusStyle.borderColor = themeManager.GetColor('success');
    } else if (friend.status === 'offline') {
        statusStyle.borderColor = themeManager.GetColor('danger');
    }

    return (
        <Button style={styles.friend}>
            <View style={styles.friendInfo}>
                <View style={[styles.frameBorder, statusStyle]}>
                    <Frame
                        style={styles.frame}
                        characters={[ character ]}
                        size={frameSize}
                        delayTime={0}
                        loadingTime={0}
                        bodyView={'topHalf'}
                    />
                </View>

                <View style={styles.friendInfoTitle}>
                    <Text>{friend.username}</Text>
                    {friendTitle !== null && (
                        <Text>{friendTitle}</Text>
                    )}
                </View>
            </View>

            <View style={styles.friendDetails}>
                <Text style={styles.level}>{friendExperience.lvl.toString()}</Text>
            </View>
        </Button>
    );
}

const styles = StyleSheet.create({
    friend: {
        width: '100%',
        height: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 0
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'left'
    },
    friendInfoTitle: {
        marginLeft: 8,
        alignItems: 'flex-start'
    },
    friendDetails: {
    },
    frame: {
        paddingVertical: 0,
        paddingHorizontal: 0
    },
    frameBorder: {
        width: 48,
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#00000050'
    },
    level: {
        aspectRatio: 1,
        padding: 8,
        borderRadius: 100,
        backgroundColor: '#00000050'
    }
});

export default FriendElement;

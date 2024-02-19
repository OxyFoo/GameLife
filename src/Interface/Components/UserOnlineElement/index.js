import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { USER_XP_PER_LEVEL } from 'Class/Experience';
import { Text, Button, Frame, Character } from 'Interface/Components';

/**
 * @typedef {import('Types/UserOnline').Friend} Friend
 */

/**
 * @param {object} param0
 * @param {Friend} param0.friend
 * @returns {JSX.Element}
 */
function UserOnlineElement({ friend }) {
    const [ character, setCharacter ] = React.useState(null);
    const [ friendTitle, setFriendTitle ] = React.useState(null);
    const [ friendExperience, setFriendExperience ] = React.useState(null);
    const [ statusStyle, setStatusStyle ] = React.useState({});

    React.useEffect(() => {
        let friendTitle = null;
        if (friend.title !== 0) {
            const friendTitleIndex = dataManager.titles.GetByID(friend.title);
            friendTitle = langManager.GetText(friendTitleIndex.Name);
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
            statusStyle.borderColor = themeManager.GetColor('disabled');
        }

        setCharacter(character);
        setFriendTitle(friendTitle);
        setFriendExperience(friendExperience);
        setStatusStyle(statusStyle);
    }, [ friend ]);

    const onPress = () => {
        user.interface.ChangePage('profilefriend', { friendID: friend.accountID });
    }

    return (
        <Button style={styles.friend} onPress={onPress}>
            <View style={styles.friendInfo}>
                {character !== null && (
                    <View style={[styles.frameBorder, statusStyle]}>
                        <Frame
                            style={styles.frame}
                            characters={[ character ]}
                            size={{ x: 200, y: 0, width: 500, height: 450 }}
                            delayTime={0}
                            loadingTime={0}
                            bodyView={'topHalf'}
                        />
                    </View>
                )}

                <View style={styles.friendInfoTitle}>
                    <Text fontSize={20}>{friend.username}</Text>
                    {friendTitle !== null && (
                        <Text fontSize={14}>{friendTitle}</Text>
                    )}
                </View>
            </View>

            {friendExperience !== null && (
                <View style={styles.friendDetails}>
                    <Text style={styles.level}>
                        {friendExperience.lvl.toString()}
                    </Text>
                </View>
            )}
        </Button>
    );
}

export default UserOnlineElement;

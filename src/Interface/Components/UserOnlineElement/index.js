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
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 * @typedef {import('Types/UserOnline').Friend} Friend
 */

/**
 * @param {object} param0
 * @param {Friend} param0.friend
 * @returns {JSX.Element}
 */
function UserOnlineElement({ friend }) {
    const lang = langManager.curr['multiplayer'];
    /** @type {[Character | null, React.Dispatch<React.SetStateAction<Character | null>>]} */
    const [ character, setCharacter ] = React.useState(/** @type {Character | null} */ (null));
    const [ friendTitle, setFriendTitle ] = React.useState(/** @type {string | null} */ (null));
    const [ statusStyle, setStatusStyle ] = React.useState({});

    React.useEffect(() => {
        let friendTitle = null;
        if (friend.title !== 0) {
            const friendTitleIndex = dataManager.titles.GetByID(friend.title);
            if (friendTitleIndex !== null) {
                friendTitle = langManager.GetText(friendTitleIndex.Name);
            }
        }
        if (friend.currentActivity !== null) {
            const skill = dataManager.skills.GetByID(friend.currentActivity.skillID);
            if (skill !== null) {
                friendTitle = lang['friend-do-activity-now'].replace('{}', langManager.GetText(skill.Name));
            }
        }

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
        setStatusStyle(statusStyle);
    }, [ friend ]);

    const onPress = () => {
        user.interface.ChangePage('profilefriend', { friendID: friend.accountID });
    }

    return (
        <Button style={styles.friend} onPress={onPress}>
            <View style={styles.friendInfo}>
                <View style={[styles.frameBorder, statusStyle]}>
                    {character !== null && (
                        <Frame
                            style={styles.frame}
                            characters={[ character ]}
                            size={{ x: 200, y: 0, width: 500, height: 450 }}
                            delayTime={0}
                            loadingTime={0}
                            bodyView={'topHalf'}
                        />
                    )}
                </View>

                <View style={styles.friendInfoTitle}>
                    <Text fontSize={20}>{friend.username}</Text>
                    {friendTitle !== null && (
                        <Text fontSize={14}>{friendTitle}</Text>
                    )}
                </View>
            </View>

            <Level friend={friend} />
        </Button>
    );
}

/**
 * @param {object} param0
 * @param {Friend} param0.friend
 * @returns {React.JSX.Element | null}
 */
function Level({ friend }) {
    const [ friendExperience, setFriendExperience ] = React.useState(/** @type {XPInfo | null} */ (null));

    React.useEffect(() => {
        const friendExperience = user.experience.getXPDict(friend.xp, USER_XP_PER_LEVEL);
        setFriendExperience(friendExperience);
    }, [ friend ]);

    if (friendExperience === null) {
        return null;
    }

    const levelStr = friendExperience.lvl.toString();
    return (
        <View style={styles.friendDetails}>
            <Text style={styles.level} fontSize={18 - ((levelStr.length - 1) * 2)}>
                {levelStr}
            </Text>
        </View>
    );
}

export default UserOnlineElement;

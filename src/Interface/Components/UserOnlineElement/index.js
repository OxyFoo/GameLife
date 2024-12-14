import * as React from 'react';
import { Image, View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import ProfileFriend from 'Interface/PageView/ProfileFriend';
import { Text, Button, Frame, Character, Icon } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 * @typedef {import('Types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('Types/Data/User/Multiplayer').UserOnline} UserOnline
 */

// TODO: Replace this with a real avatar
// @ts-ignore
const AVATAR_MIN_PLACEHOLDER = require('Ressources/items/avatar_min_placeholder.png');

/** @type {Character | null} */
// const DEFAULT_CHARACTER = null;

/** @type {string | null} */
const DEFAULT_TITLE = null;

/**
 * @param {object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {(Friend | UserOnline)} param0.friend
 * @returns {JSX.Element}
 */
function UserOnlineElement({ style, friend }) {
    const langExp = langManager.curr['level'];
    const lang = langManager.curr['multiplayer'];

    // const [character, setCharacter] = React.useState(DEFAULT_CHARACTER);
    const [friendTitle, setFriendTitle] = React.useState(DEFAULT_TITLE);
    const [statusStyle, setStatusStyle] = React.useState({});

    React.useEffect(() => {
        let newFriendTitle = null;
        if (friend.title !== 0) {
            const friendTitleIndex = dataManager.titles.GetByID(friend.title);
            if (friendTitleIndex !== null) {
                newFriendTitle = langManager.GetText(friendTitleIndex.Name);
            }
        }
        if (friend.friendshipState === 'accepted' && friend.currentActivity !== null) {
            const skill = dataManager.skills.GetByID(friend.currentActivity.skillID);
            if (skill !== null) {
                newFriendTitle = lang['friend-do-activity-now'].replace('{}', langManager.GetText(skill.Name));
            }
        }

        // const newCharacter = new Character(
        //     'character-player-' + friend.accountID.toString(),
        //     friend.avatar.Sexe,
        //     friend.avatar.Skin,
        //     friend.avatar.SkinColor
        // );
        // const stuff = [friend.avatar.Hair, friend.avatar.Top, friend.avatar.Bottom, friend.avatar.Shoes];
        // newCharacter.SetEquipment(stuff);

        const newStatusStyle = {};
        if (friend.status === 'online') {
            newStatusStyle.borderColor = themeManager.GetColor('success');
        } else if (friend.status === 'offline') {
            newStatusStyle.borderColor = themeManager.GetColor('disabled');
        }

        // setCharacter(newCharacter);
        setFriendTitle(newFriendTitle);
        setStatusStyle(newStatusStyle);
    }, [friend, lang]);

    const onPress = () => {
        user.interface.bottomPanel?.Open({
            content: <ProfileFriend friendID={friend.accountID} />
        });
    };

    const friendExperience = user.experience.getXPDict(friend.xp);

    return (
        <Button style={[styles.friendButton, style]} onPress={onPress} appearance='uniform' color='transparent'>
            <Gradient style={styles.friendGradient} colors={['#38406573', '#38406526']} angle={100}>
                <View style={styles.friendInfo}>
                    <View style={[styles.frameBorder, statusStyle]}>
                        {/* {character !== null && (
                            <Frame
                                style={styles.frame}
                                characters={[character]}
                                size={{ x: 200, y: 0, width: 500, height: 450 }}
                                delayTime={0}
                                loadingTime={0}
                                bodyView={'topHalf'}
                            />
                        )} */}
                        <Image
                            style={styles.friendTopPlaceholder}
                            resizeMode='stretch'
                            source={AVATAR_MIN_PLACEHOLDER}
                        />
                    </View>

                    <View style={styles.friendInfoTitle}>
                        <Text fontSize={20}>{friend.username}</Text>
                        {friendTitle !== null && (
                            <Text style={styles.title} fontSize={16} color='main1'>
                                {friendTitle}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.details}>
                    <Text
                        style={styles.level}
                        color='secondary'
                    >{`${langExp['level-small']} ${friendExperience.lvl}`}</Text>
                    <Icon icon='arrow-square-outline' color='gradient' angle={90} />
                </View>
            </Gradient>
        </Button>
    );
}

export { UserOnlineElement };

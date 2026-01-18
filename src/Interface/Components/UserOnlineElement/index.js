import * as React from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import ProfileFriend from 'Interface/PageView/ProfileFriend';
import Avatar from 'Data/User/Avatar';
import { Text, Button, Icon } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Multiplayer').UserOnline} UserOnline
 */

/**
 * @param {object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {(Friend | UserOnline)} param0.friend
 * @returns {React.ReactNode}
 */
function UserOnlineElement({ style, friend }) {
    const langExp = langManager.curr['level'];
    const lang = langManager.curr['multiplayer'];

    const [friendTitle, setFriendTitle] = React.useState(/** @type {string | null} */ (null));
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

        const newStatusStyle = {};
        if (friend.status === 'online') {
            newStatusStyle.borderColor = themeManager.GetColor('success');
        } else if (friend.status === 'offline') {
            newStatusStyle.borderColor = themeManager.GetColor('disabled');
        }

        setFriendTitle(newFriendTitle);
        setStatusStyle(newStatusStyle);
    }, [friend, lang]);

    const onPress = () => {
        const screen = Dimensions.get('window');
        user.interface.bottomPanel?.Open({
            content: <ProfileFriend friendID={friend.accountID} />,
            maxPosY: screen.height * 0.8
        });
    };

    const friendExperience = user.experience.getXPDict(friend.xp);

    const frameWidth = styles.frameBorder.width - 2 * styles.frameBorder.borderWidth;
    const frameHeight = styles.frameBorder.height - 2 * styles.frameBorder.borderWidth;
    const containerSize = dataManager.items.GetContainerSize('profile');

    return (
        <Button style={[styles.friendButton, style]} onPress={onPress} appearance='uniform' color='transparent'>
            <Gradient style={styles.friendGradient} colors={['#38406573', '#38406526']} angle={100}>
                <View style={styles.friendInfo}>
                    <View style={[styles.frameBorder, statusStyle]}>
                        {friend?.avatar ? (
                            <AvatarFrame
                                width={frameWidth}
                                height={frameHeight}
                                renderScale={2}
                                backgroundColor='#00000000'
                            >
                                <AvatarCharacter
                                    body={friend.avatar.Skin || 'human_00'}
                                    bodyColor={BODY_COLORS[friend.avatar.SkinColor] || BODY_COLORS[0]}
                                    position={containerSize.pos}
                                    scale={containerSize.scale}
                                    items={Avatar.GetFriendAvatarItems(friend)}
                                    portraitMode
                                />
                            </AvatarFrame>
                        ) : null}
                    </View>

                    <View style={styles.friendInfoTitle}>
                        <Text fontSize={20}>{friend.username}</Text>
                        {friendTitle !== null && (
                            <Text style={styles.title} fontSize={14} color='main1'>
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

                    {/* TODO: Why is the icon absolute when it is in the lineargradient on iOS?*/}
                    {Platform.OS === 'android' && <Icon icon='arrow-square-outline' color='gradient' angle={90} />}
                </View>
            </Gradient>
        </Button>
    );
}

export { UserOnlineElement };

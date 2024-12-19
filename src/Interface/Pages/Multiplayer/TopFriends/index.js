import * as React from 'react';
import { View, Image } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, Text } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';
import ProfileFriend from 'Interface/PageView/ProfileFriend';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('Types/Data/User/Multiplayer').Friend} Friend
 * @typedef {import('Types/Data/User/Multiplayer').UserOnline} UserOnline
 */

// TODO: Replace this with a real avatar
// @ts-ignore
const AVATAR_MIN_PLACEHOLDER = require('Ressources/items/avatar_min_placeholder.png');

/** @param {Friend | UserOnline} friend */
const handleFriendPress = (friend) => {
    user.interface.bottomPanel?.Open({
        content: <ProfileFriend friendID={friend.accountID} />
    });
};

/**
 * @param {Object} param0
 * @param {StyleViewProp} [param0.style]
 * @param {(Friend | UserOnline)[]} param0.friends Friends list sorted by rank
 * @returns {JSX.Element}
 */
const TopFriends = ({ style, friends }) => {
    /** @type {StyleViewProp} */
    const styleFrame = {
        borderColor: themeManager.GetColor('border')
    };

    /** @type {StyleViewProp} */
    const styleBgRank = {
        backgroundColor: themeManager.GetColor('border')
    };

    const username1 = friends.length >= 1 ? friends[0].username : '';
    const username2 = friends.length >= 2 ? friends[1].username : '';
    const username3 = friends.length >= 3 ? friends[2].username : '';

    return (
        <View style={[styles.friendTopContainer, style]}>
            <Button
                style={styles.friendTop}
                appearance='uniform'
                color='transparent'
                onPress={() => handleFriendPress(friends[1])}
                enabled={username2 !== ''}
            >
                <View style={styles.friendTopView}>
                    {/** Avatar */}
                    <View style={[styles.friendTopFrame, styleFrame]}>
                        <Image
                            style={styles.friendTopPlaceholder}
                            resizeMode='stretch'
                            source={AVATAR_MIN_PLACEHOLDER}
                        />
                    </View>

                    {/** Rank */}
                    <View style={styles.frientTopRankContainer}>
                        <View style={[styles.friendTopRank, styleBgRank]}>
                            <Text style={styles.friendTopRankText}>2</Text>
                        </View>
                    </View>
                </View>

                {/** Pseudo */}
                <Text style={styles.frientTopPseudo}>{username2}</Text>
            </Button>

            <View style={styles.friendTopMiddle}>
                <Button
                    style={styles.friendTopMiddleButton}
                    appearance='uniform'
                    color='transparent'
                    onPress={() => handleFriendPress(friends[0])}
                    enabled={username1 !== ''}
                >
                    <Gradient style={styles.friendTopMiddleGradient} colors={['#9095FF73', '#9095FF1F']} angle={180}>
                        <View style={styles.friendTopView}>
                            {/** Avatar */}
                            <View style={[styles.friendTopFrame, styleFrame]}>
                                <Image
                                    style={styles.friendTopPlaceholder}
                                    resizeMode='stretch'
                                    source={AVATAR_MIN_PLACEHOLDER}
                                />
                            </View>

                            {/** Rank */}
                            <View style={styles.frientTopRankContainer}>
                                <Gradient style={[styles.friendTopRank, styleBgRank]}>
                                    <Text color='backgroundDark' style={styles.friendTopRankText}>
                                        1
                                    </Text>
                                </Gradient>
                            </View>
                        </View>

                        {/** Pseudo */}
                        <Text style={styles.frientTopPseudo}>{username1}</Text>
                    </Gradient>
                </Button>

                {/** Crown */}
                <View style={styles.frientTopCrownContainer} pointerEvents='none'>
                    <Icon icon='crown' color='gradient' />
                </View>
            </View>

            <Button
                style={styles.friendTop}
                appearance='uniform'
                color='transparent'
                onPress={() => handleFriendPress(friends[2])}
                enabled={username3 !== ''}
            >
                <View style={styles.friendTopView}>
                    {/** Avatar */}
                    <View style={[styles.friendTopFrame, styleFrame]}>
                        <Image
                            style={styles.friendTopPlaceholder}
                            resizeMode='stretch'
                            source={AVATAR_MIN_PLACEHOLDER}
                        />
                    </View>

                    {/** Rank */}
                    <View style={styles.frientTopRankContainer}>
                        <View style={[styles.friendTopRank, styleBgRank]}>
                            <Text style={styles.friendTopRankText}>3</Text>
                        </View>
                    </View>
                </View>

                {/** Pseudo */}
                <Text style={styles.frientTopPseudo}>{username3}</Text>
            </Button>
        </View>
    );
};

export default TopFriends;

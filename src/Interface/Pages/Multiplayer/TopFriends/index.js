import * as React from 'react';
import { View, Image } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { Icon, Text } from 'Interface/Components';
import { Gradient } from 'Interface/Primitives';

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
            <View style={styles.friendTop}>
                <View>
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
            </View>

            <Gradient
                style={[styles.friendTop, styles.friendTopMiddle]}
                colors={['#9095FF73', '#9095FF1F']}
                angle={180}
            >
                <View>
                    {/** Avatar */}
                    <View style={[styles.friendTopFrame, styleFrame]}>
                        <Image
                            style={styles.friendTopPlaceholder}
                            resizeMode='stretch'
                            source={AVATAR_MIN_PLACEHOLDER}
                        />
                    </View>

                    {/** Crown */}
                    <View style={styles.frientTopCrownContainer}>
                        <Icon icon='crown' color='gradient' />
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

            <View style={styles.friendTop}>
                <View>
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
            </View>
        </View>
    );
};

export default TopFriends;

import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { rank_purple } from 'Ressources/items/rank/rank';
import { Button, Text, Character, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').RankedFriend} RankedFriend
 */

/**
 * @param {Object} param0
 * @param {RankedFriend} param0.item
 */
function RankElement({ item }) {
    if (!item) return null;

    const [character, setCharacter] = useState(null);
    const [statusStyle, setStatusStyle] = useState({});
    const [componentColor, setComponentColor] = useState({});

    useEffect(() => {
        const isThisPlayer = item.accountID === 0;
        const componentColor = {
            backgroundColor: themeManager.GetColor('darkBlue')
        };
        if (isThisPlayer) {
            componentColor.backgroundColor = themeManager.GetColor('black');
        }

        const character = new Character(
            'character-player-' + item.accountID.toString(),
            item.avatar.Sexe,
            item.avatar.Skin,
            item.avatar.SkinColor
        );
        const stuff = [item.avatar.Hair, item.avatar.Top, item.avatar.Bottom, item.avatar.Shoes];
        character.SetEquipment(stuff);

        const statusStyle = {};
        if (item.status === 'online' || isThisPlayer) {
            statusStyle.borderColor = themeManager.GetColor('success');
        } else if (item.status === 'offline') {
            statusStyle.borderColor = themeManager.GetColor('disabled');
        }

        setCharacter(character);
        setStatusStyle(statusStyle);
        setComponentColor(componentColor);
    }, [item]);

    const onPress = () => {
        if (item.accountID === 0) return;
        user.interface.ChangePage('profilefriend', { friendID: item.accountID });
    };

    return (
        <Button style={[styles.itemContainer, componentColor]} onPress={onPress} rippleColor='white'>
            <View style={[styles.frameBorder, statusStyle]}>
                {character !== null && (
                    <Frame
                        style={styles.frame}
                        characters={[character]}
                        size={{ x: 200, y: 0, width: 500, height: 450 }}
                        delayTime={0}
                        loadingTime={0}
                        bodyView={'topHalf'}
                    />
                )}
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.username} color={'primary'}>
                    {item.username}
                </Text>
                <Text style={styles.details} color={'secondary'}>
                    {item.label}
                </Text>
            </View>
            <View style={styles.rankContainer}>
                <Image style={styles.rankImage} source={rank_purple} />
                <Text style={styles.rankText} color={'main1'} fontSize={30 - item.rank.toString().length * 2}>
                    {item.rank.toString()}
                </Text>
            </View>
        </Button>
    );
}

export { RankElement };

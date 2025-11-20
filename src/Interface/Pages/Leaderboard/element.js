import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';

import styles from './style';
// import user from 'Managers/UserManager';
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
    const [character, setCharacter] = useState(/** @type {Character | null} */ (null));
    const [statusStyle, setStatusStyle] = useState({});
    const [componentColor, setComponentColor] = useState({});

    useEffect(() => {
        const isThisPlayer = item.accountID === 0;
        const _componentColor = {
            backgroundColor: themeManager.GetColor('darkBlue')
        };
        if (isThisPlayer) {
            _componentColor.backgroundColor = themeManager.GetColor('black');
        }

        const _character = new Character(
            'character-player-' + item.accountID.toString(),
            item.avatar.Skin,
            item.avatar.SkinColor
        );
        const stuff = [item.avatar.Hair, item.avatar.Top, item.avatar.Bottom, item.avatar.Shoes];
        _character.SetEquipment(stuff);

        const _statusStyle = {};
        if (item.status === 'online' || isThisPlayer) {
            _statusStyle.borderColor = themeManager.GetColor('success');
        } else if (item.status === 'offline') {
            _statusStyle.borderColor = themeManager.GetColor('disabled');
        }

        setCharacter(_character);
        setStatusStyle(_statusStyle);
        setComponentColor(_componentColor);
    }, [item]);

    const onPress = () => {
        if (item.accountID === 0) return;
        // TODO: Replace with user interface change
        // user.interface.ChangePage('profilefriend', { friendID: item.accountID });
    };

    return !item ? null : (
        <Button style={[styles.itemContainer, componentColor]} onPress={onPress}>
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

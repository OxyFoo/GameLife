import * as React from 'react';
import { Image, View } from 'react-native';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import IMG_CHESTS from 'Ressources/items/chests/chests';

import { Text } from '../Text';
import { Icon } from '../Icon';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Rewards').RawReward} RawReward
 */

/**
 * @param {{ item: RawReward }} props
 * @returns {React.JSX.Element}
 */
const Reward = ({ item }) => {
    const styleReward = {
        ...styles.rewardItem,
        backgroundColor: themeManager.GetColor('background')
    };

    switch (item.Type) {
        case 'OX':
            return (
                <View style={styleReward}>
                    <Icon size='100%' icon='ox' />
                    <Text style={styles.rewardValue}>{'x' + item.Amount.toString()}</Text>
                </View>
            );

        case 'Chest':
            return (
                <View style={styleReward}>
                    <Image style={styles.rewardImage} source={IMG_CHESTS[item.ChestRarity]} />
                </View>
            );

        case 'Item':
        case 'Title':
        default:
            return (
                <View style={styleReward}>
                    <Icon size={32} icon='default' />
                </View>
            );
    }
};

export { Reward };

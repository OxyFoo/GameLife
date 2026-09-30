import * as React from 'react';
import { Image, View } from 'react-native';

import styles, { REWARD_SLOT, REWARD_LABEL } from './style';
import themeManager from 'Managers/ThemeManager';

import IMG_CHESTS from 'Ressources/items/chests/chests';

import { Text } from '../Text';
import { Icon } from '../Icon';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Rewards').RawReward} RawReward
 */

/**
 * @param {{ item: RawReward, size?: number }} props
 * @returns {React.JSX.Element}
 */
const Reward = ({ item, size }) => {
    const slot = typeof size === 'number' ? size : REWARD_SLOT;
    const styleReward = {
        ...styles.rewardItem,
        width: slot,
        height: slot,
        backgroundColor: themeManager.GetColor('background')
    };

    // The label is drawn for the default slot: a smaller slot (raid card) gets a smaller label
    const scale = slot / REWARD_SLOT;
    const styleValue = {
        ...styles.rewardValue,
        left: REWARD_LABEL.left * scale,
        right: REWARD_LABEL.right * scale,
        bottom: REWARD_LABEL.bottom * scale,
        fontSize: REWARD_LABEL.fontSize * scale
    };

    switch (item.Type) {
        case 'OX':
            return (
                <View style={styleReward}>
                    <Icon size='100%' icon='ox' />
                    {/* The label may be wider than the slot: shrink it instead of wrapping */}
                    <Text style={styleValue} numberOfLines={1} adjustsFontSizeToFit>
                        {'x' + item.Amount.toString()}
                    </Text>
                </View>
            );

        case 'Chest':
            return (
                <View style={styleReward}>
                    <Image style={styles.rewardImage} source={IMG_CHESTS[item.ChestRarity]} />
                </View>
            );

        case 'Achievement':
            return (
                <View style={styleReward}>
                    <Icon size='60%' icon='cup' color='main1' />
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

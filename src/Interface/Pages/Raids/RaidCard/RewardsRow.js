import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Icon, Reward, Text } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Class/Rewards').RawReward} RawReward
 */

/**
 * Rewards of the season, locked until the boss is defeated
 * @param {object} props
 * @param {RawReward[]} props.rewards
 * @param {boolean} props.unlocked
 */
function RewardsRow({ rewards, unlocked }) {
    const lang = langManager.curr['raids'];

    return (
        <View style={styles.rewardsRow}>
            <Icon icon='cup' size={16} color='raid' />
            {!unlocked && <Icon icon='lock' size={14} color='light' />}
            <View style={[styles.rewardsSlots, !unlocked && styles.rewardsLocked]}>
                {rewards.map((reward, index) => (
                    <Reward key={`raid-reward-${index}`} item={reward} size={28} />
                ))}
            </View>
            <Text style={styles.rewardsText} fontSize={10} color='light' numberOfLines={2}>
                {unlocked ? lang['rewards-unlocked'] : lang['rewards-locked']}
            </Text>
        </View>
    );
}

export { RewardsRow };

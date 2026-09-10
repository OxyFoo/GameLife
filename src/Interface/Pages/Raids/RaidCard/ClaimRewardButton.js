import * as React from 'react';
import { StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { STOP_CARD_PRESS } from './cardPress';

import { Button, Icon, Text } from 'Interface/Components';
import { ParsePlural } from 'Utils/String';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

/**
 * Takes the reward of a season. Nothing is credited before this: the reward waits on the raid card
 * while the boss lies dead, then in the raid history, without ever expiring.
 * @param {object} props
 * @param {StyleProp} [props.style]
 * @param {number} props.seasonID
 * @param {boolean} props.claimed
 * @param {number} [props.rewardsCount] Number of rewards of the season, for the plural
 */
function ClaimRewardButton({ style, seasonID, claimed, rewardsCount = 1 }) {
    const lang = langManager.curr['raids'];
    const plural = rewardsCount > 1;
    const [loading, setLoading] = React.useState(false);

    const onPress = async () => {
        if (loading || claimed) {
            return;
        }
        setLoading(true);
        await user.raids.ClaimReward(seasonID);
        setLoading(false);
    };

    if (claimed) {
        return (
            <Text style={style} fontSize={12} color='success'>
                {`✓ ${ParsePlural(lang['reward-claimed'], plural)}`}
            </Text>
        );
    }

    return (
        <Button
            {...STOP_CARD_PRESS}
            style={style}
            styleContent={styles.content}
            appearance='normal'
            fontSize={14}
            loading={loading}
            onPress={onPress}
        >
            <Icon color='background' icon='gift' size={18} />
            <Text color='background' fontSize={14} bold>
                {ParsePlural(lang['reward-claim'], plural)}
            </Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    }
});

export { ClaimRewardButton };

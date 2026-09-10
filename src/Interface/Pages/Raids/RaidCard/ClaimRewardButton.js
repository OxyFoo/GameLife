import * as React from 'react';
import { StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Icon, Text } from 'Interface/Components';

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
 */
function ClaimRewardButton({ style, seasonID, claimed }) {
    const lang = langManager.curr['raids'];
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
                {`✓ ${lang['reward-claimed']}`}
            </Text>
        );
    }

    return (
        <Button
            style={style}
            styleContent={styles.content}
            appearance='normal'
            fontSize={14}
            loading={loading}
            onPress={onPress}
        >
            <Icon color='background' icon='gift' size={18} />
            <Text color='background' fontSize={14} bold>
                {lang['reward-claim']}
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

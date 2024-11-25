import React from 'react';
import { View, Image } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import IMG_CHESTS from 'Ressources/items/chests/chests';
import { IMG_OX } from 'Ressources/items/currencies/currencies';

import { Text, Icon, Button } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Types/Class/Rewards').RawReward} RawReward
 */

/**
 * @param {Object} props
 * @param {StyleProp} [props.style] Style of the container
 * @param {number} props.index Selected day
 * @param {number} props.claimIndex Index of the claim in the dailyquest.claimsList
 * @param {(index: number) => Promise<void>} [props.handleClaim] Function called when the user press the button
 * @returns {JSX.Element}
 */
const RenderItem = (props) => {
    const lang = langManager.curr['daily-quest'];
    const langD = langManager.curr['dates']['names'];
    const [loading, setLoading] = React.useState(false);

    const currentDay = props.index + 1;
    const textToday = langD['day'] + ' ' + currentDay.toString();

    /** @type {StyleProp} */
    const styleItem = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };

    /** @type {'none' | 'loading' | 'claiming' | 'claim-tomorrow' | 'claimed'} */
    let status = 'none';

    if (props.claimIndex !== -1) {
        const allClaimLists = user.dailyQuest.claimsList.Get();
        const claimList = allClaimLists[props.claimIndex];

        if (loading) {
            status = 'loading';
        } else if (claimList.claimed.includes(props.index)) {
            status = 'claimed';
        } else if (props.index < claimList.daysCount - 1) {
            status = 'claiming';
        } else if (props.index === claimList.daysCount - 1) {
            status = 'claim-tomorrow';
        }
    }

    /** @type {StyleProp} */
    const styleOpacity = {
        opacity: status === 'claimed' ? 0.5 : 1
    };

    const handleEvent = async () => {
        if (loading || props.claimIndex === -1) return;

        setLoading(true);
        const claimList = user.dailyQuest.claimsList.Get()[props.claimIndex];
        const result = await user.dailyQuest.ClaimReward(claimList.start, [props.index]);

        if (result === 'claiming') {
            setLoading(false);
            return;
        }

        if (result !== 'success') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-claim-error-title'],
                    message: lang['alert-claim-error-message'].replace('{}', result)
                },
                callback: () => setLoading(false),
                cancelable: false,
                priority: true
            });
            return;
        }

        props.handleClaim && (await props.handleClaim(props.index));
        setLoading(false);
    };

    const dailyRewards = dataManager.dailyQuestsRewards.Get().find((item) => item.index === props.index) ?? null;
    if (dailyRewards === null) {
        user.interface.console?.AddLog('error', 'DailyQuest', 'DailyQuest reward not found for index ' + props.index);
        return <></>;
    }

    return (
        <View style={[styles.item, styleItem, props.style]}>
            <View style={[styles.content, styleOpacity]}>
                <Text style={styles.itemDay}>{textToday}</Text>

                {dailyRewards.rewards.map((reward, index) => (
                    <RenderReward key={`dailyquest-reward-${index}`} item={reward} />
                ))}
            </View>

            <View style={styles.claimState}>
                {status === 'claim-tomorrow' && <Text style={styles.claimTomorrow}>{lang['container-tomorrow']}</Text>}
                {(status === 'claiming' || status === 'loading') && (
                    <Button style={styles.claimButton} color='transparent' onPress={handleEvent} loading={loading}>
                        {lang['popup']['claim']}
                    </Button>
                )}
                {status === 'claimed' && <Icon icon='check' color='success' />}
            </View>
        </View>
    );
};

const RenderItemMemo = React.memo(RenderItem, (prevProps, nextProps) => {
    if (prevProps.index !== nextProps.index) {
        return false;
    }
    if (prevProps.claimIndex !== nextProps.claimIndex) {
        return false;
    }
    return true;
});

/** @param {{ item: RawReward }} props */
function RenderReward(props) {
    const styleReward = {
        ...styles.rewardItem,
        backgroundColor: themeManager.GetColor('background')
    };

    if (props.item.Type === 'OX') {
        return (
            <View style={styleReward}>
                <Image style={styles.rewardImage} source={IMG_OX} />
                <Text style={styles.rewardValue}>{'x' + props.item.Amount.toString()}</Text>
            </View>
        );
    } else if (props.item.Type === 'Chest') {
        return (
            <View style={styleReward}>
                <Image style={styles.rewardImage} source={IMG_CHESTS[props.item.ChestRarity]} />
            </View>
        );
    }

    return null;
}

export { RenderItemMemo };

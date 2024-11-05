import React from 'react';
import { View, Image } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import IMG_CHESTS from 'Ressources/items/chests/chests';
import { IMG_OX } from 'Ressources/items/currencies/currencies';
import DAILY_QUEST_REWARDS from 'Ressources/items/quests/DailyQuest';

import { Text, Icon, Button } from 'Interface/Components';
import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Ressources/items/quests/DailyQuest').DailyQuestRewardType} DailyQuestRewardType
 */

/**
 * @param {Object} props
 * @param {StyleProp} [props.style] Style of the container
 * @param {number} props.index Selected day
 * @param {number} props.claimIndex Index of the claim in the dailyquest.claimsList
 * @param {(index: number) => void} [props.handleClaim] Function called when the user press the button
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

    /** @type {'none' | 'loading' | 'not-claimed' | 'claiming' | 'claim-tomorrow' | 'claimed'} */
    let status = 'none';

    if (props.claimIndex !== -1) {
        const allClaimLists = user.dailyQuest.claimsList.Get();
        const claimList = allClaimLists[props.claimIndex];

        if (loading) {
            status = 'loading';
        } else if (claimList.claimed.includes(currentDay)) {
            status = 'claimed';
        } else if (currentDay <= claimList.daysCount) {
            status = 'claiming';
        } else if (currentDay === claimList.daysCount + 1) {
            // Get today date
            const tmpDateToday = new Date();
            tmpDateToday.setDate(tmpDateToday.getDate() + 1);
            const todayStr = DateFormat(tmpDateToday, 'YYYY-MM-DD');

            // Get target date
            const tmpDate = new Date(claimList.start + 'T00:00:00');
            tmpDate.setDate(tmpDate.getDate() + claimList.daysCount);
            const targetDate = DateFormat(tmpDate, 'YYYY-MM-DD');

            if (todayStr === targetDate) {
                status = 'claim-tomorrow';
            }
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
        setLoading(false);

        if (result === 'error') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-claim-error-title'],
                    message: lang['alert-claim-error-message']
                },
                cancelable: false,
                priority: true
            });
            return;
        }

        props.handleClaim && props.handleClaim(props.index);
    };

    return (
        <View style={[styles.item, styleItem, props.style]}>
            <View style={[styles.content, styleOpacity]}>
                <Text style={styles.itemDay}>{textToday}</Text>

                {DAILY_QUEST_REWARDS[props.index].map((reward, index) => (
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

/** @param {{ item: DailyQuestRewardType }} props */
function RenderReward(props) {
    const styleReward = {
        ...styles.rewardItem,
        backgroundColor: themeManager.GetColor('background')
    };

    if (props.item.type === 'ox') {
        return (
            <View style={styleReward}>
                <Image style={styles.rewardImage} source={IMG_OX} />
                <Text style={styles.rewardValue}>{'x' + props.item.value.toString()}</Text>
            </View>
        );
    } else if (props.item.type === 'chest') {
        return (
            <View style={styleReward}>
                <Image style={styles.rewardImage} source={IMG_CHESTS[props.item.value]} />
            </View>
        );
    }

    return null;
}

export { RenderItemMemo };

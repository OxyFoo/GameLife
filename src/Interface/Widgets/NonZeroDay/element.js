import React from 'react';
import { View, Image } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import IMG_CHESTS from 'Ressources/items/chests/chests';
import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Text, Icon, Button } from 'Interface/Components';
import { GetTimeToTomorrow, TimeToFormatString } from 'Utils/Time';
import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Ressources/items/quests/NonZeroDay').NonZeroDayRewardType} NonZeroDayRewardType
 */

/**
 * @param {Object} props
 * @param {StyleProp} [props.style] Style of the container
 * @param {number} props.index Selected day
 * @param {number} props.claimIndex Index of the claim in the nonzeroquests.claimsList
 * @param {(index: number) => void} [props.onPress] Function called when the user press the button
 * @returns {JSX.Element}
 */
const RenderItem = (props) => {
    const lang = langManager.curr['nonzerodays'];
    const langD = langManager.curr['dates']['names'];
    const [ loading, setLoading ] = React.useState(false);

    const currentDay = props.index + 1;
    const textToday = langD['day'] + ' ' + currentDay.toString();

    /** @type {StyleProp[]} */
    const styleItem = [
        props.style || {},
        {
            backgroundColor: themeManager.GetColor('backgroundCard')
        }
    ];
    const styleBorder = {
        borderColor: '#B83EFFE3',
        borderWidth: 1.5
    };

    let timeToTomorrow;
    /** @type {'not-claimed' | 'claiming' | 'claim-in' | 'claimed'} */
    let status = 'not-claimed';

    if (props.claimIndex !== -1) {
        const allClaimLists = user.quests.nonzerodays.claimsList.Get();
        const claimList = allClaimLists[props.claimIndex];
        const isCurrent = props.claimIndex === allClaimLists.length - 1;

        if (claimList.claimed.includes(currentDay) || loading) {
            status = 'claimed';
        } else if (currentDay <= claimList.daysCount) {
            status = 'claiming';
        } else if (isCurrent && claimList.daysCount - currentDay === -1) {
            status = 'claim-in';
            timeToTomorrow = TimeToFormatString(GetTimeToTomorrow());
        } else if (isCurrent && claimList.daysCount - currentDay === -2) {
            status = 'claim-in';
            timeToTomorrow = '1' + langD['day-min'] + ' ' + TimeToFormatString(GetTimeToTomorrow());
        }
    }

    const styleOpacity = {
        opacity: status === 'claimed' ? 0.5 : 1
    };

    const handleEvent = async () => {
        if (loading || props.claimIndex === -1) return;

        setLoading(true);
        const claimList = user.quests.nonzerodays.claimsList.Get()[props.claimIndex];
        const result = await user.quests.nonzerodays.ClaimReward(claimList.start, props.index);
        setLoading(false);

        if (result === false) {
            const title = lang['alert-claim-error-title'];
            const text = lang['alert-claim-error-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        props.onPress && props.onPress(props.index);
    }

    return (
        <View style={[styles.item, styleItem]}>
            <View style={[styles.content, styleOpacity]}>
                <Text style={styles.itemDay}>{textToday}</Text>

                {
                    NONZERODAYS_REWARDS[props.index].map((reward, index) => (
                        RenderReward({ item: reward, index })
                    ))
                }
            </View>

            <View style={styles.claimState}>
                {status === 'claiming' && (
                    <Button
                        style={[styles.claimButton, styleBorder]}
                        color='transparent'
                        onPress={handleEvent}
                    >
                        {lang['claim']}
                    </Button>
                )}
                {status === 'claim-in' && (
                    <Button
                        style={styles.claimButton}
                        fontSize={12}
                        color='transparent'
                        colorText='primary'
                    >
                        {lang['claim-in'].replace('{}', timeToTomorrow)}
                    </Button>
                )}
                {status === 'claimed' && (
                    <Icon icon='check' color='success' />
                )}
            </View>
        </View>
    );
}

const RenderItemMemo = React.memo(RenderItem, (prevProps, nextProps) => {
    if (prevProps.index !== nextProps.index) {
        return false;
    }
    if (prevProps.claimIndex !== nextProps.claimIndex) {
        return false;
    }
    return true;
});

/** @param {{ item: NonZeroDayRewardType, index: number }} props */
function RenderReward(props) {
    const styleReward = {
        ...styles.rewardItem,
        backgroundColor: themeManager.GetColor('background')
    };

    if (props.item.type === 'ox') {
        return (
            <View key={`nzd-reward-${props.index}`} style={styleReward}>
                <Image
                    style={styles.rewardImage}
                    source={IMG_OX}
                />
                <Text style={styles.rewardValue}>
                    {'x' + props.item.value.toString()}
                </Text>
            </View>
        );
    }

    else if (props.item.type === 'chest') {
        return (
            <View key={`nzd-reward-${props.index}`} style={styleReward}>
                <Image
                    style={styles.rewardImage}
                    source={IMG_CHESTS[props.item.value - 1]}
                />
            </View>
        );
    }
}

export { RenderItemMemo };

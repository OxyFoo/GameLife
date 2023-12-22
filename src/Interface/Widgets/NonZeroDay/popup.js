import React from 'react';
import { View, FlatList, Image } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';
import { IMG_OX, IMG_CHESTS } from './images';

import { Text, Icon, Button } from 'Interface/Components';
import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';
import { GetTimeToTomorrow, TimeToFormatString } from 'Utils/Time';

/**
 * @typedef {import('Ressources/items/quests/NonZeroDay').NonZeroDayRewardType} NonZeroDayRewardType
 */

function RenderPopup(props) {
    const lang = langManager.curr['nonzerodays'];
    const stylePopup = {
        backgroundColor: themeManager.GetColor('background')
    };

    const claimIndex = user.quests.nonzerodays.claimsList
        .findIndex(claimList => claimList.daysCount !== claimList.claimed.length);
    if (claimIndex === -1) {
        return (
            <View style={[styles.popup, stylePopup]}>
                <Text style={styles.popupText}>
                    {'[no-claim]'}
                </Text>
            </View>
        );
    }

    const claimTotal = user.quests.nonzerodays.GetConsecutiveDays();

    return (
        <View style={[styles.popup, stylePopup]}>
            <Text style={styles.popupText}>
                {lang['container-title']}
            </Text>

            <FlatList
                style={styles.popupFlatList}
                data={NONZERODAYS_REWARDS}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={10}
                renderItem={(props) => (
                    RenderItem({ ...props, claimIndex, claimTotal })
                )}
                getItemLayout={(data, index) => (
                    { length: 68, offset: 68 * index, index }
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

/** @param {{ item: Array<NonZeroDayRewardType>, index: number, claimIndex: number, claimTotal: number }} props */
function RenderItem(props) {
    const lang = langManager.curr['nonzerodays'];
    const langD = langManager.curr['dates']['names'];

    const currentDay = props.index + 1;
    const textToday = langD['day'] + ' ' + currentDay.toString();

    const styleItem = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };
    const styleDay = {
        backgroundColor: themeManager.GetColor('main1')
    };

    const claimList = user.quests.nonzerodays.claimsList[props.claimIndex];

    let timeToTomorrow;
    /** @type {'not-claimed' | 'claiming' | 'claim-in' | 'claimed'} */
    let status = 'not-claimed';
    if (claimList.claimed.includes(currentDay)) {
        status = 'claimed';
    } else if (currentDay <= claimList.daysCount) {
        status = 'claiming';
    } else if (currentDay <= props.claimTotal) {
        status = 'claim-in';
        timeToTomorrow = TimeToFormatString(GetTimeToTomorrow());
        if (props.claimTotal - currentDay === 1) {
            timeToTomorrow = '1 ' + langD['day-min'] + ' ' + timeToTomorrow;
        }
    }

    const event = async () => {
        const result = await user.quests.nonzerodays.ClaimReward(claimList.start, props.index);

        if (result === false) {
            const title = lang['alert-claim-error-title'];
            const text = lang['alert-claim-error-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }
    }

    return (
        <View style={[styles.item, styleItem]}>
            <View style={styles.content}>
                <Text style={[styles.itemDay, styleDay]}>{textToday}</Text>

                {
                    props.item.map((reward, index) => (
                        RenderReward({ item: reward, index })
                    ))
                }
            </View>

            <View style={styles.claimState}>
                {status === 'claiming' && (
                    <Button
                        style={styles.claimButton}
                        color='transparent'
                        colorText='main1'
                        onPress={event}
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

export default RenderPopup;

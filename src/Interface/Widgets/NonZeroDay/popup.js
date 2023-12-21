import React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Icon, Button } from 'Interface/Components';
import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';

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

    return (
        <View style={[styles.popup, stylePopup]}>
            <Text style={styles.popupText}>
                {lang['container-title']}
            </Text>

            <FlatList
                style={styles.popupFlatList}
                data={NONZERODAYS_REWARDS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(props) => RenderItem({ ...props, claimIndex })}
                initialNumToRender={10}
                getItemLayout={(data, index) => (
                    { length: 60, offset: 60 * index, index }
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

/** @param {{ item: Array<NonZeroDayRewardType>, index: number, claimIndex: number }} props */
function RenderItem(props) {
    const lang = langManager.curr['dates']['names'];

    const currentDay = props.index + 1;
    const textToday = lang['day'] + ' ' + currentDay.toString();

    const styleItem = {
        backgroundColor: themeManager.GetColor('backgroundCard')
    };
    const styleDay = {
        backgroundColor: themeManager.GetColor('main1')
    };
    const styleReward = {
        backgroundColor: themeManager.GetColor('background')
    };

    const claimList = user.quests.nonzerodays.claimsList[props.claimIndex];

    /** @type {'notclaimed' | 'claiming' | 'claimed'} */
    let status = 'notclaimed';
    if (claimList.claimed.includes(currentDay)) {
        status = 'claimed';
    } else if (claimList.daysCount >= currentDay) {
        status = 'claiming';
    }

    return (
        <View style={[styles.item, styleItem]}>
            <View style={styles.content}>
                <Text style={[styles.itemDay, styleDay]}>{textToday}</Text>

                <FlatList
                    data={props.item}
                    style={styles.flatlistReward}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item: reward }) => (
                        <View style={[styles.itemReward, styleReward]}>
                            <Text>{reward.type}</Text>
                            <Text>{reward.value.toString()}</Text>
                        </View>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={styles.flatlistRewardSeparation} />
                    )}
                    horizontal={true}
                    scrollEnabled={false}
                />
            </View>

            <View style={styles.itemState}>
                {status === 'notclaimed' && (
                    <Icon icon='cross' color='error' />
                )}
                {status === 'claiming' && (
                    <Button style={styles.itemButton} color='main1' colorText='primary'>{'[CLAIM]'}</Button>
                )}
                {status === 'claimed' && (
                    <Icon icon='check' color='success' />
                )}
            </View>
        </View>
    );
}

export default RenderPopup;

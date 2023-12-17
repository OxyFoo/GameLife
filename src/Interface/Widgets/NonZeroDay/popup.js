import React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Icon, Text } from 'Interface/Components';
import NONZERODAYS_REWARDS from 'Ressources/items/quests/NonZeroDay';

/**
 * @typedef {import('Ressources/items/quests/NonZeroDay').NonZeroDayRewardType} NonZeroDayRewardType
 */

function RenderPopup(props) {
    const lang = langManager.curr['nonzerodays'];
    const stylePopup = {
        backgroundColor: themeManager.GetColor('background')
    };

    return (
        <View style={[styles.popup, stylePopup]}>
            <Text style={styles.popupText}>
                {lang['container-title']}
            </Text>

            <FlatList
                style={styles.popupFlatList}
                data={NONZERODAYS_REWARDS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(RenderItem)}
            />
        </View>
    );
}

/** @param {{ item: Array<NonZeroDayRewardType>, index: number }} props */
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
                <Icon icon='check' color='success' />
            </View>
        </View>
    );
}

export default RenderPopup;

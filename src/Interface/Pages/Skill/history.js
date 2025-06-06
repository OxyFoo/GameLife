import React from 'react';
import { Animated, View } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';
import styles from './style';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('./back').HistoryActivityItem} HistoryActivityItem
 * @typedef {import('react-native').ListRenderItem<HistoryActivityItem>} FlatListRenderItem
 *
 * @typedef {object} HistoryActivitiesPropsType
 * @property {HistoryActivityItem[]} items
 */

/**
 * @param {HistoryActivitiesPropsType} props
 * @returns {JSX.Element}
 */
function HistoryView(props) {
    const lang = langManager.curr['skill'];

    /** @type {ViewStyle} */
    const styleSeparator = {
        backgroundColor: themeManager.GetColor('white')
    };

    return (
        <View>
            <Text style={styles.historyTitle}>{lang['history-title']}</Text>

            <View style={[styles.historySeparator, styleSeparator]} />

            <Animated.FlatList
                ref={user.interface.bottomPanel?.mover.SetScrollView}
                style={styles.historyFlatList}
                onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                data={props.items}
                keyExtractor={ExtractKey}
                renderItem={RenderElement}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={10}
                scrollEnabled={false}
            />
        </View>
    );
}

/** @param {HistoryActivityItem} item */
function ExtractKey(item) {
    return `history-activity-${item.title}-start-${item.activity.startTime}`;
}

/** @type {FlatListRenderItem} */
function RenderElement({ item }) {
    return (
        <Button style={styles.historyItem} onPress={item.onPress} appearance='uniform' color='transparent'>
            {item.title}
        </Button>
    );
}

export default HistoryView;

import React from 'react';
import { Animated, View } from 'react-native';

import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('./back').TitleItem} TitleItem
 * @typedef {import('react-native').ListRenderItem<TitleItem>} FlatListRenderItem
 *
 * @typedef {object} TitlesPanelPropsType
 * @property {TitleItem[]} items
 * @property {(id: number) => void} [onTitleSelected]
 */

/**
 * @param {TitlesPanelPropsType} props
 * @returns {JSX.Element}
 */
function TitlesView(props) {
    const lang = langManager.curr['profile'];

    /** @type {ViewStyle} */
    const styleSeparator = {
        backgroundColor: themeManager.GetColor('white')
    };

    return (
        <View style={styles.titlesContainer}>
            <Text style={styles.titlesTitle}>{lang['input-select-title']}</Text>

            <View style={[styles.titlesSeparator, styleSeparator]} />

            <Animated.FlatList
                ref={user.interface.bottomPanel?.mover.SetScrollView}
                style={styles.titlesFlatList}
                onLayout={user.interface.bottomPanel?.mover.onLayoutFlatList}
                onContentSizeChange={user.interface.bottomPanel?.mover.onContentSizeChange}
                data={props.items}
                keyExtractor={ExtractKey}
                renderItem={({ item }) => {
                    return (
                        <Button
                            style={styles.titlesItem}
                            onPress={() => props.onTitleSelected?.(item.id)}
                            appearance='uniform'
                            color='transparent'
                        >
                            {item.text}
                        </Button>
                    );
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={5}
                windowSize={10}
                scrollEnabled={false}
            />
        </View>
    );
}

/** @param {TitleItem} item */
function ExtractKey(item) {
    return `title-selection-${item.id}`;
}

export default TitlesView;

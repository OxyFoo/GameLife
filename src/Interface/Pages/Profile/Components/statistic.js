import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';
import { popupContent } from 'Interface/Widgets/StatsBars/popup';

/**
 * @typedef {import('Managers/UserManager').Stats} Stats
 * @typedef {import('Class/Experience').XPInfo} XPInfo
 * @typedef {{ statKey: keyof Stats, experience: XPInfo }} StatsValues
 * @typedef {import('react-native').ListRenderItem<StatsValues>} ListRenderItemKeyStats
 */

/** @type {ListRenderItemKeyStats} */
function RenderStatistic({ item }) {
    const langStats = langManager.curr['statistics']['names'];

    const title = langStats[item.statKey];
    const value = item.experience.lvl;
    const lvlSize = value < 100 ? 18 : value < 1000 ? 14 : 12;

    return (
        <TouchableOpacity
            style={styles.view}
            activeOpacity={0.6}
            onPress={() =>
                user.interface.popup?.Open({
                    content: popupContent.bind(popupContent, item.statKey, user.stats)
                })
            }
        >
            <View
                style={[
                    styles.count,
                    {
                        backgroundColor: themeManager.GetColor('main1')
                    }
                ]}
            >
                <Text style={styles.text} fontSize={lvlSize} color='backgroundCard'>
                    {value}
                </Text>
            </View>
            <Text>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        marginBottom: 12
    },
    count: {
        minWidth: 32,
        minHeight: 32,
        paddingHorizontal: 0,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    text: {
        paddingHorizontal: 4,
        fontWeight: 'bold'
    }
});

export { RenderStatistic };

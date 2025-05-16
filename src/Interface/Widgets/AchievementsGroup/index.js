import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';

import styles from './style';
import AchievementsGroupBack from './back';
import langManager from 'Managers/LangManager';

import { Button, Separator, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Achievements').Achievement} Achievement
 * @typedef {import('react-native').ListRenderItem<Achievement>} ListRenderItemAchievements
 */

class AchievementsGroup extends AchievementsGroupBack {
    render() {
        const lang = langManager.curr['other'];
        const { style } = this.props;
        const { lastAchievements } = this.state;

        /** @type {StyleViewProp} */
        const btnMargin = {
            marginTop: lastAchievements.length > 0 ? 12 : 0
        };

        return (
            <View>
                <FlatList
                    style={style}
                    data={lastAchievements}
                    renderItem={this.renderAchievement}
                    keyExtractor={(item) => `skill-${item.ID}`}
                    ItemSeparatorComponent={() => <Separator style={styles.separator} color='main1' />}
                    scrollEnabled={false}
                />

                <Button style={[styles.btnSmall, btnMargin]} onPress={this.openAchievements}>
                    {lang['widget-achievements-all']}
                </Button>
            </View>
        );
    }

    /** @type {ListRenderItemAchievements} */
    renderAchievement = ({ item }) => {
        if (item === null) return null;

        const { Name, ID } = item;
        const Title = langManager.GetText(Name);

        return (
            <TouchableOpacity onPress={() => this.onAchievementPress(ID)} activeOpacity={0.6}>
                <Text style={styles.text}>{Title}</Text>
            </TouchableOpacity>
        );
    };
}

export { AchievementsGroup };

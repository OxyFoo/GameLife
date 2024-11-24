import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import styles from './style';
import BackAchievements from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import StartHelp from './help';
import { Icon, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').DimensionValue} DimensionValue
 *
 * @typedef {import('./back').PanelAchievementType} PanelAchievementType
 * @typedef {import('react-native').ListRenderItem<PanelAchievementType>} AchievementListRenderItem
 */

class Achievements extends BackAchievements {
    render() {
        const lang = langManager.curr['achievements'];

        const styleFlatlist = {
            ...styles.flatlist,
            top: this.state.headerHeight
        };

        return (
            <View>
                <View onLayout={this.onLayout}>
                    <PageHeader
                        style={styles.pageHeader}
                        onBackPress={this.onBackPress}
                        onSecondaryIconPress={StartHelp.bind(this)}
                    />

                    {/** Title for multiplayer success */}
                    {this.friend !== null && (
                        <Text style={styles.achievementsPlayerTitle} fontSize={22}>
                            {lang['friend-title'].replace('{}', this.friend.username)}
                        </Text>
                    )}
                </View>

                <FlatList
                    style={styleFlatlist}
                    numColumns={2}
                    data={this.achievement}
                    keyExtractor={(item, i) => `achievement-${item.ID}-${i}`}
                    renderItem={this.renderAchievement}
                />
            </View>
        );
    }

    /** @type {AchievementListRenderItem} */
    renderAchievement = ({ item: achievement }) => {
        const { ID, Name, isSolved, GlobalPercentage } = achievement;

        /** @type {ViewStyle} */
        const style = {
            borderColor: isSolved ? themeManager.GetColor('main1') : '#888888',
            backgroundColor: themeManager.GetColor('backgroundGrey')
        };

        /** @type {ViewStyle} */
        const styleFilling = {
            // eslint-disable-next-line prettier/prettier
            width: /** @type {DimensionValue} */ (`${GlobalPercentage}%`),
            backgroundColor: themeManager.GetColor('main1')
        };

        return (
            <TouchableOpacity
                style={styles.achievementsContainer}
                onPress={() => this.onAchievementPress(ID)}
                activeOpacity={0.6}
            >
                <View style={[styles.achievementsBox, style]}>
                    <Text style={styles.title}>{Name}</Text>

                    {/** Global progression */}
                    <View style={styles.progressBar}>
                        <Text style={styles.progressionValue} color='secondary' fontSize={10}>
                            {GlobalPercentage + '%'}
                        </Text>
                        <Icon style={styles.progressBarIcon} icon='social' size={12} color='secondary' />
                        <View style={[styles.progressBarInner, styleFilling]} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

export default Achievements;

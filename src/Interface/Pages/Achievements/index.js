import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import styles from './style';
import BackAchievements from './back';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import StartHelp from './help';
import { Page, Text } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

/**
 * @typedef {import('./back').PanelAchievementType} PanelAchievementType
 * @typedef {import('react-native').ListRenderItem<PanelAchievementType>} AchievementListRenderItem
 */

class Achievements extends BackAchievements {
    render() {
        const styleFlatlist = {
            ...styles.flatlist,
            top: this.state.headerHeight
        };

        return (
            <Page ref={ref => this.refPage = ref} scrollable={false}>
                <View onLayout={this.onLayout}>
                    <PageHeader
                        onBackPress={user.interface.BackHandle}
                        onHelpPress={StartHelp.bind(this)}
                    />
                </View>

                <FlatList
                    style={styleFlatlist}
                    numColumns={2}
                    data={this.achievement}
                    keyExtractor={(item, i) => 'achievement-' + i}
                    renderItem={this.renderAchievement}
                />
            </Page>
        );
    }

    /** @type {AchievementListRenderItem} */
    renderAchievement = ({ item: achievement }) => {
        const { ID, Name, isSolved, GlobalPercentage } = achievement;

        const style = {
            borderColor: isSolved ? themeManager.GetColor('main1') : '#888888',
            backgroundColor: themeManager.GetColor('backgroundGrey')
        };
        const styleFilling = {
            width: GlobalPercentage + '%',
            backgroundColor: themeManager.GetColor('main1')
        };

        return (
            <TouchableOpacity
                style={styles.achievementsContainer}
                onPress={() => this.onAchievementPress(ID)}
                activeOpacity={.6}
            >
                <View style={[styles.achievementsBox, style]}>
                    <Text style={styles.title}>{Name}</Text>

                    {/** Global progression */}
                    <View style={styles.progressBar}>
                        <Text style={styles.progressionValue} color='secondary' fontSize={10}>
                            {GlobalPercentage + '%'}
                        </Text>
                        <View style={[styles.progressBarInner, styleFilling]} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default Achievements;

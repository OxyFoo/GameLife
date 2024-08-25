import React from 'react';
import { FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import StartHelp from './help';
import DailyQuestBack from './back';
import { RenderItemMemo } from './RewardPopup/element';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Text, Button, Icon, ProgressBar } from 'Interface/Components';

/**
 * @typedef {import('react-native').ListRenderItem<string>} ListRenderItemString
 */

class DailyQuest extends DailyQuestBack {
    render() {
        const { style } = this.props;

        return (
            <View style={style}>
                {this.renderHeader()}
                {this.renderBody()}
            </View>
        );
    }

    renderHeader = () => {
        const lang = langManager.curr['daily-quest'];

        return (
            <LinearGradient
                style={styles.headerStyle}
                colors={[
                    themeManager.GetColor('main2', { opacity: 0.65 }),
                    themeManager.GetColor('main2', { opacity: 0.25 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.buttonInfo}>
                    <Button
                        style={styles.headerButtonLeft}
                        appearance='uniform'
                        color='transparent'
                        //onPress={StartHelp.bind(this)}
                    >
                        <Icon containerStyle={styles.iconStaticHeader} icon={'info-circle-outline'} size={24} />
                    </Button>
                    <Text color={'primary'}>{lang['container-title']}</Text>
                </View>

                <Button
                    ref={this.refOpenStreakPopup}
                    style={styles.headerButtonRight}
                    appearance='uniform'
                    color='transparent'
                    onPress={this.openRewardPopup}
                >
                    <Icon containerStyle={styles.iconStaticHeader} icon={'arrow-left'} size={24} angle={180} />
                </Button>
            </LinearGradient>
        );
    };

    renderBody = () => {
        const lang = langManager.curr['daily-quest'];
        const { claimIndex, claimDay, claimDate } = this.state;
        const { selectedSkillsID, refreshesRemaining, progression } = this.state.dailyQuest;

        const REFRESH_PER_DAY = user.quests.dailyquest.config.refresh_count_per_day;
        const ACTIVITY_MINUTES_PER_DAY = user.quests.dailyquest.config.activity_minutes_per_day;

        // Daily quest is finished
        if (progression >= ACTIVITY_MINUTES_PER_DAY) {
            return (
                <View style={styles.viewFinished}>
                    {/* Claim date if not last streak */}
                    {claimDate !== null && (
                        <Text style={styles.containerDateText}>{lang['container-date'].replace('{}', claimDate)}</Text>
                    )}

                    <Text>{lang['label-finished']}</Text>
                    <RenderItemMemo style={styles.dailyFinished} index={claimDay} claimIndex={claimIndex} />
                </View>
            );
        }

        const skillsNames = selectedSkillsID
            .map((ID) => {
                const skill = dataManager.skills.GetByID(ID);
                if (skill === null) return null;
                return langManager.GetText(skill.Name);
            })
            .filter((name) => name !== null);

        const titleTime = lang['label-time']
            .replace('{0}', progression.toString())
            .replace('{1}', ACTIVITY_MINUTES_PER_DAY.toString());
        const titleReroll = lang['label-reroll']
            .replace('{0}', refreshesRemaining.toString())
            .replace('{1}', REFRESH_PER_DAY.toString());

        return (
            <LinearGradient
                style={styles.bodyStyle}
                colors={[
                    themeManager.GetColor('backgroundCard', { opacity: 0.65 }),
                    themeManager.GetColor('backgroundCard', { opacity: 0.25 })
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.viewTitle}>
                    <View style={styles.columnTitle}>
                        <Icon icon='clock-outline' size={20} />
                        <Text style={styles.title}>{titleTime}</Text>
                    </View>
                    <View style={styles.columnTitle}>
                        <Text style={styles.title}>{titleReroll}</Text>
                        <Icon icon='retry' size={18} color={refreshesRemaining > 0 ? 'primary' : 'secondary'} />
                    </View>
                </View>
                <View style={styles.viewProgression}>
                    <ProgressBar style={styles.progressBar} value={progression} maxValue={ACTIVITY_MINUTES_PER_DAY} />
                </View>
                <View style={styles.skillsItems}>
                    <FlatList
                        data={skillsNames}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `daily-${item}-${index}`}
                        scrollEnabled={false}
                    />
                </View>
            </LinearGradient>
        );
    };

    /** @type {ListRenderItemString} */
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.skillItem}>
                <Text>{item}</Text>
                <Button
                    style={styles.skillButton}
                    appearance='outline'
                    icon='retry'
                    iconSize={18}
                    onPress={() => user.quests.dailyquest.RefreshSkillSelection(index)}
                    enabled={this.state.dailyQuest.refreshesRemaining > 0}
                />
            </View>
        );
    };
}

export default DailyQuest;

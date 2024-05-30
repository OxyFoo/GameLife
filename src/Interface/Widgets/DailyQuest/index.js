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

import { SimpleContainer, Text, Button, Icon, XPBar } from 'Interface/Components';

/**
 * @typedef {import('react-native').ListRenderItem<string>} ListRenderItemString
 * 
 * @typedef {import('Class/Shop').Icons} Icons
 */

class DailyQuest extends DailyQuestBack {
    render() {
        return (
            <SimpleContainer
                ref={this.refContainer}
                style={this.props.style}
            >
                <SimpleContainer.Header>
                    {this.renderHeader()}
                </SimpleContainer.Header>

                <SimpleContainer.Body style={styles.containerItem}>
                    {this.renderBody()}
                </SimpleContainer.Body>
            </SimpleContainer>
        );
    }

    renderHeader = () => {
        const lang = langManager.curr['daily-quest'];
        const titleColors = ['#384065', '#B83EFFE3'];

        /** @type {Icons} */
        let icon = 'arrowLeft';

        return (
            <LinearGradient
                style={styles.headerStyle}
                colors={titleColors}
                start={this.gradientPos1}
                end={this.gradientPos2}
            >
                <View style={styles.buttonInfo}>
                    <Button
                        style={styles.headerButtonLeft}
                        onPress={StartHelp.bind(this)}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={'info'}
                            size={24}
                        />
                    </Button>
                    <Text color={'primary'}>
                        {lang['container-title']}
                    </Text>
                </View>

                {icon !== null && (
                    <Button
                        ref={this.refOpenStreakPopup}
                        style={styles.headerButtonRight}
                        onPress={this.openRewardPopup}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={icon}
                            size={24}
                            angle={180}
                        />
                    </Button>
                )}
            </LinearGradient>
        )
    }

    renderBody = () => {
        const lang = langManager.curr['daily-quest'];
        const { claimIndex, claimDay, claimDate } = this.state;
        const {
            selectedSkillsID,
            refreshesRemaining,
            progression
        } = this.state.dailyQuest;

        const REFRESH_PER_DAY = user.quests.dailyquest.config.refresh_count_per_day;
        const ACTIVITY_MINUTES_PER_DAY = user.quests.dailyquest.config.activity_minutes_per_day;

        // Daily quest is finished
        if (progression >= ACTIVITY_MINUTES_PER_DAY) {
            return (
                <View style={styles.viewFinished}>
                    {/* Claim date if not last streak */}
                    {claimDate !== null && (
                        <Text style={styles.containerDateText}>
                            {lang['container-date'].replace('{}', claimDate)}
                        </Text>
                    )}

                    <Text>{lang['label-finished']}</Text>
                    <RenderItemMemo
                        style={styles.dailyFinished}
                        index={claimDay}
                        claimIndex={claimIndex}
                    />
                </View>
            );
        }

        const skillsNames = selectedSkillsID.map(ID =>
            langManager.GetText(
                dataManager.skills.GetByID(ID).Name
            )
        );

        const titleTime = lang['label-time']
            .replace('{0}', progression.toString())
            .replace('{1}', ACTIVITY_MINUTES_PER_DAY.toString());
        const titleReroll = lang['label-reroll']
            .replace('{0}', refreshesRemaining.toString())
            .replace('{1}', REFRESH_PER_DAY.toString());

        return (
            <View>
                <View style={styles.viewTitle}>
                    <View style={styles.columnTitle}>
                        <Icon icon='alarmClock' size={20} />
                        <Text style={styles.title}>{titleTime}</Text>
                    </View>
                    <View style={styles.columnTitle}>
                        <Text style={styles.title}>{titleReroll}</Text>
                        <Icon
                            icon='retry'
                            size={18}
                            color={refreshesRemaining > 0 ? 'primary' : 'secondary'}
                        />
                    </View>
                </View>
                <View style={styles.viewProgression}>
                    <XPBar
                        style={styles.progressBar}
                        value={progression}
                        maxValue={ACTIVITY_MINUTES_PER_DAY}
                    />
                </View>
                <View style={styles.skillsItems}>
                    <FlatList
                        data={skillsNames}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }

    /** @type {ListRenderItemString} */
    renderItem = ({ item, index }) => {
        return (
            <View style={styles.skillItem}>
                <Text>{item}</Text>
                <Button
                    style={styles.skillButton}
                    icon='retry'
                    iconSize={18}
                    onPress={() => user.quests.dailyquest.RefreshSkillSelection(index)}
                    enabled={this.state.dailyQuest.refreshesRemaining > 0}
                />
            </View>
        );
    }
}

export default DailyQuest;

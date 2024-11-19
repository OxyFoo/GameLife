import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import DailyQuestBack from './back';
import { RenderItemMemo } from './RewardPopup/element';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { ACTIVITY_MINUTES_PER_DAY } from 'Data/User/DailyQuests';
import { Text, Button, Icon, ProgressBar } from 'Interface/Components';
import { OnlineView } from 'Interface/Primitives';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Data/User/DailyQuests').DailyQuestToday} DailyQuestToday
 * @typedef {import('Data/App/Skills').Category} SkillCategory
 */

class DailyQuest extends DailyQuestBack {
    render() {
        const { style } = this.props;
        const { claimDay } = this.state;

        return (
            <OnlineView offlineView={this.renderNoInternet()}>
                <this.renderContainer style={style} showStreak={claimDay} onStreakPress={this.openRewardPopup}>
                    {this.renderQuest()}
                </this.renderContainer>
            </OnlineView>
        );
    }

    /**
     * @param {object} props
     * @param {React.ReactNode} props.children
     * @param {StyleProp} [props.style]
     * @param {number | null} [props.showStreak=null] Show the streak button on the right side of the header (and open the reward popup) or null to hide it
     * @param {() => void} [props.onStreakPress] Callback when the streak button is pressed
     * @returns {React.ReactNode}
     */
    renderContainer({ children, style, showStreak = null, onStreakPress = undefined }) {
        const lang = langManager.curr['daily-quest'];

        return (
            <View style={style}>
                {/* Header */}
                <LinearGradient
                    style={styles.headerStyle}
                    colors={[
                        themeManager.GetColor('main2', { opacity: 0.65 }),
                        themeManager.GetColor('main2', { opacity: 0.25 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.headerTitle}>
                        <Text color={'primary'}>{lang['container-title']}</Text>
                    </View>

                    {showStreak !== null && (
                        <Button
                            style={styles.headerButtonRight}
                            appearance='uniform'
                            color='transparent'
                            onPress={onStreakPress}
                        >
                            <View style={styles.columnTitle}>
                                <Text style={styles.title}>{showStreak.toString()}</Text>
                                <Icon icon='flame' size={18} color='main2' />
                            </View>
                            {/* <Icon containerStyle={styles.iconStaticHeader} icon={'arrow-left'} size={24} angle={180} /> */}
                        </Button>
                    )}
                </LinearGradient>

                {/* Body */}
                <LinearGradient
                    style={styles.bodyStyle}
                    colors={[
                        themeManager.GetColor('backgroundCard', { opacity: 0.65 }),
                        themeManager.GetColor('backgroundCard', { opacity: 0.25 })
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    children={children}
                />
            </View>
        );
    }

    renderQuest = () => {
        const lang = langManager.curr['daily-quest'];
        const { dailyQuest, claimIndex, claimDay, claimDate } = this.state;

        const category = dataManager.skills.GetCategoryByID(dailyQuest?.selectedCategory ?? 0);

        // No daily quest or category
        if (dailyQuest === null || category === null) {
            return this.renderNoQuest();
        }

        const { progression } = dailyQuest;

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

        return this.renderProgression(dailyQuest, category);
    };

    /**
     * @param {DailyQuestToday} dailyQuest
     * @param {SkillCategory} category
     */
    renderProgression = (dailyQuest, category) => {
        const lang = langManager.curr['daily-quest'];
        const { progression } = dailyQuest;

        const titleTime = lang['label-time']
            .replace('{0}', progression.toString())
            .replace('{1}', ACTIVITY_MINUTES_PER_DAY.toString());
        const categoryIconXML = dataManager.skills.GetXmlByLogoID(category.LogoID);

        return (
            <>
                <View style={styles.viewTitle}>
                    <View style={styles.viewCategory}>
                        <Icon
                            style={styles.iconCategory}
                            xml={categoryIconXML}
                            size={24}
                            // @ts-ignore
                            color={category.Color}
                        />
                        <Text
                            style={styles.titleCategory}
                            // @ts-ignore
                            color={category.Color}
                        >
                            {langManager.GetText(category.Name)}
                        </Text>
                    </View>
                    <View style={styles.columnTitle}>
                        <Text style={styles.title}>{titleTime}</Text>
                        <Icon icon='clock-outline' size={20} />
                    </View>
                </View>
                <View style={styles.viewProgression}>
                    <ProgressBar style={styles.progressBar} value={progression} maxValue={ACTIVITY_MINUTES_PER_DAY} />
                </View>
            </>
        );
    };

    renderNoQuest = () => {
        const lang = langManager.curr['daily-quest'];
        const { style } = this.props;

        return (
            <this.renderContainer style={style} showStreak={null}>
                <View style={styles.viewNoInternet}>
                    <Text style={styles.textNoInternet}>{lang['no-quest']}</Text>
                </View>
            </this.renderContainer>
        );
    };

    renderNoInternet = () => {
        const lang = langManager.curr['daily-quest'];
        const { style } = this.props;

        return (
            <this.renderContainer style={style} showStreak={null}>
                <View style={styles.viewNoInternet}>
                    <Text style={styles.textNoInternet}>{lang['no-internet']}</Text>
                </View>
            </this.renderContainer>
        );
    };
}

export default DailyQuest;

import * as React from 'react';
import { View, ScrollView } from 'react-native';

import BackSkill from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';
import { Text, Icon, ProgressBar, Button, KPI, StreakCard } from 'Interface/Components';
import { PageHeader, SkillHistogram } from 'Interface/Widgets';

class Skill extends BackSkill {
    render() {
        const lang = langManager.curr['skill'];
        const langTime = langManager.curr['dates']['names'];
        const langLevel = langManager.curr['level'];

        const { selectedSkill, history, frequency, rateWindow } = this.state;

        const txtCurrXp = Round(selectedSkill.xp, 1);
        const txtNextXP = Round(selectedSkill.next, 1);
        const txtXP = langManager.curr['level']['xp'];
        const txtRate = lang['rate-text'].replace('{}', `${Math.round(frequency.rate * 100)}`);
        const txtWindow = rateWindow === null ? lang['rate-window-all'] : lang['rate-window-30'];

        return (
            <>
                <ScrollView style={styles.page}>
                    <PageHeader title={lang['title']} onBackPress={this.onBackPress} />

                    {/* Skill name and icon */}
                    <View style={styles.titleContainer}>
                        <Icon style={styles.activityIcon} xml={selectedSkill.xml} size={40} />
                        <View style={styles.activityTextView}>
                            <Text style={styles.activityText}>{selectedSkill.name}</Text>
                            <Text style={styles.categoryText}>
                                {lang['category-title']} {selectedSkill.category}
                            </Text>
                            {!selectedSkill.enabled && (
                                <Text style={styles.skillUnallocated} color='warning'>
                                    {lang['text-unallocated']}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Level and XP bar */}
                    <View style={styles.levelContainer}>
                        {selectedSkill.earnXp > 0 ? (
                            <>
                                <ProgressBar color='main1' value={selectedSkill.xp} maxValue={selectedSkill.next} />
                                <View style={styles.levelsView}>
                                    <Text fontSize={14}>{selectedSkill.level}</Text>
                                    <Text fontSize={14} color='secondary'>{`${txtCurrXp}/${txtNextXP} ${txtXP}`}</Text>
                                </View>
                            </>
                        ) : (
                            <Text>{lang['text-no-xp']}</Text>
                        )}
                    </View>

                    {/* Informations */}
                    <Text style={styles.title} color='border'>
                        {lang['informations-title']}
                    </Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.kpiRow}>
                            <View style={styles.kpiColumn}>
                                <KPI
                                    containerStyle={styles.kpiCell}
                                    title={langLevel['total']}
                                    value={history.length}
                                />
                                <KPI
                                    containerStyle={styles.kpiCell}
                                    title={langLevel['total-hour']}
                                    value={selectedSkill.totalDuration + ' ' + langTime['hours-min']}
                                />
                            </View>
                            <StreakCard
                                style={styles.streakCard}
                                title={lang['streak-title']}
                                current={frequency.currentStreak}
                                best={frequency.bestStreak}
                                bestText={lang['streak-max'].replace('{}', `${frequency.bestStreak}`)}
                                rateText={`${txtRate} · ${txtWindow}`}
                            />
                        </View>

                        {/* Daily histogram, its window button also drives the rate window */}
                        <SkillHistogram
                            style={styles.skillChart}
                            dailyMinutes={frequency.dailyMinutes}
                            firstDayIndex={frequency.firstDayIndex}
                            todayIndex={frequency.todayIndex}
                            windowDays={rateWindow}
                            windowLabel={txtWindow}
                            onWindowPress={this.toggleRateWindow}
                        />

                        {/* History */}
                        {history.length > 0 && (
                            <Button
                                style={styles.historyButton}
                                styleBackground={styles.historyButtonBackground}
                                appearance='outline'
                                color='main1'
                                onPress={this.showHistory}
                            >
                                {lang['history-show']}
                            </Button>
                        )}
                    </View>

                    {/* Creator */}
                    {selectedSkill.creator !== '' && (
                        <Text style={styles.creator} color='secondary'>
                            {selectedSkill.creator}
                        </Text>
                    )}
                </ScrollView>
            </>
        );
    }
}

export default Skill;

import * as React from 'react';
import { View, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackSkill from './back';
import styles from './style';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Round } from 'Utils/Functions';
import { Text, Icon, ProgressBar, Button, KPI } from 'Interface/Components';
import { PageHeader, SkillChart } from 'Interface/Widgets';

class Skill extends BackSkill {
    render() {
        const lang = langManager.curr['skill'];
        const langTime = langManager.curr['dates']['names'];
        const langLevel = langManager.curr['level'];

        const { selectedSkill, history } = this.state;

        const txtCurrXp = Round(selectedSkill.xp, 1);
        const txtNextXP = Round(selectedSkill.next, 1);
        const txtXP = langManager.curr['level']['xp'];

        return (
            <>
                <ScrollView style={styles.page}>
                    <PageHeader title={lang['title']} onBackPress={this.onBackPress} />

                    {/* Skill name and icon */}
                    <View style={styles.titleContainer}>
                        <LinearGradient
                            style={styles.gradient}
                            colors={[
                                themeManager.GetColor('main1', { opacity: 0.65 }),
                                themeManager.GetColor('main1', { opacity: 0.25 })
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Icon style={styles.activityIcon} xml={selectedSkill.xml} />
                            <View style={styles.activityTextView}>
                                <Text
                                    style={styles.activityText}
                                >{`${selectedSkill.name} - ${selectedSkill.category}`}</Text>
                                {!selectedSkill.enabled && (
                                    <Text style={styles.skillUnallocated} color='warning'>
                                        {lang['text-unallocated']}
                                    </Text>
                                )}
                            </View>
                        </LinearGradient>

                        {/* Creator */}
                        {selectedSkill.creator !== '' && (
                            <Text style={styles.creator} color='secondary'>
                                {selectedSkill.creator}
                            </Text>
                        )}
                    </View>

                    {/* Level and XP bar */}
                    <View style={styles.levelContainer}>
                        {selectedSkill.earnXp > 0 ? (
                            <>
                                <ProgressBar color='main1' value={selectedSkill.xp} maxValue={selectedSkill.next} />
                                <View style={styles.levelsView}>
                                    <Text>{selectedSkill.level}</Text>
                                    <Text>{`${txtCurrXp}/${txtNextXP} ${txtXP}`}</Text>
                                </View>
                            </>
                        ) : (
                            <Text>{lang['text-no-xp']}</Text>
                        )}
                    </View>

                    {/* KPI place */}
                    <Text style={styles.title} color='border'>
                        {lang['informations-title']}
                    </Text>
                    <View style={styles.kpiContainer}>
                        <KPI style={styles.kpiLeft} title={langLevel['total']} value={history.length} />
                        <KPI
                            style={styles.kpiRight}
                            title={langLevel['total-hour']}
                            value={selectedSkill.totalDuration + ' ' + langTime['hours-min']}
                        />
                    </View>

                    {/* Skill use chart */}
                    <Text style={styles.title} color='border'>
                        {lang['history-activity']}
                    </Text>
                    {selectedSkill.ID !== 0 && (
                        <SkillChart
                            // TODO : Update the graph more properly
                            key={`activities-length-${history.length}`}
                            style={styles.skillChart}
                            skillID={selectedSkill.ID}
                            chartWidth={300}
                        />
                    )}

                    {/* History */}
                    {history.length > 0 && (
                        <Button
                            style={styles.historyButton}
                            appearance='uniform'
                            color='main1'
                            onPress={this.showHistory}
                        >
                            {lang['history-show']}
                        </Button>
                    )}
                </ScrollView>

                {/* Absolute add button */}
                {selectedSkill.enabled && (
                    <Button
                        style={styles.addActivity}
                        appearance='uniform'
                        color='main2'
                        onPress={this.addActivity}
                        icon='add-outline'
                        iconSize={30}
                    />
                )}
            </>
        );
    }
}

export default Skill;

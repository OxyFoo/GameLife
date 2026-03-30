import * as React from 'react';
import { View, ScrollView } from 'react-native';

import BackSkill from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

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

                    {/* KPI place */}
                    <Text style={styles.title} color='border'>
                        {lang['informations-title']}
                    </Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.kpiContainer}>
                            <KPI containerStyle={styles.kpiLeft} title={langLevel['total']} value={history.length} />
                            <KPI
                                containerStyle={styles.kpiRight}
                                title={langLevel['total-hour']}
                                value={selectedSkill.totalDuration + ' ' + langTime['hours-min']}
                            />
                        </View>

                        {/* Skill use chart */}
                        {selectedSkill.ID !== 0 && (
                            <SkillChart
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

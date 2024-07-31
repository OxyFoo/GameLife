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

        const txtCurrXp = Round(this.skill.xp, 1);
        const txtNextXP = Round(this.skill.next, 1);
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
                            <Icon style={styles.activityIcon} xml={this.skill.xml} />
                            <View style={styles.activityTextView}>
                                <Text style={styles.activityText}>{`${this.skill.name} - ${this.skill.category}`}</Text>
                                {!this.skill.enabled && (
                                    <Text style={styles.skillUnallocated} color='warning'>
                                        {lang['text-unallocated']}
                                    </Text>
                                )}
                            </View>
                        </LinearGradient>

                        {/* Creator */}
                        {this.skill.creator !== '' && (
                            <Text style={styles.creator} color='secondary'>
                                {this.skill.creator}
                            </Text>
                        )}
                    </View>

                    {/* Level and XP bar */}
                    <View style={styles.levelContainer}>
                        {this.skill.earnXp > 0 ? (
                            <>
                                <ProgressBar color='main1' value={this.skill.xp} maxValue={this.skill.next} />
                                <View style={styles.levelsView}>
                                    <Text>{this.skill.level}</Text>
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
                        <KPI
                            style={styles.kpiLeft}
                            title={langLevel['total-hour']}
                            value={this.skill.totalDuration + ' ' + langTime['hours-min']}
                        />
                        <KPI style={styles.kpiRight} title={langLevel['total']} value={this.skill.totalFloatXp} />
                    </View>

                    {/* Skill use chart */}
                    <Text style={styles.title} color='border'>
                        {lang['history-activity']}
                    </Text>
                    {this.skill.ID !== 0 && (
                        <SkillChart style={styles.skillChart} skillID={this.skill.ID} chartWidth={300} />
                    )}

                    {/* History */}
                    <Button appearance='uniform' color='main1' onPress={this.showHistory}>
                        {lang['history-show']}
                    </Button>
                </ScrollView>

                {/* Absolute add button */}
                {this.skill.enabled && (
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

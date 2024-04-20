import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import BackSkill from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Round } from 'Utils/Functions';
import { Page } from 'Interface/Global';
import { Container, Text, Icon, XPBar, Button, KPI } from 'Interface/Components';
import { PageHeader, ActivityPanel, SkillChart, StatsBars } from 'Interface/Widgets';

/**
 * @typedef {import('react-native').ListRenderItem<HistoryActivity>} ListRenderItemHistoryActivity
 * 
 * @typedef {import('./back').HistoryActivity} HistoryActivity
 */

class Skill extends BackSkill {
    render() {
        const lang = langManager.curr['skill'];
        const langTime = langManager.curr['dates']['names'];
        const langLevel = langManager.curr['level'];
        const backgroundMain = { backgroundColor: themeManager.GetColor('main1') };

        const txtCurrXp = Round(this.skill.xp, 1);
        const txtNextXP = Round(this.skill.next, 1);
        const txtXP = langManager.curr['level']['xp'];

        return (
            <Page
                ref={ref => this.refPage = ref}
                bottomOffset={104}
                overlay={this.renderOverlay()}
                footer={this.renderFooter()}
            >
                <PageHeader onBackPress={user.interface.BackHandle} />

                {/* Skill name and icon */}
                <View style={styles.skillContainer}>
                    <View style={[styles.pictureContainer, backgroundMain]}>
                        <Icon size={84} xml={this.skill.xml} />
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.skillTitle}>{this.skill.name}</Text>
                        <Text style={styles.skillCategory}>{this.skill.category}</Text>
                        {!this.skill.enabled && (
                            <Text style={styles.skillUnallocated}>
                                {lang['text-unallocated']}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Level and XP bar */}
                <View style={styles.levelContainer}>
                    <View style={styles.level}>
                        <Text>{this.skill.level}</Text>
                        <Text>{`${txtCurrXp}/${txtNextXP} ${txtXP}`}</Text>
                    </View>
                    <XPBar value={this.skill.xp} maxValue={this.skill.next} />

                    {this.skill.creator !== '' && (
                        <Text style={styles.creator} color='secondary'>{this.skill.creator}</Text>
                    )}
                </View>

                {/* KPI place */}
                <View style={styles.kpiContainer}>
                    <KPI
                        title={langLevel['total-hour']}
                        value={this.skill.totalDuration}
                        unit={langTime['hours-min']}
                        style={[styles.statsContainer]}
                    />
                    <KPI
                        title={langLevel['total']}
                        value={this.skill.totalFloatXp}
                        style={[styles.statsContainer]}
                    />
                </View>

                {/* Skill use chart */}
                {this.skill.ID !== 0 && (
                    <SkillChart
                        skillID={this.skill.ID}
                        chartWidth={300}
                        style={styles.statsContainer}
                    />
                )}

                {/* Stats */}
                <Container
                    text={lang['stats-title']}
                    style={styles.statsContainer}
                    type='rollable'
                    opened={false}
                >
                    <StatsBars data={user.stats} supData={this.skill.stats} />
                </Container>

                {/* History */}
                {this.history.length > 0 && (
                    <Container
                        styleContainer={styles.historyContainer}
                        text={lang['history-title']}
                        type='rollable'
                        opened={false}
                    >
                        <FlatList
                            data={this.history}
                            keyExtractor={(item, i) => 'history_' + i}
                            renderItem={this.renderHistoryItem}
                            numColumns={2}
                            initialNumToRender={100}
                            onTouchStart={() => {
                                user.interface.GetCurrentPage()?.refPage?.DisableScroll();
                            }}
                            onTouchEnd={() => {
                                user.interface.GetCurrentPage()?.refPage?.EnableScroll();
                            }}
                            onTouchCancel={() => {
                                user.interface.GetCurrentPage()?.refPage?.EnableScroll();
                            }}
                        />
                    </Container>
                )}
            </Page>
        );
    }

    /** @type {ListRenderItemHistoryActivity} */
    renderHistoryItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.historyItem}
                activeOpacity={0.6}
                onPress={item.onPress}
            >
                <Text>{item.title}</Text>
            </TouchableOpacity>
        );
    }

    renderOverlay = () => {
        return (
            <ActivityPanel
                ref={ref => this.refActivityPanel = ref}
                topOffset={200}
            />
        );
    }

    renderFooter() {
        if (!this.skill.enabled) {
            return null;
        }

        // Add activity button
        return (
            <Button
                style={styles.addActivity}
                color='main2'
                onPress={this.addActivity}
                icon='add'
                iconSize={30}
            />
        );
    }
}

export default Skill;

import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import BackSkill from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { PageHeader, StatsBars, ActivityPanel } from 'Interface/Widgets';
import { Page, Container, Text, Icon, XPBar, Button, BarChart } from 'Interface/Components';

/** @typedef {import('./back').HistoryActivity} HistoryActivity */

class Skill extends BackSkill {
    /**
     * @param {{ item: HistoryActivity }} item
     * @returns {JSX.Element}
     */
    renderHistoryItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={item.onPress}>
                <Text style={styles.textHistory}>{item.title}</Text>
            </TouchableOpacity>
        );
    }

    renderActivity = () => {
        return (
            <ActivityPanel
                ref={ref => this.refActivityPanel = ref}
                topOffset={200}
            />
        );
    }

    renderFooter() {
        const lang = langManager.curr['skill'];

        // Add activity button
        return (
            <Button
                style={styles.addActivity}
                color='main2'
                onPress={this.addActivity}
            >
                {lang['text-add']}
            </Button>
        );
    }

    render() {
        const lang = langManager.curr['skill'];
        const backgroundMain = { backgroundColor: themeManager.GetColor('main1') };


        if (!this.skill) {
            return null;
        }

        return (
            <Page
                ref={ref => this.refPage = ref}
                bottomOffset={104}
                overlay={this.renderActivity()}
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
                            <Text style={styles.skillUnallocated}>{lang['text-unallocated']}</Text>
                        )}
                    </View>
                </View>

                {/* Level and XP bar */}
                <View style={styles.levelContainer}>
                    <View style={styles.level}>
                        <Text>{this.skill.level}</Text>
                        <Text>{this.skill.totalXP}</Text>
                    </View>
                    <XPBar value={this.skill.xp} maxValue={this.skill.next} />

                    {this.skill.creator !== '' && (
                        <Text style={styles.creator} color='secondary'>{this.skill.creator}</Text>
                    )}
                </View>

                {/* Line chart */}
                <BarChart
                    skillID={this.skillID}
                    chartWidth={300}
                />

                {/* Stats */}
                <Container
                    text={lang['stats-title']}
                    style={styles.statsContainer}
                    type='rollable'
                    opened={true}
                >
                    <StatsBars data={user.stats} supData={this.skill.stats} />
                </Container>

                {/* History */}
                {this.history.length > 0 && (
                    <Container text={lang['history-title']} type='rollable' opened={false}>
                        <FlatList
                            data={this.history}
                            keyExtractor={(item, i) => 'history_' + i}
                            renderItem={this.renderHistoryItem}
                        />
                    </Container>
                )}
            </Page>
        );
    }
}

export default Skill;
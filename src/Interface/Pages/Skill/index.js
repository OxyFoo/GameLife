import * as React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import BackSkill from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { PageHeader, StatsBars } from 'Interface/Widgets';
import { Page, Container, Text, Icon, XPBar, Button } from 'Interface/Components';

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

        return (
            <Page
                ref={ref => this.refPage = ref}
                bottomOffset={104}
                footer={this.renderFooter()}
            >
                <PageHeader onBackPress={this.onBackPress} hideHelp />

                {/* Skill name and icon */}
                <View style={styles.skillContainer}>
                    <View style={[styles.pictureContainer, backgroundMain]}>
                        <Icon size={84} xml={this.skill.xml} />
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.skillTitle}>{this.skill.name}</Text>
                        <Text style={styles.skillCategory}>{this.skill.category}</Text>
                    </View>
                </View>

                {/* Level and XP bar */}
                <View style={styles.levelContainer}>
                    <Text style={styles.levelText}>{this.skill.level}</Text>
                    <XPBar value={this.skill.xp} maxValue={this.skill.next} />

                    {this.skill.creator !== '' && (
                        <Text style={styles.creator} color='secondary'>{this.skill.creator}</Text>
                    )}
                </View>

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
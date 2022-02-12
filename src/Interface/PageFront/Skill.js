import * as React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import BackSkill from '../PageBack/Skill';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { DateToFormatString } from '../../Utils/Time';
import { PageHeader, StatsBars } from '../Widgets';
import { Page, Container, Text, Icon, XPBar, Button } from '../Components';

class Skill extends BackSkill {
    renderHistoryItem = ({item, i}) => {
        const date = DateToFormatString(item.startTime * 1000);
        const text = langManager.curr['skill']['text-history'];
        const duration = item.duration;
        const title = text.replace('{}', date).replace('{}', duration);
        const onPress = () => { user.interface.ChangePage('activity', { 'activity': item }); }
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                <Text style={styles.textHistory}>{title}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const lang = langManager.curr['skill'];
        const userStats = user.experience.GetExperience().xpInfo;
        const backgroundMain = { backgroundColor: themeManager.GetColor('main1') };

        return (
            <>
                <Page canScrollOver={false} bottomOffset={96}>
                    <PageHeader onBackPress={user.interface.BackPage} hideHelp />

                    {/* Content */}
                    <View style={styles.skillContainer}>
                        <View style={[styles.pictureContainer, backgroundMain]}>
                            <Icon size={84} xml={this.xml} />
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.bigText}>{this.name}</Text>
                            <Text style={styles.smallText}>{this.category}</Text>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: '2%', marginBottom: 24 }}>
                        <Text style={styles.levelText}>{this.level}</Text>
                        <XPBar value={userStats.xp} maxValue={userStats.next} />

                        {this.creator !== '' && (
                            <Text style={styles.creator} color='secondary'>{this.creator}</Text>
                        )}
                    </View>

                    <Container text={lang['stats-title']} style={{ marginBottom: 24 }} type='rollable' opened={true}>
                        <StatsBars data={user.stats} supData={this.stats} />
                    </Container>

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

                <Button
                    style={styles.addActivity}
                    color='main2'
                    onPress={this.addActivity}
                >
                    {lang['text-add']}
                </Button>
            </>
        )
    }
}

const styles = StyleSheet.create({
    skillContainer: {
        flexDirection: 'row',
        marginBottom: 24
    },
    pictureContainer: {
        marginLeft: 6,
        marginRight: 24,
        padding: 16,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 12
    },
    detailContainer: {
        flex: 1,
        paddingVertical: '5%',
        justifyContent: 'space-evenly'
    },
    bigText: {
        fontSize: 32,
        textAlign: 'left'
    },
    smallText: {
        fontSize: 22,
        textAlign: 'left'
    },
    levelText: {
        marginBottom: 6,
        textAlign: 'left'
    },
    creator: {
        marginTop: 12,
        fontSize: 18,
        textAlign: 'left'
    },
    textHistory: {
        padding: '5%'
    },

    addActivity: {
        position: 'absolute',
        left: 36,
        right: 36,
        bottom: 36
    }
});

export default Skill;
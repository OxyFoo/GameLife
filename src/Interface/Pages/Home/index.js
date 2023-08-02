import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackHome from './back';
import langManager from 'Managers/LangManager';

import { StatsBars, SkillsGroup } from 'Interface/Widgets';
import { Button, Container, Swiper, Text, XPBar, Page, News } from 'Interface/Components';

class Home extends BackHome {
    render() {
        const {
            experience: { stats, xpInfo },
            values: { current_level, next_level }
        } = this.state;

        const lang = langManager.curr['home'];
        const txt_level = langManager.curr['level']['level'];

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <View style={styles.XPHeader}>
                    <View style={styles.XPHeaderLvl}>
                        <Text style={styles.level}>{txt_level}</Text>
                        <Text color='main2'>{current_level}</Text>
                    </View>
                    <Text>{next_level + '%'}</Text>
                </View>

                <XPBar
                    value={xpInfo.xp}
                    maxValue={xpInfo.next}
                />

                <Swiper
                    style={styles.topSpace}
                    pages={News()}
                />

                <Button
                    style={styles.topSpace}
                    color='main2'
                    borderRadius={8}
                    icon='add'
                    onPress={this.addActivity}
                >
                    {lang['btn-add-task']}
                </Button>

                {/*
                <Button
                    style={styles.topSpace}
                    color='main1'
                    borderRadius={8}
                    icon='chrono'
                    onPress={this.openTasks}
                >
                    {lang['btn-todo']}
                </Button>
                */}

                <Button
                    style={styles.topSpace}
                    color='backgroundCard'
                    rippleColor='white'
                    borderRadius={8}
                    icon='setting'
                    onPress={this.openSettings}
                >
                    {lang['btn-settings']}
                </Button>

                {/*<Button style={styles.topSpace} color='main1' borderRadius={8} icon='chrono'>{lang['btn-quests']}</Button>*/}

                <Container
                    style={styles.topSpace}
                    text={lang['con-stats']}
                    type='rollable'
                    opened={false}
                    color='main3'
                    rippleColor='white'
                >
                    <StatsBars data={stats} />
                </Container>

                <Container
                    style={styles.topSpace}
                    text={lang['con-skill-experience']}
                    type='rollable'
                    opened={false}
                    color='main3'
                    rippleColor='white'
                >
                    <SkillsGroup />
                </Container>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    XPHeader: {
        marginTop: 16,
        marginBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    XPHeaderLvl: {
        flexDirection: 'row'
    },
    level: {
        marginRight: 8
    },

    topSpace: {
        marginTop: 24
    }
});

export default Home;
import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackHome from './back';
import langManager from 'Managers/LangManager';

import { Round } from 'Utils/Functions';
import { StatsBars, SkillsGroup } from 'Interface/Widgets';
import { Button, Container, Swiper, Text, XPBar, Page, News } from 'Interface/Components';

class Home extends BackHome {
    render() {
        const { experience: { stats, xpInfo } } = this.state;
        const lang = langManager.curr['home'];

        const nextLvlPc = Round(100 * xpInfo.xp / xpInfo.next, 0);
        const lvl = langManager.curr['level']['level'];

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <View style={styles.XPHeader}>
                    <View style={styles.XPHeaderLvl}>
                        <Text style={{ marginRight: 8 }}>{lvl}</Text>
                        <Text color='main2'>{xpInfo.lvl}</Text>
                    </View>
                    <Text>{nextLvlPc}%</Text>
                </View>
                <XPBar value={xpInfo.xp} maxValue={xpInfo.next} />

                <Swiper style={styles.topSpace} pages={News()} />

                <Button
                    style={styles.topSpace}
                    color='main2'
                    borderRadius={8}
                    icon='add'
                    onPress={this.addActivity}
                >
                    {lang['btn-add-task']}
                </Button>

                <Button
                    style={styles.topSpace}
                    color='main1'
                    borderRadius={8}
                    icon='chrono'
                    onPress={this.openTasks}
                >
                    {lang['btn-todo']}
                </Button>

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
                    <SkillsGroup
                        showAllButton={true}
                    />
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

    topSpace: {
        marginTop: 24
    }
});

export default Home;
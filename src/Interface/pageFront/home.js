import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import BackHome from '../pageBack/home';
import { round } from '../../Functions/Functions';
import { UserHeader, StatsBars } from '../Widgets';
import { Button, Container, Swiper, Text, XPBar, Page } from '../Components';
import dataManager from '../../Managers/DataManager';

class Home extends BackHome {
    render() {
        const lang = langManager.curr['home'];
        const userStats = user.experience.GetExperience();
        const nextLvlPc = round(userStats.xp / userStats.next, 2);

        const currentQuote = dataManager.quotes.currentQuote;
        const quote = currentQuote === null ? null : (
            <View style={styles.swiper}>
                <Text style={styles.citation}>{currentQuote.Quote}</Text>
                <Text style={styles.author}>{currentQuote.Author}</Text>
            </View>
        );

        return (
            <Page canScrollOver={true}>
                <UserHeader />

                <View style={styles.XPHeader}>
                    <View style={styles.XPHeaderLvl}>
                        <Text style={{ marginRight: 8 }}>LVL</Text>
                        <Text color='main2'>{userStats.lvl}</Text>
                    </View>
                    <Text>{nextLvlPc}%</Text>
                </View>
                <XPBar value={userStats.xp} maxValue={userStats.next} />

                {/**
                 * TODO - Afficher des news depuis la bdd (différents formats)
                 */}
                <Swiper style={styles.topSpace} pages={[
                    quote,
                    <Button color='main1'>AAA</Button>,
                    <Text>Page 3</Text>
                ]} />

                <Button
                    style={styles.topSpace}
                    color='main2'
                    borderRadius={8}
                    icon='add'
                    onPress={() => { user.interface.ChangePage('activity', undefined, true) }}
                >
                    {lang['btn-add-task']}
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
                    <StatsBars data={user.stats} />
                </Container>

                <Container
                    style={styles.topSpace}
                    text={lang['con-skill-experience']}
                    type='rollable'
                    opened={false}
                    color='main3'
                    //rippleColor='white'
                >
                    {/* TODO - Show best skills */}
                    <Button style={styles.btnSmall}>{lang['btn-other-skills']}</Button>
                </Container>

            </Page>
        );
    }
}

const styles = StyleSheet.create({
    XPHeader: {
        marginBottom: 12,
        paddingHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    XPHeaderLvl: {
        flexDirection: 'row'
    },

    topSpace: {
        marginTop: 24
    },

    swiper: {
        padding: '5%'
    },

    btnSmall: {
        height: 46,
        marginHorizontal: '20%',
        borderRadius: 8
    },

    citation: {
        fontSize: 16,
        textAlign: 'justify'
    },
    author: {
        //marginTop: 8,
        marginRight: 24,
        fontSize: 16,
        textAlign: 'right',
        fontWeight: 'bold'
    }
});

export default Home;
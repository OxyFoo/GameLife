import * as React from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import BackHome from '../back/home';
import { Button, Container, Swiper, Text, XPBar, Page } from '../Components';
import { UserHeader, StatsBars } from '../Widgets';
import { round } from '../../Functions/Functions';

class Home extends BackHome {
    render() {
        const lang = langManager.curr['home'];
        const userStats = user.experience.getExperience();
        const nextLvlPc = round(userStats.xp / userStats.next, 2);

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

                <Swiper style={styles.topSpace} pages={[
                    <Text>Page 1</Text>,
                    <Text>Page 2</Text>,
                    <Text>Page 3</Text>
                ]} />

                <Button style={styles.topSpace} color='main2' borderRadius={8} icon='add'>{lang['btn-add-task']}</Button>
                <Button style={styles.topSpace} color='main1' borderRadius={8} icon='chrono'>{lang['btn-quests']}</Button>

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
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;
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

    btnSmall: {
        height: 46,
        marginHorizontal: '20%',
        borderRadius: 8
    },





    containerUserXP: {
        width: '50%',
        paddingHorizontal: "0%",
        display: 'flex',
        justifyContent: 'center'
    },

    containerContent: {
        height: '45%',
        flexDirection: 'row'
    },
    containerStats: {
        width: '60%',
        height: '100%',
        padding: "3%",
        
    },
    containerLevelColumn: {
        width: '40%',
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    textLevel: {
        marginBottom: "10%",
        fontSize: ww * 48 / 1000
    },
    textLevelTotal: {
        marginBottom: "10%",
        fontSize: ww * 37 / 1000 
    },
    textLevelAverage: {
        fontSize: ww * 32 / 1000
    },

    block: {
        marginHorizontal: "0.8%",
        padding: "8%",
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    blockLVL: { height: '25%', justifyContent: 'space-evenly' , },
    blockCalendar: { height: '40%', paddingHorizontal: 0, overflow: 'hidden',  },
    blockSkill: { width: ww * 17 / 100, height: ww*17/100, padding: 0, margin: 0, marginTop: "3%", marginBottom: wh * 6 / 100, overflow: 'visible' ,},
    blockSkillText: {
        marginVertical: "5%",
        marginLeft: '-50%',
        width: '200%',
        lineHeight: 16,
        fontSize : ww * 42 / 1000
        
    },

    calendarTitle: {
        marginBottom: "3%",
        fontSize: ww * 37 / 1000 
    },
    calendarBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: "3%",
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    textLevelPlus: {
    },

    containerSkills: {
        flex: 1,
        marginTop: "5%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    titleSkill: {
        marginBottom: "3%",
        fontSize: ww * 75 / 1000,
        
    },
    addActivityText: {
        fontSize: ww * 426 / 10000,
    },

    backgroundCircles: {
        position: 'absolute',
        left: 0,
        bottom: 0
    }
});

export default Home;
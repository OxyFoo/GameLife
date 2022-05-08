import * as React from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import BackHome from './back';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { Round } from '../../../Utils/Functions';
import { UserHeader, StatsBars } from '../../Widgets';
import { Button, Container, Swiper, Text, XPBar, Page, News, Icon } from '../../Components';

class Home extends BackHome {
    renderSkill = ({ item: { ID, Name, Logo } }) => {
        const onPress = () => user.interface.ChangePage('skill', { skillID: ID });
        return (
            <TouchableOpacity style={styles.skill} onPress={onPress} activeOpacity={.6}>
                <View style={styles.skillImage}>
                    <Icon xml={Logo} size={52} color='main1' />
                </View>
                <Text fontSize={12}>{Name}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const lang = langManager.curr['home'];
        const userStats = user.experience.GetExperience().xpInfo;
        const nextLvlPc = Round(100 * userStats.xp / userStats.next, 0);
        const lvl = langManager.curr['level']['level'];

        return (
            <Page canScrollOver={true}>
                <UserHeader />

                <View style={styles.XPHeader}>
                    <View style={styles.XPHeaderLvl}>
                        <Text style={{ marginRight: 8 }}>{lvl}</Text>
                        <Text color='main2'>{userStats.lvl}</Text>
                    </View>
                    <Text>{nextLvlPc}%</Text>
                </View>
                <XPBar value={userStats.xp} maxValue={userStats.next} />

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
                    <StatsBars data={user.stats} />
                </Container>

                <Container
                    style={styles.topSpace}
                    text={lang['con-skill-experience']}
                    type='rollable'
                    opened={false}
                    color='main3'
                    rippleColor='white'
                >
                    <FlatList
                        data={this.state.skills}
                        renderItem={this.renderSkill}
                        keyExtractor={(item, index) => 'skill-' + index}
                        numColumns={3}
                    />
                    <Button style={styles.btnSmall} onPress={this.openSkills}>{lang['btn-other-skills']}</Button>
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

    skill: {
        width: '33%',
        alignItems: 'center'
    },
    skillImage: {
        width: '60%',
        aspectRatio: 1,
        marginBottom: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 4
    },

    btnSmall: {
        height: 46,
        marginTop: 24,
        marginHorizontal: '20%',
        borderRadius: 8
    }
});

export default Home;
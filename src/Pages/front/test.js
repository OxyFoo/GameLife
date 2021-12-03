import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ScrollView } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import BackTest from '../back/test';
import { dateToFormatString } from '../../Functions/Time';
import { Button, Checkbox, Container, GLActivityBox, GLDoubleCorner, GLHeader, GLIconButton, GLStats, GLSvg, GLText, GLXPBar, Input, Combobox, Swiper, Text, XPBar, Page } from '../Components';

class Test extends BackTest {
    render() {
        const userExperience = user.experience.getExperience();
        const totalXP = parseInt(user.xp);
        const XP = userExperience.xp;
        const LVL = userExperience.lvl;
        const nextLvlXP = userExperience.next;

        const backgroundColor = { backgroundColor: themeManager.colors['globalBackcomponent'] };

        return (
            <Page canScrollOver={true}>
                <Button color='main2' borderRadius={14} style={{ marginBottom: 12 }} icon='home'>{'Ajouter des tâches'}</Button>
                <Button color='main1' borderRadius={14} style={{ marginBottom: 12 }} icon='add' loading={true}>{'Quêtes journalières'}</Button>

                <XPBar value={0} style={{ marginBottom: 12 }} />
                <XPBar value={4} style={{ marginBottom: 12 }} />
                <XPBar value={10} style={{ marginBottom: 12 }} />

                <Combobox style={{ marginBottom: 12 }} />

                <Swiper
                    style={{ marginBottom: 12 }}
                    pages={[
                        <>
                            <Text style={{ marginBottom: 12 }}>{'Page 1'}</Text>
                            <Button color='main1' borderRadius={14}>{'Quêtes journalières'}</Button>
                        </>,
                        <>
                            <Text>{'Page 2'}</Text>
                            <XPBar value={10} style={{ marginBottom: 24 }} />
                        </>,
                        <Button color='main2' borderRadius={14}>{'Page 3'}</Button>
                    ]}
                />

                <Container text='Static' color='main2' style={{ marginBottom: 12 }} type='static' opened={true} icon='add'>
                    <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                </Container>

                <Container text='Rollable !' type='rollable' opened={true}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            style={{ marginRight: 4 }}
                            checked={this.state.testChecked}
                            onChange={() => { this.setState({ testChecked: !this.state.testChecked }) }}
                        />
                        <Text fontSize={14} color='primary' onPress={() => { this.setState({ testChecked: !this.state.testChecked }) }}>{'Blablabla blablabla blabla bla'}</Text>
                    </View>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Blablabla</Text>
                    <Text style={{ marginBottom: 48 }}>Insh le scroll marche bien</Text>
                </Container>
            </Page>
        )

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['home']['page-title']}
                    //leftIcon="sandwich"
                    onPressLeft={user.openLeftPanel}
                    rightIcon="gear"
                    onPressRight={() => user.changePage('settings') }
                />

                <View style={styles.backgroundCircles}>
                    <Image source={require('../../../res/logo/home_circles.png')} />
                </View>

                {/* TESTS */}
                <ScrollView
                    style={{ /*flex: 1*/ width: '100%', height: '100%', padding: '5%' }}
                    onTouchEnd={() => {}}
                >
                    <View>
                        <Button color='main2' borderRadius={14} style={{ marginBottom: 12 }} icon='home'>{'Ajouter des tâches'}</Button>
                        <Button color='main1' borderRadius={14} style={{ marginBottom: 12 }} icon='add' loading={true}>{'Quêtes journalières'}</Button>

                        <XPBar value={4} style={{ marginBottom: 12 }} />

                        <Combobox style={{ marginBottom: 12 }} />

                        <Swiper
                            style={{ marginBottom: 12 }}
                            pages={[
                                <>
                                    <Text style={{ marginBottom: 12 }}>{'Page 1'}</Text>
                                    <Button color='main1' borderRadius={14}>{'Quêtes journalières'}</Button>
                                </>,
                                <>
                                    <Text>{'Page 2'}</Text>
                                    <XPBar value={10 } style={{ marginBottom: 24 }} />
                                </>,
                                <Button color='main2' borderRadius={14}>{'Page 3'}</Button>
                            ]}
                        />

                        <Container text='Static' color='main2' style={{ marginBottom: 12 }} type='static' opened={true} icon='add'>
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                        </Container>

                        <Container text='Rollable !' type='rollable' opened={true}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Checkbox
                                    style={{ marginRight: 4 }}
                                    checked={this.state.testChecked}
                                    onChange={() => { this.setState({ testChecked: !this.state.testChecked }) }}
                                />
                                <Text fontSize={14} color='primary' onPress={() => { this.setState({ testChecked: !this.state.testChecked }) }}>{'Blablabla blablabla blabla bla'}</Text>
                            </View>
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                            <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                        </Container>

                        <View style={{ width: '100%', height: 128 }} />
                    </View>
                </ScrollView>

                {/* Stats */}
                <View style={styles.parentView}>
                    {/* User - main informations 
                    <View style={styles.containerHeader}>
                        <TouchableOpacity style={styles.containerUserName} activeOpacity={.5} onPress={this.openIdentity}>
                            <GLText title={user.username} style={styles.username} />
                            {user.title != 0 && (<GLText title={dataManager.titles.getTitleByID(user.title)} style={styles.title} />)}
                        </TouchableOpacity>
                        <GLXPBar value={XP} max={nextLvlXP} style={styles.containerUserXP} />
                    </View>*/}

                    {/* User - Stats / Level / Calendar 
                    <View style={styles.containerContent}>
                        <GLStats containerStyle={styles.containerStats} />

                        <View style={styles.containerLevelColumn}>
                            <TouchableOpacity style={[styles.block, styles.blockLVL, backgroundColor]} activeOpacity={0.5} onPress={this.openExperience}>
                                <GLDoubleCorner />
                                <GLText style={styles.textLevel} title={langManager.curr['level']['level'] + ' ' + LVL} />
                                <GLText style={styles.textLevelTotal} title={langManager.curr['level']['total'] + ' ' + totalXP} color='secondary' />
                                <GLText style={styles.textLevelAverage} title={langManager.curr['level']['average'].replace('{}', this.averageXPperDay)} color='secondary' />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.block, styles.blockCalendar, backgroundColor]}
                                activeOpacity={.5}
                                onPress={this.openCalendar}
                            >
                                <View>
                                    <GLText style={styles.calendarTitle} title={langManager.curr['home']['title-calendar'].toUpperCase()} />
                                    <FlatList
                                        data={this.activities}
                                        keyExtractor={(item, i) => 'activity_' + i}
                                        renderItem={({item}) => {
                                            const skill = dataManager.skills.getByID(item.skillID);
                                            const date = new Date(item.startDate);
                                            const dateText = dateToFormatString(date);
                                            const timeText = date.getHours() + 'h' + date.getMinutes() + 'm/' + item.duration + 'm';
                                            return (
                                                <GLActivityBox
                                                    skill={skill.Name}
                                                    date={dateText}
                                                    time={timeText}
                                                    small={true}
                                                    onPress={() => { this.skill_click(item) }}
                                                    onRemove={() => { this.skill_remove(item) }}
                                                />
                                            )
                                        }}
                                    />
                                </View>
                                <View style={[styles.calendarBottom, backgroundColor]}>
                                    <GLText style={styles.textLevelPlus} title={langManager.curr['home']['text-seeall']} color="secondary" />
                                    <GLIconButton icon='chevron' size={16} />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.block, backgroundColor]}
                                activeOpacity={.5}
                                onPress={this.addSkill}
                            >
                                <GLDoubleCorner />
                                <GLText style={styles.addActivityText} title={langManager.curr['home']['shortcut-addactivity']} onPress={this.addSkill} />
                            </TouchableOpacity>
                        </View>
                    </View>*/}

                    {/* Skills 
                    <TouchableOpacity style={styles.containerSkills} activeOpacity={0.5} onPress={this.openSkills}>
                        <GLText style={styles.titleSkill} title={langManager.curr['home']['title-skills'].toUpperCase()} />
                        <FlatList
                            columnWrapperStyle={{ width: '100%', justifyContent: 'space-evenly' }}
                            contentContainerStyle={{ display: 'flex', alignItems: 'center' }}
                            data={this.skills}
                            numColumns={3}
                            keyExtractor={(item, i) => 'block_' + i}
                            renderItem={({item}) => {
                                let xml = '';
                                if (item.key !== -1) {
                                    const skill = dataManager.skills.getByID(item.key);
                                    let logoID = skill.LogoID;
                                    if (logoID != 0) {
                                        xml = dataManager.skills.getXmlByLogoID(logoID);
                                    }
                                }

                                return item.key === -1 ? (
                                        <View style={[styles.block, styles.blockSkill, backgroundColor]} />
                                    ) : (
                                        <View>
                                            <TouchableOpacity style={[styles.block, styles.blockSkill, backgroundColor]} activeOpacity={0.5} onPress={() => { this.openSkill(item.key) }}>
                                                <GLSvg xml={xml} />
                                                <GLText style={styles.blockSkillText} title={item.value} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            }
                        />
                    </TouchableOpacity>*/}
                </View>
            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;
const styles = StyleSheet.create({
    parentView: {
        flex: 1,
        padding:"2%"
    },
    containerHeader: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
    },
    containerUserName: {
        width: '50%',
        height: '100%',
        padding: "2%",

        display: 'flex',
        justifyContent: 'center',

    },
    username: {
        marginLeft: "2%",
        fontSize: ww * 48 / 1000,
        textAlign: 'left',
        
    },
    title: {
        marginTop: "4%",
        marginLeft: "2%",
        fontSize: ww * 37 / 1000,
        textAlign: 'left',
        
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

export default Test;
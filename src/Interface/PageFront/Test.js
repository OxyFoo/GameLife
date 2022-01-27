import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ScrollView, Switch as RNSwitch } from 'react-native';

import BackTest from '../PageBack/Test';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { DateToFormatString } from '../../Functions/Time';
import { Button, Checkbox, Container, Input, ComboBox, Swiper, Text, XPBar, Page, TextSwitch, Switch, Icon, Digit } from '../Components';

const TEST_VALUES = [{ID: 0, value: 'Abc 0'}, {ID: 1, value: 'Def 1'}, {ID: 2, value: 'Item 2'}, {ID: 3, value: 'Item 3'}, {ID: 4, value: 'Item 4'}];

class Test extends BackTest {
    render() {
        const userExperience = user.experience.GetExperience();
        const totalXP = parseInt(user.xp);
        const XP = userExperience.xp;
        const LVL = userExperience.lvl;
        const nextLvlXP = userExperience.next;

        const backgroundColor = { backgroundColor: themeManager.colors['globalBackcomponent'] };

        return (
            <Page ref={ref => this.pageRef = ref} canScrollOver={true}>
                <Button color='main2' borderRadius={14} style={{ marginBottom: 12 }} icon='home'>{'Ajouter des tâches'}</Button>
                <Button color='main1' borderRadius={14} style={{ marginBottom: 12 }} icon='add' loading={true}>{'Quêtes journalières'}</Button>

                <Button color='main2' borderRadius={14} style={{ marginBottom: 12 }} onPress={this.openSI}>{'Test "Screen Input"'}</Button>
                <Button color='main2' borderRadius={14} style={{ marginBottom: 12 }} onPress={this.openSL}>{'Test "Screen List"'}</Button>

                <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                    <Digit />
                </View>

                <Input style={{ marginBottom: 12 }} label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />

                <Input style={{ marginBottom: 12 }} label='Test input multiline' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} multiline />

                <ComboBox
                    pageRef={this.pageRef}
                    style={{ marginBottom: 12 }}
                    data={TEST_VALUES}
                    setSearchBar={true}
                    selectedValue={this.state.selectedSkill.value}
                    onSelect={(item) => { this.setState({ selectedSkill: item === null ? { ID: 0, value: ''} : item }); }}
                />

                <TextSwitch style={{ marginBottom: 12 }} />

                <Container text='Static' color='main2' style={{ marginBottom: 12 }} type='static' opened={true} icon='add'>
                    <XPBar value={0} style={{ marginBottom: 12 }} />
                    <XPBar value={4} style={{ marginBottom: 12 }} />
                    <XPBar value={10} style={{ marginBottom: 12 }} />
                </Container>

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

                <Switch
                    value={this.state.switch}
                    onValueChanged={(value) => { this.setState({ switch: value }); }}
                />

                <Icon
                    icon='success'
                    size={96}
                    //transform="translate(2000)"
                    //transform="matrix(-1 0 0 1 21.5 27.5)"
                />

                <View
                    //</Page>style={{ transform: [{ matrix: [1, 1, 1, 1, 1, 1, 1, 1, 1] }] }}
                >
                    <Input />
                </View>

                {/*<View style={{ width: 48 }}>
                    <RNSwitch
                        value={this.state.switch}
                        onValueChange={(value) => { this.setState({ switch: value }); }}
                        thumbColor={this.state.switch ? themeManager.GetColor('main1') : themeManager.GetColor('backgroundCard')}
                        trackColor={{ false: themeManager.GetColor('background'), true: themeManager.GetColor('background') }}
                    />
                </View>*/}

                {/*<Container text='Static' color='main2' style={{ marginBottom: 12 }} type='static' opened={true} icon='add'>
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
                </Container>*/}
                
            </Page>
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
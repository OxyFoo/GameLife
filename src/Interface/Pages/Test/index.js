import * as React from 'react';
import { View, Switch as RNSwitch, FlatList } from 'react-native';

import BackTest from './back';
import themeManager from 'Managers/ThemeManager';

import {
    Button,
    Checkbox,
    Container,
    Input,
    ComboBox,
    Swiper,
    Text,
    XPBar,
    Page,
    TextSwitch,
    Switch,
    Icon,
    Digit,
    Character,
    Frame
} from 'Interface/Components';

import { Sleep } from 'Utils/Functions';

/** @type {import('Interface/Components/ComboBox').ComboBoxItem[]} */
const TEST_VALUES = [
    {key: 0, value: 'Abc 0'},
    {key: 1, value: 'Def 1'},
    {key: 2, value: 'Item 2'},
    {key: 3, value: 'Item 3'},
    {key: 4, value: 'Item 4'}
];

//const TEST_ITEMS = [ ...Object.values(STUFFS['MALE']), ...Object.values(STUFFS['FEMALE']) ];
const TEST_ITEMS = [];

class Test extends BackTest {
    render() {
        return (
            <Page ref={ref => this.refPage = ref} canScrollOver={true}>

                <FlatList
                    data={TEST_ITEMS}
                    renderItem={this.renderCardItem}
                    numColumns={3}
                    keyExtractor={(item, index) => 'item-' + index.toString()}
                />

                <Button color='main2' style={{ marginBottom: 12 }} icon='home'>{'Ajouter des tâches'}</Button>
                <Button color='main1' style={{ marginBottom: 12 }} icon='add' loading={true}>{'Quêtes journalières'}</Button>

                <Button color='main2' style={{ marginBottom: 12 }} onPress={this.openSI}>{'Test "Screen Input"'}</Button>
                <Button color='main2' style={{ marginBottom: 12 }} onPress={this.openSL}>{'Test "Screen List"'}</Button>

                <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                    <Digit />
                </View>

                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Button.Badge
                        style={{ width: '50%' }}
                        icon='add'
                        badgeJustifyContent='center'
                    >
                        <Text>{'Test'}</Text>
                    </Button.Badge>
                </View>

                <Input style={{ marginBottom: 12 }} label='' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                <Input style={{ marginBottom: 12 }} label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />

                <Input style={{ marginBottom: 12 }} label='Test input multiline' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} multiline />

                <ComboBox
                    style={{ marginBottom: 12 }}
                    data={TEST_VALUES}
                    setSearchBar={true}
                    selectedValue={this.state.selectedSkill.value}
                    onSelect={(item) => { this.setState({ selectedSkill: item === null ? { ID: 0, value: ''} : item }); }}
                />

                <TextSwitch style={{ marginBottom: 12 }} texts={[ 'Test 1', 'Test 2' ]} />

                <Container text='Static' color='main2' style={{ marginBottom: 12 }} type='static' opened={true} icon='userAdd' onIconPress={() => {console.log('YES')}}>
                    <XPBar value={0} style={{ marginBottom: 12 }} />
                    <XPBar value={4} style={{ marginBottom: 12 }} />
                    <XPBar value={10} style={{ marginBottom: 12 }} />
                </Container>

                <Container text='Rollable' color='main2' style={{ marginBottom: 12 }} type='rollable' opened={true} icon='chrono'>
                    <XPBar value={0} style={{ marginBottom: 12 }} />
                    <XPBar value={4} style={{ marginBottom: 12 }} />
                    <XPBar value={10} style={{ marginBottom: 12 }} />
                </Container>

                <Swiper
                    style={{ marginBottom: 12 }}
                    pages={[
                        <>
                            <Text style={{ marginBottom: 12 }}>{'Page 1'}</Text>
                            <Button color='main1'>{'Quêtes journalières'}</Button>
                        </>,
                        <>
                            <Text>{'Page 2'}</Text>
                            <XPBar value={10} style={{ marginBottom: 24 }} />
                        </>,
                        <Button color='main2'>{'Page 3'}</Button>
                    ]}
                />

                <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                    <Switch
                        value={this.state.switch}
                        onValueChanged={(value) => { this.setState({ switch: value }); }}
                    />

                    <RNSwitch
                        value={this.state.switch}
                        onValueChange={(value) => { this.setState({ switch: value }); }}
                        thumbColor={this.state.switch ? themeManager.GetColor('main1') : themeManager.GetColor('backgroundCard')}
                        trackColor={{ false: themeManager.GetColor('background'), true: themeManager.GetColor('background') }}
                    />
                </View>

                <Icon
                    style={{ marginBottom: 12 }}
                    icon='success'
                    size={96}
                />

                <View style={{ marginBottom: 12 }}>
                    <Input />
                </View>

                <Container text='Static' color='main2' style={{ marginBottom: 12 }} type='static' opened={true} icon='add'>
                    <Input label='Test input' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
                </Container>

                <Container text='Rollable !' type='rollable' opened={false}>
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
    }
}

export default Test;
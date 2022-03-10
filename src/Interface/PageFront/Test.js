import * as React from 'react';
import { View, Switch as RNSwitch } from 'react-native';

import BackTest from '../PageBack/Test';
import themeManager from '../../Managers/ThemeManager';

import { Button, Checkbox, Container, Input, ComboBox, Swiper, Text, XPBar, Page, TextSwitch, Switch, Icon, Digit } from '../Components';

const TEST_VALUES = [{ID: 0, value: 'Abc 0'}, {ID: 1, value: 'Def 1'}, {ID: 2, value: 'Item 2'}, {ID: 3, value: 'Item 3'}, {ID: 4, value: 'Item 4'}];

class Test extends BackTest {
    render() {
        return (
            <Page ref={ref => this.pageRef = ref} canScrollOver={true}>
                <Button color='main2' style={{ marginBottom: 12 }} icon='home'>{'Ajouter des tâches'}</Button>
                <Button color='main1' style={{ marginBottom: 12 }} icon='add' loading={true}>{'Quêtes journalières'}</Button>

                <Button color='main2' style={{ marginBottom: 12 }} onPress={this.openSI}>{'Test "Screen Input"'}</Button>
                <Button color='main2' style={{ marginBottom: 12 }} onPress={this.openSL}>{'Test "Screen List"'}</Button>

                <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                    <Digit />
                </View>

                <Input style={{ marginBottom: 12 }} label='' text={this.state.test} onChangeText={(t) => { this.setState({ test: t}) }} />
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

export default Test;
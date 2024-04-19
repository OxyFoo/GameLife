import * as React from 'react';
import { View, Switch as RNSwitch, Animated } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';

import BackTest from './back';
import themeManager from 'Managers/ThemeManager';

import {
    Text,
    Button,
    Page,
    /*
    Checkbox,
    Container,
    Input,
    ComboBox,
    Swiper,
    XPBar,
    TextSwitch,
    Switch,
    Digit
    */
} from 'Interface/Components';
import LinearGradient from 'react-native-linear-gradient';

/** @type {import('Interface/OldComponents/ComboBox').ComboBoxItem[]} */
const TEST_VALUES = [
    {key: 0, value: 'Abc 0'},
    {key: 1, value: 'Def 1'},
    {key: 2, value: 'Item 2'},
    {key: 3, value: 'Item 3'},
    {key: 4, value: 'Item 4'}
];

class Test extends BackTest {
    render() {
        return (
            <Page ref={ref => this.refPage = ref}>
                <MaskedView
                    style={{ marginVertical: 24 }}
                    maskElement={(<Text fontSize={32}>{'Page de test'}</Text>)}
                >
                    <LinearGradient style={{ width: '100%', height: 45 }} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={190} />
                </MaskedView>

                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 128,
                        left: 12,
                        width: '50%',
                        height: 300,
                        borderRadius: 8,
                        backgroundColor: '#fff',
                        transform: [{ translateX: this.animPanel }]
                    }}
                />

                <Button style={{ marginBottom: 12 }} icon='home' appearance='outline'/>
                <Button style={{ marginBottom: 12 }} loading={true}>{'Quêtes journalières'}</Button>
                <Button style={{ marginBottom: 12 }} appearance='outline-blur'>{'Quêtes journalières'}</Button>
                <Button style={{ marginBottom: 12 }} appearance='normal' icon={'bell'}>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                </Button>

                <Button style={{ marginBottom: 12 }} onPress={this.openSI} icon={'world'} appearance='outline-blur'>{'Test "Screen Input"'}</Button>
                <Button style={{ marginBottom: 12 }} onPress={this.openSL}>{'Test "Screen List"'}</Button>

                {/*
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                    <Digit />
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
                */}

            </Page>
        );
    }
}

export default Test;

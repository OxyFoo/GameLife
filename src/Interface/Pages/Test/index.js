import * as React from 'react';
import { View, Switch as RNSwitch, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import BackTest from './back';
import themeManager from 'Managers/ThemeManager';

import { Page } from 'Interface/Global';
import {
    Text,
    Button,
    Switch,
    InputText,
    Icon,
    CheckBox,
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
        const renderTests = [
            //this.renderButtons,
            //this.renderButtonsPanic,
            this.renderInputText,
            this.renderIcons,
            this.renderSwitches
        ];

        return (
            <Page ref={this.refPage}>
                <MaskedView
                    style={{ marginVertical: 24 }}
                    maskElement={(<Text fontSize={32}>{'Page de test'}</Text>)}
                >
                    <LinearGradient style={{ width: '100%', height: 45 }} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={190} />
                </MaskedView>

                {renderTests.map((renderTest, index) => (
                    <View key={index}>
                        {renderTest()}
                    </View>
                ))}

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

    renderTitle = (title = '') => {
        return (
            <Text style={{ marginVertical: 12, textAlign: 'left', fontSize: 20 }}>{title}</Text>
        );
    }

    renderButtons = () => {
        return (
            <View>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 86,
                        left: 12,
                        width: '50%',
                        height: 300,
                        borderRadius: 8,
                        backgroundColor: '#fff',
                        transform: [{ translateX: this.animPanel }]
                    }}
                />

                {this.renderTitle('Boutons')}
                <Button style={{ marginBottom: 12 }} icon='home' appearance='outline'/>
                <Button style={{ marginBottom: 12 }} loading={true}>{'Quêtes journalières'}</Button>
                <Button style={{ marginBottom: 12 }} appearance='outline-blur'>{'Quêtes journalières'}</Button>
                <Button style={{ marginBottom: 12 }} appearance='normal' icon={'bell'}>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                </Button>

                <Button style={{ marginBottom: 12 }} onPress={this.openSI} icon={'cup'} appearance='outline-blur'>{'Test "Screen Input"'}</Button>
                <Button style={{ marginBottom: 12 }} onPress={this.openSL}>{'Test "Screen List"'}</Button>
            </View>
        );
    }

    renderButtonsPanic = () => {
        return (
            <View>
                {this.renderTitle('Boutons panic test')}
                {Array(30).fill(0).map((_, index) => (
                    <Button
                        key={`button-panic-${index}`}
                        style={{ marginBottom: 12 }}
                        icon={'cup'}
                        appearance='outline-blur'
                    >
                        {'Performance test (blur)'}
                    </Button>
                ))}
            </View>
        );
    }

    renderInputText = () => {
        return (
            <View>
                {this.renderTitle('Inputs')}
                <InputText
                    style={{ marginBottom: 12 }}
                    label='Test input'
                    value={this.state.input}
                    onChangeText={(newText) => this.setState({ input: newText })}
                />
                <InputText
                    label='Test input'
                    staticLabel
                    placeholder='Placeholder'
                    placeholderTextColor='white'
                    value={this.state.input}
                    onChangeText={(newText) => this.setState({ input: newText })}
                    error
                />
                <Text style={{ marginTop: 4, marginBottom: 12, marginLeft: 4, textAlign: 'left', fontSize: 14 }} color='danger'>
                    {'Error blablabla'}
                </Text>
            </View>
        );
    }

    renderIcons = () => {
        return (
            <View>
                {this.renderTitle('Icons')}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Icon icon='add' color='main1' />
                    <Icon icon='arrow-square' color='main1' />
                    <Icon icon='bell' color='main1' />
                    <Icon icon='cart' color='main1' />
                    <Icon icon='check' color='main1' />
                    <Icon icon='clock' color='main1' />
                    <Icon icon='close' color='main1' />
                    <Icon icon='creativity' color='main1' />
                    <Icon icon='crown' color='main1' />
                    <Icon icon='cup' color='main1' />
                    <Icon icon='danger' color='main1' />
                    <Icon icon='favorite' color='main1' />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Icon icon='add-outline' color='main1' />
                    <Icon icon='arrow-square-outline' color='main1' />
                    <Icon icon='bell-outline' color='main1' />
                    <Icon icon='cart-outline' color='main1' />
                    <Icon icon='check-outline' color='main1' />
                    <Icon icon='clock-outline' color='main1' />
                    <Icon icon='close-outline' color='main1' />
                    <Icon icon='creativity-outline' color='main1' />
                    <Icon icon='crown-outline' color='main1' />
                    <Icon icon='cup-outline' color='main1' />
                    <Icon icon='danger-outline' color='main1' />
                    <Icon icon='favorite-outline' color='main1' />
                </View>
            </View>
        );
    }

    renderSwitches = () => {
        return (
            <View>
                {this.renderTitle('Switch / Checkbox')}
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 12 }}>
                    <Switch
                        color='main2'
                        value={this.state.switch1}
                        onChangeValue={(value) => { this.setState({ switch1: value }); }}
                    />
                    <Switch
                        value={this.state.switch2}
                        onChangeValue={(value) => { this.setState({ switch2: value }); }}
                    />
                    <CheckBox
                        value={this.state.checkbox1}
                        onChangeValue={(value) => { this.setState({ checkbox1: value }); }}
                    />
                    <CheckBox
                        color='main2'
                        value={this.state.checkbox2}
                        onChangeValue={(value) => { this.setState({ checkbox2: value }); }}
                    />
                </View>
            </View>
        );
    }
}

export default Test;

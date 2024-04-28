import * as React from 'react';
import { View, Switch as RNSwitch, Animated, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
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
    ProgressBar,
    SwitchText,
    ComboBox,
    /*
    Container,
    Input,
    ComboBox,
    Swiper,
    Digit
    */
} from 'Interface/Components';

class Test extends BackTest {
    render() {
        return (
            <Page ref={this.refPage} scrollable={false}>
                <MaskedView
                    style={{ marginVertical: 24 }}
                    maskElement={(<Text fontSize={32}>{'Page de test'}</Text>)}
                >
                    <LinearGradient style={{ width: '100%', height: 45 }} colors={['#8CF7FF', '#DBA1FF']} useAngle={true} angle={190} />
                </MaskedView>


                {[
                    //this.renderButtons(),
                    //this.renderButtonsPanic(),
                ]}

                {this.renderButtons()}
                {this.renderInputText()}
                {this.renderIcons()}
                {this.renderIcons()}
                {this.renderIcons()}
                {this.renderComboBox()}
                {this.renderSwitches()}
                {this.renderSwitchText()}
                {this.renderProgressBars()}
                {this.renderInputText()}

                {/*
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
                    <Digit />
                </View>

                <ComboBox
                    style={styles.marginBot}
                    data={TEST_VALUES}
                    setSearchBar={true}
                    selectedValue={this.state.selectedSkill.value}
                    onSelect={(item) => { this.setState({ selectedSkill: item === null ? { ID: 0, value: ''} : item }); }}
                />

                <Container text='Static' color='main2' style={styles.marginBot} type='static' opened={true} icon='userAdd' onIconPress={() => {console.log('YES')}}>
                    <XPBar value={0} style={styles.marginBot} />
                    <XPBar value={4} style={styles.marginBot} />
                    <XPBar value={10} style={styles.marginBot} />
                </Container>

                <Container text='Rollable' color='main2' style={styles.marginBot} type='rollable' opened={true} icon='chrono'>
                    <XPBar value={0} style={styles.marginBot} />
                    <XPBar value={4} style={styles.marginBot} />
                    <XPBar value={10} style={styles.marginBot} />
                </Container>

                <Swiper
                    style={styles.marginBot}
                    pages={[
                        <>
                            <Text style={styles.marginBot}>{'Page 1'}</Text>
                            <Button color='main1'>{'Quêtes journalières'}</Button>
                        </>,
                        <>
                            <Text>{'Page 2'}</Text>
                            <XPBar value={10} style={{ marginBottom: 24 }} />
                        </>,
                        <Button color='main2'>{'Page 3'}</Button>
                    ]}
                />

                <View style={styles.marginBot}>
                    <Input />
                </View>

                <Container text='Rollable !' type='rollable' opened={false}>
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
                <Button style={styles.marginBot} icon='home' appearance='outline'/>
                <Button style={styles.marginBot} loading={true}>{'Quêtes journalières'}</Button>
                <Button style={styles.marginBot} appearance='outline-blur'>{'Quêtes journalières'}</Button>
                <Button style={styles.marginBot} appearance='normal' icon={'bell'}>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                    <Text fontSize={16} color='darkBlue'>{'Quêtes journalières'}</Text>
                </Button>

                <Button style={styles.marginBot} onPress={this.openSI} icon={'cup'} appearance='outline-blur'>{'Test "Screen Input"'}</Button>
                <Button style={styles.marginBot} onPress={this.openSL}>{'Test "Screen List"'}</Button>
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
                        style={styles.marginBot}
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
                    style={styles.marginBot}
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

    comboboxData = [
        {key: 0, value: 'Abc 0'},
        {key: 1, value: 'Def 1'},
        {key: 2, value: 'Item 2'},
        {key: 3, value: 'Item 3'},
        {key: 4, value: 'Item 4'},
        {key: 5, value: 'Item 5'}
    ];
    renderComboBox = () => {
        return (
            <>
                {this.renderTitle('ComboBox')}
                <ComboBox
                    data={this.comboboxData}
                    selectedValue={this.state.selectedSkill.value}
                    onSelect={(item) => { this.setState({ selectedSkill: item === null ? { ID: -1, value: ''} : item }); }}
                    enableSearchBar
                />
            </>
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

    switchTextData = [ 'Test 1', 'Test 2', 'Test 3' ];
    renderSwitchText = () => {
        return (
            <View>
                {this.renderTitle('SwitchText')}
                <SwitchText
                    style={styles.marginBot}
                    texts={this.switchTextData}
                    value={this.state.switchText}
                    onChangeValue={(value) => { this.setState({ switchText: value }); }}
                />
            </View>
        );
    }

    renderProgressBars = () => {
        return (
            <View>
                {this.renderTitle('ProgressBar')}
                <ProgressBar
                    style={styles.marginBot}
                    value={Math.random() * 10}
                />
                <ProgressBar
                    style={styles.marginBot}
                    value={Math.random() * 10}
                    supValue={3}
                    color='main1'
                />
                <ProgressBar
                    style={styles.marginBot}
                    value={Math.random() * 10}
                    color='main2'
                />
                <ProgressBar
                    style={styles.marginBot}
                    value={Math.random() * 10}
                />
                <ProgressBar.Infinite />
            </View>
        );
    }
}

export default Test;

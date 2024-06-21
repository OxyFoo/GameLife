import * as React from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
import BackTest from './back';

import ICONS from 'Ressources/Icons';
import {
    Text,
    Button,
    Switch,
    InputText,
    Icon,
    CheckBox,
    ProgressBar,
    SwitchText,
    ComboBox
} from 'Interface/Components';

/**
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 */

class Test extends BackTest {
    render() {
        return (
            <View style={styles.page}>
                <MaskedView
                    style={{ marginVertical: 24 }}
                    maskElement={<Text fontSize={32}>{'Page de test'}</Text>}
                >
                    <LinearGradient
                        style={{ width: '100%', height: 45 }}
                        colors={['#8CF7FF', '#DBA1FF']}
                        useAngle={true}
                        angle={190}
                    />
                </MaskedView>

                {/*
                    {this.renderButtonsPanic()}
                    {this.renderComboBox()}
                */}

                {this.renderButtons()}
                {this.renderInputText()}
                {this.renderPopups()}
                {this.renderIcons()}
                {this.renderSwitches()}
                {this.renderSwitchText()}
                {this.renderProgressBars()}
            </View>
        );
    }

    renderTitle = (title = '') => {
        return (
            <Text
                style={{ marginVertical: 12, textAlign: 'left', fontSize: 20 }}
            >
                {title}
            </Text>
        );
    };

    renderButtons = () => {
        return (
            <View>
                {this.state.selectedButon === 'outline-blur' && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 80,
                            left: 12,
                            width: 150,
                            height: 200,
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            transform: [{ translateX: this.animLoop }]
                        }}
                    />
                )}

                {this.renderTitle('Boutons - ' + this.state.selectedButon)}
                <Button
                    style={styles.marginBot}
                    onPress={this.goToPage2}
                    appearance={this.state.selectedButon}
                    icon='home'
                />
                <Button
                    style={styles.marginBot}
                    onPress={this.buttonLoop}
                    appearance={this.state.selectedButon}
                    fontColor='danger'
                    color='main2'
                >
                    {"Changer l'apparence"}
                </Button>
                <Button
                    style={styles.marginBot}
                    onPress={this.buttonLoop}
                    appearance={this.state.selectedButon}
                    color='main3'
                    icon={'cup'}
                >
                    {"Changer l'apparence"}
                </Button>
                <Button
                    style={styles.marginBot}
                    onPress={this.buttonLoop}
                    appearance={this.state.selectedButon}
                    color='white'
                    loading={this.state.selectedButon === 'normal'}
                >
                    {'Quêtes journalières'}
                </Button>
            </View>
        );
    };

    renderButtonsPanic = () => {
        return (
            <View>
                {this.renderTitle('Boutons panic test')}
                {Array(30)
                    .fill(0)
                    .map((_, index) => (
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
    };

    renderInputText = () => {
        return (
            <View>
                {this.renderTitle('Inputs')}
                <InputText
                    containerStyle={styles.marginBot}
                    label='Test input'
                    icon={'users'}
                    value={this.state.input}
                    onChangeText={(newText) =>
                        this.setState({ input: newText })
                    }
                />
                <InputText
                    label='Test input'
                    staticLabel
                    placeholder='Placeholder'
                    placeholderTextColor='white'
                    value={this.state.input}
                    onChangeText={(newText) =>
                        this.setState({ input: newText })
                    }
                    error
                />
                <Text
                    style={{
                        marginTop: 4,
                        marginBottom: 12,
                        marginLeft: 4,
                        textAlign: 'left',
                        fontSize: 14
                    }}
                    color='danger'
                >
                    {'Error blablabla'}
                </Text>
            </View>
        );
    };

    renderPopups = () => {
        return (
            <View>
                {this.renderTitle('Popups')}
                <Button
                    style={styles.marginBot}
                    onPress={() => this.openPopup(1)}
                    appearance={this.state.selectedButon}
                    icon='planner-outline'
                >
                    {'Ouvrir une popup'}
                </Button>
                <Button
                    style={styles.marginBot}
                    onPress={() => this.openPopup(4)}
                    appearance={this.state.selectedButon}
                    icon='planner-outline'
                >
                    {"Ouvrir 4 popups d'affilée"}
                </Button>
            </View>
        );
    };

    renderIcons = () => {
        /** @type {IconsName[]} */ // @ts-ignore
        const iconKeys = Object.keys(ICONS);

        const iconPair = iconKeys
            // @ts-ignore
            .filter(
                (icon) =>
                    icon.endsWith('-outline') ||
                    iconKeys.includes(icon + '-outline')
            );

        const iconNormal = iconPair
            .filter((icon) => !icon.endsWith('-outline'))
            .sort();
        const iconOutline = iconPair
            .filter((icon) => icon.endsWith('-outline'))
            .sort();
        const iconOther = iconKeys
            .filter((icon) => !iconPair.includes(icon))
            .sort();

        return (
            <>
                {this.renderTitle('Icons')}
                <View>
                    <Animated.View style={{ opacity: this.animLinear }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                                marginBottom: 6
                            }}
                        >
                            {iconNormal.map((icon) => (
                                <Icon
                                    key={icon}
                                    icon={icon}
                                    color='main1'
                                    style={{ margin: 4 }}
                                />
                            ))}
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: Animated.subtract(1, this.animLinear)
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                                marginBottom: 6
                            }}
                        >
                            {iconOutline.map((icon) => (
                                <Icon
                                    key={icon}
                                    icon={icon}
                                    color='main1'
                                    style={{ margin: 4 }}
                                />
                            ))}
                        </View>
                    </Animated.View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                            marginBottom: 6
                        }}
                    >
                        {iconOther.map((icon) => (
                            <Icon
                                key={icon}
                                icon={icon}
                                color='main1'
                                style={{ margin: 4 }}
                            />
                        ))}
                    </View>
                </View>
            </>
        );
    };

    comboboxData = [
        { key: 0, value: 'Abc 0' },
        { key: 1, value: 'Def 1' },
        { key: 2, value: 'Item 2' },
        { key: 3, value: 'Item 3' },
        { key: 4, value: 'Item 4' },
        { key: 5, value: 'Item 5' }
    ];
    renderComboBox = () => {
        return (
            <>
                {this.renderTitle('ComboBox')}
                <ComboBox
                    data={this.comboboxData}
                    selectedValue={this.state.combobox.value}
                    onSelect={(item) => {
                        this.setState({
                            combobox:
                                item === null ? { ID: -1, value: '' } : item
                        });
                    }}
                    enableSearchBar
                />
            </>
        );
    };

    renderSwitches = () => {
        return (
            <View>
                {this.renderTitle('Switch / Checkbox')}
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        marginBottom: 12
                    }}
                >
                    <Switch
                        color='main2'
                        value={this.state.switch1}
                        onChangeValue={(value) => {
                            this.setState({ switch1: value });
                        }}
                    />
                    <Switch
                        value={this.state.switch2}
                        onChangeValue={(value) => {
                            this.setState({ switch2: value });
                        }}
                    />
                    <CheckBox
                        value={this.state.checkbox1}
                        onChangeValue={(value) => {
                            this.setState({ checkbox1: value });
                        }}
                    />
                    <CheckBox
                        color='main2'
                        value={this.state.checkbox2}
                        onChangeValue={(value) => {
                            this.setState({ checkbox2: value });
                        }}
                    />
                </View>
            </View>
        );
    };

    switchTextData = ['Test 1', 'Test 2', 'Test 3'];
    renderSwitchText = () => {
        return (
            <View>
                {this.renderTitle('SwitchText')}
                <SwitchText
                    style={styles.marginBot}
                    texts={this.switchTextData}
                    value={this.state.switchText}
                    onChangeValue={(value) => {
                        this.setState({ switchText: value });
                    }}
                />
            </View>
        );
    };

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
                    color='main1'
                />
                <ProgressBar
                    style={styles.marginBot}
                    value={Math.random() * 10}
                    color='main2'
                    supValue={Math.random() * 10}
                />
                <ProgressBar
                    style={styles.marginBot}
                    value={Math.random() * 10}
                />
                <ProgressBar.Infinite />
            </View>
        );
    };
}

export default Test;

import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import BackReport from './back';
import langManager from '../../../Managers/LangManager';

import { PageHeader } from '../../Widgets';
import { Page, Text, ComboBox, Input, Button, Digit } from '../../Components';

class Report extends BackReport {
    renderActivity = () => {
        const lang = langManager.curr['report'];
        const text = lang['type-activity-text'];
        const text_remain = lang['type-activity-remain'] + this.state.remain;
        const text_name = lang['type-activity-name'];
        const text_category = lang['type-activity-category'];

        return (
            <View>
                <Text style={styles.text}>{text}</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Input
                            style={styles.input}
                            label={text_name}
                            text={this.state.input_skillname}
                            onChangeText={this.changeTextInputSkillName}
                        />
                        <Input
                            style={styles.input}
                            label={text_category}
                            text={this.state.input_skillcategory}
                            onChangeText={this.changeTextInputSkillCategory}
                        />
                    </View>

                    <View style={styles.column}>
                        <Text fontSize={18}>{text_remain}</Text>
                        <FlatList
                            keyExtractor={(item, i) => 'report-stat-' + i}
                            data={Object.keys(this.stats)}
                            renderItem={({item, i}) => (
                                <View style={styles.rowDigit}>
                                    <Text>{item}</Text>
                                    <Digit name={item} initValue={this.stats[item]} maxValue={this.state.statsRemain[item]} callback={this.changeDigit} />
                                </View>
                            )}
                        />
                    </View>
                </View>
            </View>
        )
    }
    renderSuggest = () => {
        const lang = langManager.curr['report'];
        const text = lang['type-suggest-text'];
        const label = lang['type-suggest-input'];

        return (
            <View>
                <Text style={styles.text}>{text}</Text>
                <Input
                    style={{ marginBottom: 24}}
                    label={label}
                    text={this.state.input_suggest}
                    onChangeText={this.changeTextInputSuggest}
                    multiline
                />
            </View>
        )
    }
    renderBug = () => {
        const lang = langManager.curr['report'];
        const text = lang['type-bug-text'];
        const input1 = lang['type-bug-input1'];
        const input2 = lang['type-bug-input2'];

        return (
            <View>
                <Text style={[styles.text, { marginBottom: 24 }]}>{text}</Text>
                <Input
                    style={{ marginBottom: 24}}
                    label={input1}
                    text={this.state.input_bug1}
                    onChangeText={this.changeTextInputBug1}
                    multiline
                />
                <Input
                    style={{ marginBottom: 24}}
                    label={input2}
                    text={this.state.input_bug2}
                    onChangeText={this.changeTextInputBug2}
                    multiline
                />
            </View>
        )
    }
    renderMessage = () => {
        const lang = langManager.curr['report'];
        const text = lang['type-message-text'];

        return (
            <View>
                <Text style={[styles.text, { marginBottom: 24 }]}>{text}</Text>
                <Input
                    style={{ marginBottom: 24}}
                    label={lang['type-message-input']}
                    text={this.state.input_message}
                    onChangeText={this.changeTextInputMessage}
                    multiline
                />
            </View>
        )
    }

    render() {
        const lang = langManager.curr['report'];
        const { selectedType, reportHeight } = this.state;

        return (
            <Page onStartShouldSetResponder={this.keyboardDismiss} canScrollOver={false} bottomOffset={0}>
                <PageHeader
                    style={{ marginBottom: 24 }}
                    onBackPress={this.back}
                    onHelpPress={this.info}
                    hideHelp={this.state.selectedType !== 2}
                />

                <Text containerStyle={{ marginBottom: 24 }} fontSize={36}>{lang['page-title']}</Text>

                <ComboBox
                    title={lang['types-text']}
                    data={this.types}
                    selectedValue={this.types[this.state.selectedType].value}
                    onSelect={this.selectType}
                    ignoreWarning
                />

                <View style={{ minHeight: reportHeight, marginTop: 24 }} onLayout={this.onLayout}>
                    {selectedType === 0 && this.renderActivity()}
                    {selectedType === 1 && this.renderSuggest()}
                    {selectedType === 2 && this.renderBug()}
                    {selectedType === 3 && this.renderMessage()}

                    <Button
                        style={styles.button}
                        color='main2'
                        onPress={this.sendData}
                        loading={this.state.sending}
                    >
                        {lang['button-send']}
                    </Button>
                </View>
            </Page>
        )
    }
}

const styles = StyleSheet.create({
    text: { fontSize: 22 },
    input: { height: 52, marginBottom: 24 },

    column: { width: '50%' },
    row: {
        marginVertical: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowDigit: {
        marginVertical: 2,
        paddingHorizontal: '20%',

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    center: {
        marginVertical: "10%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    button: {
        height: 48,
        marginHorizontal: '20%',
        borderRadius: 8
    }
});

export default Report;
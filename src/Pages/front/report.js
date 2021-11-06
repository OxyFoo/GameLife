import * as React from 'react';
import { View, StyleSheet, FlatList, ScrollView, Dimensions } from 'react-native';

import BackReport from '../back/report';
import { GLDigit, GLDropDown, GLHeader, GLInput, GLText, GLButton } from '../Components';

import langManager from '../../Managers/LangManager';

class Report extends BackReport {
    content = () => {
        const state = this.state.selectedType;
        let output = <></>;
        const text_send = langManager.curr['report']['button-send'];

        const sendButton = () => {
            return (
                <View style={styles.center}>
                    <GLButton value={text_send} onPress={this.sendData.bind(this)} />
                </View>
            )
        }

        const content_activity = () => {
            const text = langManager.curr['report']['type-activity-text'];
            const text_remain = langManager.curr['report']['type-activity-remain'] + this.state.remain;
            const text_name = langManager.curr['report']['type-activity-name'];
            const text_category = langManager.curr['report']['type-activity-category'];

            return (
                <View>
                    <GLText style={styles.text} title={text} />
                    <View style={styles.row}>
                        <View style={styles.column}>
                            <GLText style={styles.text} title={text_name} />
                            <GLInput value={this.state.input_skillname} onChangeText={this.changeTextInputSkillName} multiline />
                            <GLText style={styles.text} title={text_category} />
                            <GLInput value={this.state.input_skillcategory} onChangeText={this.changeTextInputSkillCategory} multiline />
                        </View>
                        <View style={styles.column}>
                            <GLText style={styles.textCenter} title={text_remain} />
                            <FlatList
                                keyExtractor={(item, i) => 'report-stat-' + i}
                                data={Object.keys(this.stats)}
                                renderItem={({item, i}) => (
                                    <View style={styles.rowS}>
                                        <GLText title={item} />
                                        <GLDigit index={item} initValue={this.stats[item]} maxValue={this.state.statsRemain[item]} callback={this.changeDigit} lock={item === 'con'} />
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                    {sendButton()}
                </View>
            )
        }
        
        const content_suggest = () => {
            const text = langManager.curr['report']['type-suggest-text'];
            return (
                <View>
                    <GLText style={styles.text} title={text} />
                    <GLInput value={this.state.input_suggest} onChangeText={this.changeTextInputSuggest} multiline />
                    {sendButton()}
                </View>
            )
        }

        const content_bug = () => {
            const text = langManager.curr['report']['type-bug-text'];
            const input1 = langManager.curr['report']['type-bug-input1'];
            const input2 = langManager.curr['report']['type-bug-input2'];
            return (
                <View>
                    <GLText style={styles.text} title={text} />
                    <GLInput name={input1} value={this.state.input_bug1} onChangeText={this.changeTextInputBug1} multiline />
                    <GLInput name={input2} value={this.state.input_bug2} onChangeText={this.changeTextInputBug2} multiline />
                    {sendButton()}
                </View>
            )
        }

        const content_message = () => {
            const text = langManager.curr['report']['type-message-text'];
            return (
                <View>
                    <GLText style={styles.text} title={text} />
                    <GLInput value={this.state.input_message} onChangeText={this.changeTextInputMessage} multiline />
                    {sendButton()}
                </View>
            )
        }

        if (state === 0) output = content_activity();
        else if (state === 1) output = content_suggest();
        else if (state === 2) output = content_bug();
        else if (state === 3) output = content_message();

        return output;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['report']['page-title']}
                    leftIcon="back"
                    onPressLeft={this.back}
                    rightIcon={this.state.selectedType === 2 ? 'info' : ''}
                    onPressRight={this.info}
                />

                {/* Content */}
                <View style={styles.container}>
                    <View style={styles.row}>
                        <GLText style={styles.title} title={langManager.curr['report']['types-text']} />
                        <GLDropDown
                            style={{ flex: 1, paddingLeft: 24 }}
                            value={this.types[this.state.selectedType].value}
                            data={this.types}
                            onSelect={this.selectType}
                            showOnSelect={true}
                        />
                    </View>

                    <this.content />
                </View>
            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: "5%"
    },
    title: { fontSize: ww * 85 / 1000 },
    text: { fontSize: ww * 53 / 1000, marginVertical: wh*15/1000 },
    textCenter: { fontSize: ww * 426 / 10000, textAlign: 'center', marginVertical: "2%" },

    stats: {
        marginTop: "3%"
    },

    column: { width: '50%' },
    row: {
        marginVertical: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowS: {
        marginVertical: "1.3%",
        paddingHorizontal: "20%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    center: {
        marginVertical: "10%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    }
});

export default Report;
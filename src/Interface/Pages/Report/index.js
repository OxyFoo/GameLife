import * as React from 'react';
import { View, ScrollView, FlatList } from 'react-native';

import styles from './style';
import StartHelp from './help';
import BackReport from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, ComboBox, InputText, Button, Digit } from 'Interface/Components';
import { PageHeader } from 'Interface/Widgets';

class Report extends BackReport {
    render() {
        const lang = langManager.curr['report'];
        const { selectedType, sending } = this.state;

        return (
            <View style={styles.page} onTouchStart={this.keyboardDismiss}>
                <PageHeader onBackPress={this.back} onSecondaryIconPress={selectedType === 2 ? StartHelp : undefined} />

                <Text style={styles.titleContainer}>{lang['page-title']}</Text>

                <ComboBox
                    title={lang['types-text']}
                    data={this.reportTypes}
                    selectedValue={this.reportTypes[selectedType].value}
                    onSelect={this.selectType}
                />

                <ScrollView style={styles.container}>
                    {selectedType === 0 && this.renderActivity()}
                    {selectedType === 1 && this.renderBug()}
                    {selectedType === 2 && this.renderSuggest()}
                    {selectedType === 3 && this.renderMessage()}

                    <Button onPress={this.sendData} loading={sending}>
                        {lang['button-send']}
                    </Button>
                </ScrollView>
            </View>
        );
    }

    renderActivity = () => {
        const {
            input_skillname,
            input_skillcategory,
            input_skillstats,
            input_skillstats_max,
            input_skillstats_remain
        } = this.state;
        const lang = langManager.curr['report'];
        const langStats = langManager.curr['statistics']['names-min'];

        return (
            <View>
                <Text style={styles.text}>{lang['type-activity-text']}</Text>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <InputText
                            containerStyle={styles.input}
                            label={lang['type-activity-name']}
                            value={input_skillname}
                            onChangeText={this.changeTextInputSkillName}
                        />
                        <InputText
                            containerStyle={styles.input}
                            label={lang['type-activity-category']}
                            value={input_skillcategory}
                            onChangeText={this.changeTextInputSkillCategory}
                        />
                    </View>

                    <View style={styles.column}>
                        <Text fontSize={18}>{`${lang['type-activity-remain']} ${input_skillstats_remain}`}</Text>
                        <FlatList
                            keyExtractor={(item) => `report-stat-${item}`}
                            data={user.experience.statsKey}
                            renderItem={({ item }) => (
                                <View style={styles.rowDigit}>
                                    <Text>{langStats[item]}</Text>
                                    <Digit
                                        minDigitWidth={14}
                                        value={input_skillstats[item]}
                                        maxValue={input_skillstats_max[item]}
                                        onChangeValue={(index) => this.changeDigit(item, index)}
                                    />
                                </View>
                            )}
                        />
                    </View>
                </View>
            </View>
        );
    };

    renderSuggest = () => {
        const { input_suggest } = this.state;

        const lang = langManager.curr['report'];
        const text = lang['type-suggest-text'];
        const label = lang['type-suggest-input'];

        return (
            <View>
                <Text style={styles.textSuggest}>{text}</Text>
                <InputText
                    containerStyle={styles.input}
                    label={label}
                    value={input_suggest}
                    onChangeText={this.changeTextInputSuggest}
                    numberOfLines={2}
                    multiline
                />
            </View>
        );
    };

    renderBug = () => {
        const { input_bug1, input_bug2 } = this.state;

        const lang = langManager.curr['report'];
        const text = lang['type-bug-text'];
        const input1 = lang['type-bug-input1'];
        const input2 = lang['type-bug-input2'];

        return (
            <View>
                <Text style={[styles.text, styles.marginBot]}>{text}</Text>
                <InputText
                    containerStyle={styles.input}
                    label={input1}
                    value={input_bug1}
                    onChangeText={this.changeTextInputBug1}
                    numberOfLines={2}
                    multiline
                />
                <InputText
                    containerStyle={styles.input}
                    label={input2}
                    value={input_bug2}
                    onChangeText={this.changeTextInputBug2}
                    numberOfLines={2}
                    multiline
                />
            </View>
        );
    };

    renderMessage = () => {
        const { input_message } = this.state;

        const lang = langManager.curr['report'];
        const text = lang['type-message-text'];

        return (
            <View>
                <Text style={[styles.text, styles.marginBot]}>{text}</Text>
                <InputText
                    containerStyle={styles.input}
                    label={lang['type-message-input']}
                    value={input_message}
                    onChangeText={this.changeTextInputMessage}
                    numberOfLines={2}
                    multiline
                />
            </View>
        );
    };
}

export default Report;

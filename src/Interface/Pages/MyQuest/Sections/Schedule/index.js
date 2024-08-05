import * as React from 'react';
import { View, FlatList } from 'react-native';

import styles from './style';
import BackSectionSchedule, { TYPES, TYPES_FREQ } from './back';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Range } from 'Utils/Functions';
import { Text, Button, SwitchText, Digit, ComboBox } from 'Interface/Components';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').ListRenderItem<string>} ListRenderItemString
 */

class SectionSchedule extends BackSectionSchedule {
    render() {
        const lang = langManager.curr['quest'];
        const { quest } = this.props;
        if (quest === null) return null;

        const dateNames = langManager.curr['dates']['names'];
        const timeIntervals = [dateNames['weekly'], dateNames['monthly'], lang['input-switch-frequency']];

        return (
            <View>
                <SwitchText
                    texts={timeIntervals}
                    value={TYPES.indexOf(quest.schedule.type)}
                    onChangeValue={this.switchMode}
                />

                {this.renderMessages()}
                {this.renderDaySelector()}
                {this.renderFrequency()}
            </View>
        );
    }

    renderMessages = () => {
        const lang = langManager.curr['quest'];
        const { quest } = this.props;
        if (quest === null) return null;

        return (
            <>
                {quest.schedule.type === 'month' && <Text style={styles.hintText}>{lang['text-hint-select']}</Text>}
                {quest.schedule.type === 'frequency' && (
                    <Text style={styles.hintText}>{lang['text-hint-frequency']}</Text>
                )}
            </>
        );
    };

    renderDaySelector = () => {
        const { quest } = this.props;
        if (quest === null) return;

        const langDates = langManager.curr['dates'];

        /** @type {string[]} */
        let elements = [];

        // Add first letter of each day
        if (quest.schedule.type === 'week') {
            elements = langDates['days'].map((day) => day.charAt(0));
            elements.push(elements.splice(0, 1)[0]);
        }

        // Add numbers from 1 to 31
        else if (quest.schedule.type === 'month') {
            elements = Range(35).map((i) => (i + 1).toString());
        }

        return (
            <FlatList
                style={styles.daysFlatlist}
                columnWrapperStyle={styles.daysColumnWrapperStyle}
                contentContainerStyle={styles.daysContentContainerStyle}
                data={elements}
                renderItem={quest.schedule.type === 'week' ? this.renderWeekDay : this.renderMonthDay}
                keyExtractor={(item, index) => `pickday-${index}-${item}`}
                ItemSeparatorComponent={this.renderSeparator}
                numColumns={7}
            />
        );
    };

    renderSeparator = () => <View style={styles.separator} />;

    /** @type {ListRenderItemString} */
    renderWeekDay = ({ item, index }) => {
        const { quest } = this.props;
        if (quest === null) return null;

        const { schedule } = quest;
        if (schedule.type !== 'week' && schedule.type !== 'month') return null;

        /** @type {StyleProp} */
        const styleBorder = {
            marginLeft: index % 7 === 0 ? 0 : 4,
            borderColor: themeManager.GetColor('main1')
        };

        return (
            <Button
                style={[styles.selectorButtonWeekDay, styleBorder]}
                appearance='uniform'
                color={schedule.repeat.includes(index) ? 'main1' : 'transparent'}
                fontColor={schedule.repeat.includes(index) ? 'white' : 'main1'}
                onPress={() => this.onDaySelect(index)}
                onLongPress={() => this.onDaysSelect(index)}
            >
                {item}
            </Button>
        );
    };

    /** @type {ListRenderItemString} */
    renderMonthDay = ({ item, index }) => {
        const { quest } = this.props;
        if (quest === null) return null;

        const { schedule } = quest;
        if (schedule.type !== 'week' && schedule.type !== 'month') return null;

        const marginLeft = index % 7 === 0 ? 0 : 4;
        const borderColor = themeManager.GetColor('main1');

        if (index > 30) {
            return <View style={[styles.selectorButtonMonthDay, { marginLeft }]} />;
        }

        return (
            <Button
                style={[styles.selectorButtonMonthDay, { marginLeft, borderColor }]}
                appearance='uniform'
                color={schedule.repeat.includes(index) ? 'main1' : 'transparent'}
                fontColor={schedule.repeat.includes(index) ? 'white' : 'main1'}
                onPress={() => this.onDaySelect(index)}
                onLongPress={() => this.onDaysSelect(index)}
            >
                {item}
            </Button>
        );
    };

    renderFrequency = () => {
        const langDatesNames = langManager.curr['dates']['names'];
        const { quest } = this.props;
        if (quest === null) return null;

        if (quest.schedule.type !== 'frequency') {
            return null;
        }

        const data = [
            { key: 1, value: langDatesNames['week'] },
            { key: 2, value: langDatesNames['month'] }
        ];

        return (
            <View style={styles.frequencyContainer}>
                <Digit
                    style={styles.frequencyDigit}
                    //containerWidth={60}
                    value={quest.schedule.quantity}
                    minValue={1}
                    maxValue={quest.schedule.frequencyMode === 'week' ? 7 : 30}
                    onChangeValue={this.onFrequencyChange}
                />
                <Text style={styles.frequencySeparator}>/</Text>
                <ComboBox
                    style={styles.frequencyComboBox}
                    inputStyle={styles.frequencyComboBoxInput}
                    data={data}
                    title=''
                    selectedValue={data[TYPES_FREQ.indexOf(quest.schedule.frequencyMode)].value}
                    onSelect={this.onFrequencyChangeMode}
                />
            </View>
        );
    };
}

export default SectionSchedule;

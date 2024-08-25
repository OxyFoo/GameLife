import React from 'react';
import { View, FlatList } from 'react-native';
import { PieChart as PieGiftedChart } from 'react-native-gifted-charts';

import BackPieChart from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import Text from '../Text';

/**
 * @typedef {import('./back').UpdatingData} UpdatingData
 * @typedef {import('react-native').ListRenderItem<UpdatingData>} ListRenderItem
 *
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 * @typedef {import('react-native').ListRenderItem<MyQuest>} FlatListMyQuestProps
 *
 */

class PieChart extends BackPieChart {
    /**
     * Renders a colored dot used for legends or markers.
     * @param {string} color The color of the dot.
     * @returns {JSX.Element} A View component styled as a colored dot.
     */
    renderDot = (color) => (
        <View
            style={[
                styles.dot,
                {
                    backgroundColor: color
                }
            ]}
        />
    );

    /** @type {ListRenderItem} */
    renderLegendItemFullDay = ({ item, index }) => (
        <View key={index} style={styles.legendItem}>
            {this.renderDot(item.color)}
            <Text fontSize={14} color='white'>
                {`${item.name}: ${item.value}%`}
            </Text>
        </View>
    );

    /** @type {ListRenderItem} */
    renderLegendItem = ({ item, index }) => {
        const lang = langManager.curr['dates']['names'];
        const hour = Math.floor(item.valueMinutes / 60);
        const minutes = item.valueMinutes % 60;
        return (
            <View key={index} style={styles.legendItem}>
                {this.renderDot(item.color)}
                <Text fontSize={14} color='white'>
                    {`${item.name}: ${hour}${lang['hours-min']} ${minutes}${lang['minutes-min']}`}
                </Text>
            </View>
        );
    };

    /**
     * Renders the center label component. (biggest activity value + name)
     * @returns {JSX.Element} A View component styled as a center label component.
     */
    renderCenterLabelComponent = () => (
        <View style={styles.centerLabel}>
            <Text fontSize={16} color='white'>
                {this.props.focusedActivity?.value + '%'}
            </Text>
            <Text fontSize={10} color='white'>
                {this.props.focusedActivity?.name}
            </Text>
        </View>
    );

    /**
     * Renders the center label component. (biggest activity value + name)
     * @returns {JSX.Element} A View component styled as a center label component.
     */
    renderCenterLabelComponentFullDay = () => {
        const lang = langManager.curr['home'];
        const langDates = langManager.curr['dates']['names'];
        const totalMinutes = this.props.data.reduce((acc, cur) => acc + cur.valueMinutes, 0);
        const hour = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return (
            <View style={styles.centerLabel}>
                <Text fontSize={10} color='white'>
                    {lang['chart-total-text']}
                </Text>
                <Text fontSize={12} color='white'>
                    {`${hour}${langDates['hours-min']} ${minutes}${langDates['minutes-min']}`}
                </Text>
            </View>
        );
    };

    render() {
        const { style, data, focusedActivity } = this.props;

        if (!data || !focusedActivity) {
            return null;
        }

        return (
            <View style={[styles.pieChartContainer, style]}>
                <View style={styles.pieChart}>
                    <PieGiftedChart
                        data={data}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={50}
                        innerRadius={30}
                        innerCircleColor={themeManager.GetColor(this.props.insideBackgroundColor)}
                        centerLabelComponent={this.renderCenterLabelComponentFullDay}
                    />
                </View>

                <View style={styles.legendContainer}>
                    <FlatList
                        data={data}
                        style={styles.flatlist}
                        renderItem={this.renderLegendItem}
                        keyExtractor={(item) => `piechart-legend-${item.name}`}
                        scrollEnabled={false}
                    />
                </View>
            </View>
        );
    }

    /** @type {FlatListMyQuestProps} */
    renderMyQuest = ({ item: quest }) => {
        const daysQuest = user.quests.myquests.GetDays(quest);
        const questToday = daysQuest.find((day) => day.isToday);

        if (!questToday) {
            return null;
        }

        return (
            <Text style={styles.myQuestsText} fontSize={14}>
                {`- ${quest.title}: ${questToday.progress}%`}
            </Text>
        );
    };
}

export default PieChart;

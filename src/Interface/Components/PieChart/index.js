import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';

import BackPieChart from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text } from '../Text';
import { DonutChart } from '../DonutChart';

/**
 * @typedef {import('./back').UpdatingData} UpdatingData
 * @typedef {import('react-native').ListRenderItem<UpdatingData>} ListRenderItem
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 * @typedef {import('react-native').ListRenderItem<Quest>} FlatListQuestProps
 *
 */

class PieChart extends BackPieChart {
    constructor(props) {
        super(props);
        this.state = {
            showDonutChart: true, // true pour donut chart, false pour flat list
            donutKey: 0 // compteur pour forcer le remount du donut chart
        };
    }

    /**
     * Bascule entre le donut chart et la flat list
     */
    toggleDisplay = () => {
        this.setState((prevState) => ({
            showDonutChart: !prevState.showDonutChart,
            // Incrémenter le donutKey quand on bascule vers le donut chart pour forcer le remount
            donutKey: !prevState.showDonutChart ? prevState.donutKey + 1 : prevState.donutKey
        }));
    };

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
        const langDates = langManager.curr['dates']['names'];
        const lang = langManager.curr['home'];
        const totalMinutes = this.props.data.reduce((acc, cur) => acc + cur.valueMinutes, 0);
        const hour = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return (
            <View style={styles.centerLabel}>
                {/* TODO : BOLD TEXT mais il veut pas */}
                <Text fontSize={16} color='white' style={styles.centerLabelText}>
                    {`${hour}${langDates['hours-min']} ${minutes}${langDates['minutes-min']}`}
                </Text>
                <Text fontSize={10} color='white'>
                    {lang['chart-click-me']}
                </Text>
            </View>
        );
    };

    /**
     * Converts the data format to our custom DonutChart format
     * @param {Array<UpdatingData>} data - The original data array
     * @returns {Array<{label: string, value: number, stroke: string}>} Converted data for DonutChart
     */
    convertDataForDonutChart = (data) => {
        return data
            .filter((item) => item.value > 0) // Filter out items with 0 value
            .map((item) => ({
                label: item.name || 'Unknown',
                value: item.value,
                stroke: item.color || '#000000'
            }));
    };

    render() {
        const { style, data, focusedActivity } = this.props;
        const { showDonutChart, donutKey } = this.state;

        if (!data || !focusedActivity) {
            return null;
        }

        // Convert data for the new DonutChart
        const convertedData = this.convertDataForDonutChart(data);

        return (
            <TouchableOpacity
                style={[styles.pieChartContainer, style]}
                onPress={this.toggleDisplay}
                activeOpacity={0.8}
            >
                {showDonutChart ? (
                    // Affichage du donut chart
                    <>
                        <View style={styles.pieChart}>
                            <DonutChart
                                key={`donut-${donutKey}`}
                                data={convertedData}
                                size={110}
                                strokeWidth={8}
                                strokeLinecap='round'
                                delay={0}
                                segmentGap={12}
                            >
                                {this.renderCenterLabelComponentFullDay()}
                            </DonutChart>
                        </View>
                    </>
                ) : (
                    // Affichage de la flat list
                    <View style={styles.legendContainerFullScreen}>
                        <FlatList
                            data={data}
                            style={styles.flatlist}
                            renderItem={this.renderLegendItem}
                            keyExtractor={(item) => `piechart-legend-${item.name}`}
                            scrollEnabled={false}
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    }

    // TODO: Unused ?
    /** @type {FlatListQuestProps} */
    renderQuest = ({ item: quest }) => {
        const daysQuest = user.quests.GetDays(quest);
        const questToday = daysQuest.find((day) => day.isToday);

        if (!questToday) {
            return null;
        }

        return (
            <Text style={styles.QuestsText} fontSize={14}>
                {`- ${quest.title}: ${questToday.progress}%`}
            </Text>
        );
    };
}

export { PieChart };

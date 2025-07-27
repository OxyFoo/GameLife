import React from 'react';
import { View, FlatList } from 'react-native';

import BackPieChart from './back';
import styles from './style';
import langManager from 'Managers/LangManager';

import { DonutChart, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').UpdatingData} UpdatingData
 * @typedef {import('react-native').ListRenderItem<UpdatingData>} ListRenderItem
 */

class PieChart extends BackPieChart {
    render() {
        const { data, focusedActivity } = this.props;
        const { isDonutView } = this.props;

        if (!data || !focusedActivity) {
            return null;
        }

        if (!isDonutView) {
            return this.renderLegend();
        }

        return this.renderCenterLabelComponentFullDay();
    }

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
    renderCenterLabelComponentFullDay = () => {
        const langDates = langManager.curr['dates']['names'];
        const lang = langManager.curr['home'];
        const { data } = this.props;

        const totalMinutes = this.props.data.reduce((acc, cur) => acc + cur.valueMinutes, 0);
        const hour = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const convertedData = this.convertDataForDonutChart(data);

        return (
            <View style={styles.pieChart}>
                <DonutChart
                    data={convertedData}
                    size={110}
                    strokeWidth={8}
                    strokeLinecap='round'
                    delay={0}
                    segmentGap={12}
                >
                    <View style={styles.centerLabel}>
                        <Text fontSize={16} color='white' style={styles.centerLabelText}>
                            {`${hour}${langDates['hours-min']} ${minutes}${langDates['minutes-min']}`}
                        </Text>
                        <Text fontSize={10} color='white'>
                            {lang['chart-click-me']}
                        </Text>
                    </View>
                </DonutChart>
            </View>
        );
    };

    renderLegend = () => {
        const { data } = this.props;

        return (
            <View style={styles.legendContainerFullScreen}>
                <FlatList
                    data={data}
                    renderItem={this.renderLegendItem}
                    keyExtractor={(item) => `piechart-legend-${item.name}`}
                    scrollEnabled={false}
                />
            </View>
        );
    };
}

export { PieChart };

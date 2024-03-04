import React from 'react';
import { Animated, View, FlatList } from 'react-native';
import { PieChart as PieGiftedChart } from 'react-native-gifted-charts';

import BackPieChart from './back';
import styles from './style';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import Text from '../Text';
import { Round } from 'Utils/Functions';

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
            style={[styles.dot, {
                backgroundColor: color
            }]}
        />
    );

    /** @type {ListRenderItem} */
    renderLegendItem = ({ item, index }) => (
        <View key={index} style={styles.legendItem}>
            {this.renderDot(item.color)}
            <Text fontSize={14} color='white'>
                {`${item.name}: ${item.value}%`}
            </Text>
        </View>
    );

    /** @type {ListRenderItem} */
    renderLegendItemFullDay = ({ item, index }) => {
        const lang = langManager.curr['dates']['names'];
        return (
            <View key={index} style={styles.legendItem}>
                {this.renderDot(item.color)}
                <Text fontSize={14} color='white'>
                    {`${item.name}: ${Round(item.valueMinutes / 60)}${lang['hours-min']}`}
                </Text>
            </View>
        );
    }

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

    render() {
        const lang = langManager.curr['home'];
        const { animSwitch } = this.state;
        const { style, data, dataFullDay, focusedActivity, layoutWidth } = this.props;

        if (!data || !focusedActivity) {
            return null;
        }

        const opacityData = {
            opacity: animSwitch
        };

        const opacityDataFullDay = {
            opacity: animSwitch.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        };

        const animStyle = {
            transform: [
                { translateX: Animated.multiply(animSwitch, -layoutWidth/2) }
            ]
        };

        return (
            <View style={style}>
                <Animated.View style={[styles.pieChartContainer, animStyle]}>
                    <Animated.View style={[styles.legendContainerFullDay, opacityDataFullDay]}>
                        <FlatList
                            data={dataFullDay.slice(0, -1)}
                            renderItem={this.renderLegendItemFullDay}
                            keyExtractor={(item, index) => 'piechart-legend-full-' + index.toString()}
                            scrollEnabled={false}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.pieChart, opacityData]}>
                        <PieGiftedChart
                            data={data}
                            donut
                            showGradient
                            sectionAutoFocus
                            radius={50}
                            innerRadius={30}
                            innerCircleColor={themeManager.GetColor(this.props.insideBackgroundColor)}
                            centerLabelComponent={this.renderCenterLabelComponent}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.pieChartFullDay, opacityDataFullDay]}>
                        <PieGiftedChart
                            data={dataFullDay}
                            donut
                            showGradient
                            sectionAutoFocus
                            radius={50}
                            innerRadius={30}
                            innerCircleColor={themeManager.GetColor(this.props.insideBackgroundColor)}
                            centerLabelComponent={this.renderCenterLabelComponent}
                        />
                    </Animated.View>

                    <Animated.View style={[styles.legendContainer, opacityData]}>
                        <FlatList
                            data={data}
                            renderItem={this.renderLegendItem}
                            keyExtractor={(item, index) => 'piechart-legend-' + index.toString()}
                            scrollEnabled={false}
                        />
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }

    /** @type {FlatListMyQuestProps} */
    renderMyQuest = ({ item: quest }) => {
        const daysQuest = user.quests.myquests.GetDays(quest);
        const questToday = daysQuest.find(day => day.isToday);

        if (!questToday) {
            return null;
        }

        return (
            <Text
                style={styles.myQuestsText}
                fontSize={14}
            >
                {`- ${quest.title}: ${questToday.fillingValue}%`}
            </Text>
        );
    }
}

export default PieChart;

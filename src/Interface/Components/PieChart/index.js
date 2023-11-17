import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { PieChart as PieChartLib } from 'react-native-gifted-charts';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').ListRenderItem<Item>} ListRenderItem
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 * 
 * @typedef {{ name: string, color: string, value: number }} Item
 * @typedef {{ id: number, value: number, name: string }} FocusedActivity
 * 
 * @typedef {object} itemType // object from lib gifted-charts
 */

const PieChartProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Array<itemType>} */
    data: [],

    /** @type {number} The number of legend items per row */
    elementPerRow: 2,

    /** @type {FocusedActivity|null} */
    focusedActivity: null,

    /** @type {ColorTheme|ColorThemeText} */
    insideBackgroundColor: 'dataBigKpi',
}

class PieChart extends React.Component {
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
            <Text style={styles.legendItemText}>{item.name}: {item.value}%</Text>
        </View>
    );

    /**
     * Renders the center label component. (biggest activity value + name)
     * @returns {JSX.Element} A View component styled as a center label component.
     */
    renderCenterLabelComponent = () => (
        <View style={styles.centerLabel}>
            <Text
                style={styles.labelText}>
                {this.props.focusedActivity?.value}%
            </Text>
            <Text style={styles.labelSubText}>
                {this.props.focusedActivity?.name}
            </Text>
        </View>
    );

    render() {
        const { style, data, focusedActivity, elementPerRow } = this.props;

        // filter data with value 0 (this correct the android bug)
        const dataFiltered = data.filter((item) => item.value > 0);

        if (!data || !focusedActivity) {
            return null;
        }

        return (
            <View style={style}>
                <View style={styles.pieChartContainer}>
                    <PieChartLib
                        data={dataFiltered}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={themeManager.GetColor(this.props.insideBackgroundColor)}
                        centerLabelComponent={this.renderCenterLabelComponent}
                    />
                    <View style={styles.legendContainer}>
                        <FlatList
                            style={styles.legendFlatList}
                            data={data}
                            renderItem={this.renderLegendItem}
                            keyExtractor={(item, index) => 'piechart-legend-' + index.toString()}
                            numColumns={elementPerRow}
                            contentContainerStyle={styles.legendFlatListContent} 
                            columnWrapperStyle={styles.legendFlatListColumn}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

PieChart.prototype.props = PieChartProps;
PieChart.defaultProps = PieChartProps;

export default PieChart;
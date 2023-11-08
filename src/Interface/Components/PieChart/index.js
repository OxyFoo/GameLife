import React from 'react';
import { View, Text } from 'react-native';
import { PieChart as PieChartLib } from 'react-native-gifted-charts';

import styles from './style';
import PieChartBack from './back';

/**
 * @typedef {import('./back').Item} Item
 */

class PieChart extends PieChartBack {
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

    /**
     * Renders a legend item. (color dot + text)
     * @param {Item} item The item object with color, name, and value properties.
     * @param {number} index
     * @returns {JSX.Element} A View component styled as a legend item.
     */
    renderLegendItem = (item, index) => (
        <View key={index} style={styles.legendItem}>
            {this.renderDot(item.color)}
            <Text style={styles.legendItemText}>{item.name}: {item.value}%</Text>
        </View>
    );

    /**
     * Renders the legend component. (In our case, three rows of two legend items)
     * @param {Item[]} dataToDisplay The data array of items with color, name, and value properties.
     * @param {number} elem_per_row The number of legend items per row.
     * @returns {JSX.Element} A View component styled as a legend component.
     */
    renderLegendComponent = (dataToDisplay, elem_per_row = 2) => (
        <>
            {Array.from({ length: Math.ceil(dataToDisplay.length / elem_per_row) }, (_, rowIndex) => (
                <View key={rowIndex} style={styles.legendRow}>
                    {
                        dataToDisplay
                        .slice(rowIndex * elem_per_row, rowIndex * elem_per_row + elem_per_row)
                        .map((item, index) => this.renderLegendItem(item, rowIndex * elem_per_row + index))
                    }
                </View>
            ))}
        </>
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
        const { style, data, focusedActivity } = this.props;

        if (!data || !focusedActivity) {
            return null;
        }

        return (
            <View style={style}>
                <View style={styles.pieChartContainer}>
                    <PieChartLib
                        data={data}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={'#232B5D'}
                        centerLabelComponent={this.renderCenterLabelComponent}
                    />
                    <View style={styles.legendContainer}>
                        {this.renderLegendComponent(data)}
                    </View>
                </View>
            </View>
        );
    }
}


export default PieChart;

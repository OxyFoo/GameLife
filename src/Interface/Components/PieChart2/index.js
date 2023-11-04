import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

import PieChartBack from './back';

import styles from './style';


class PieChart2 extends PieChartBack {

    render() {

        /**
         * Renders a colored dot used for legends or markers.
         *
         * @param {string} color - The color of the dot.
         * @returns {JSX.Element} A View component styled as a colored dot.
         */
        const renderDot = (color) => (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );

        /**
         * Renders a legend item. (color dot + text)
         * 
         * @param {{ color: string, name: string, value: number }} item - The item object with color, name, and value properties.
         * @param {number} index 
         * @returns {JSX.Element} A View component styled as a legend item.
         */
        const renderLegendItem = (item, index) => (
            <View key={index} style={styles.legendItem}>
                {renderDot(item.color)}
                <Text style={styles.legendItemText}>{item.name}: {item.value}%</Text>
            </View>
        );

        /**
         * Renders the legend component. (In our case, three rows of two legend items)
         * 
         * @param {{ color: string, name: string, value: number }[]} data - The data array of items with color, name, and value properties.
         * @param {number} elem_per_row - The number of legend items per row.
         * @returns {JSX.Element} A View component styled as a legend component.
         */
        const renderLegendComponent = (data, elem_per_row = 2) => (
            <>
                {Array.from({ length: Math.ceil(data.length / elem_per_row) }, (_, rowIndex) => (
                    <View key={rowIndex} style={styles.legendRow}>
                        {data.slice(rowIndex * elem_per_row, rowIndex * elem_per_row + elem_per_row).map((item, index) => renderLegendItem(item, rowIndex * elem_per_row + index))}
                    </View>
                ))}
            </>
        );

        /**
         * Renders the center label component. (biggest activity value + name)
         * 
         * @param {{ id: number, value: number, name: string }} biggestActivity - The biggest activity object with id, value, and name properties.
         * @returns {JSX.Element} A View component styled as a center label component.
         */
        const renderCenterLabelComponent = (biggestActivity) => (
            <View style={styles.centerLabel}>
                <Text
                    style={styles.labelText}>
                    {biggestActivity.value}%
                </Text>
                <Text style={styles.labelSubText}>
                    {biggestActivity.name}
                </Text>
            </View>
        );

        /**
         * Renders the pie chart with its legend component.
         * 
         * @param {{ data: { color: string, name: string, value: number }[] }} dataRendered - The object containing a `data` array of items with color, name, and value properties.
         * @param {{ id: number, value: number, name: string }} biggestActivity - The biggest activity object with id, value, and name properties.
         * @returns {JSX.Element} A View component styled as a pie chart with its legend component.
         */
        const renderPieChartWithLegend = (dataRendered, biggestActivity) => {
            return (
                <View style={styles.pieChartContainer}>
                    <PieChart
                        data={dataRendered}
                        donut
                        showGradient
                        sectionAutoFocus
                        radius={90}
                        innerRadius={60}
                        innerCircleColor={'#232B5D'}
                        centerLabelComponent={() => renderCenterLabelComponent(biggestActivity)}
                    />
                    {renderLegendComponent(dataRendered)}
                </View>
            );
        };

        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    Performance of the day
                </Text>
                {this.state.displayChart && this.state.focusedActivity && this.state.readyData ?
                    renderPieChartWithLegend(this.state.readyData, this.state.focusedActivity) : <></>}
            </View>
        );
    }
}


export default PieChart2;

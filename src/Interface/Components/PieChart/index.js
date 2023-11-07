import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

import PieChartBack from './back';

import styles from './style';

/**
 * @typedef {{ id:number, valueMin:number, color:string }} ItemBase
 * @typedef {{ name: string, color:string, value: number }} Item
 * @typedef {{ id: number, value: number, name: string }} focusedActivity
 */


class PieChartFront extends PieChartBack {

    /**
     * Renders a colored dot used for legends or markers.
     *
     * @param {string} color - The color of the dot.
     * @returns {JSX.Element} A View component styled as a colored dot.
     */
    renderDot = (color) => (
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
     * @param {Item} item - The item object with color, name, and value properties.
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
     * 
     * @param {Item[]} dataToDisplay - The data array of items with color, name, and value properties.
     * @param {number} elem_per_row - The number of legend items per row.
     * @returns {JSX.Element} A View component styled as a legend component.
     */
    renderLegendComponent = (dataToDisplay, elem_per_row = 2) => (
        <>
            {Array.from({ length: Math.ceil(dataToDisplay.length / elem_per_row) }, (_, rowIndex) => (
                <View key={rowIndex} style={styles.legendRow}>
                    {dataToDisplay.slice(rowIndex * elem_per_row, rowIndex * elem_per_row + elem_per_row)
                        .map((item, index) => this.renderLegendItem(item, rowIndex * elem_per_row + index))}
                </View>
            ))}
        </>
    );

    /**
     * Renders the center label component. (biggest activity value + name)
     * 
     * @param {focusedActivity} focusedActivity - The biggest activity object with id, value, and name properties.
     * @returns {JSX.Element} A View component styled as a center label component.
     */
    renderCenterLabelComponent = (focusedActivity) => (
        <View style={styles.centerLabel}>
            <Text
                style={styles.labelText}>
                {focusedActivity.value}%
            </Text>
            <Text style={styles.labelSubText}>
                {focusedActivity.name}
            </Text>
        </View>
    );

    /**
     * Renders the pie chart with its legend component.
     * 
     * @param {{ data: {Item}[] }} dataToDisplay - The object containing a `data` array of items with color, name, and value properties.
     * @param {focusedActivity} focusedActivity - The biggest activity object with id, value, and name properties.
     * @returns {JSX.Element} A View component styled as a pie chart with its legend component.
     */
    renderPieChartWithLegend = (dataToDisplay, focusedActivity) => {
        return (
            <View style={styles.pieChartContainer}>
                <PieChart
                    data={dataToDisplay}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={'#232B5D'}
                    centerLabelComponent={() => this.renderCenterLabelComponent(focusedActivity)}
                />
                {this.renderLegendComponent(dataToDisplay)}
            </View>
        );
    };

    render() {
        return (
            <View style={[this.props.style]}>
                {
                    this.state.dataToDisplay && this.state.focusedActivity ?
                        this.renderPieChartWithLegend(this.state.dataToDisplay, this.state.focusedActivity) : <></>
                }
                <View>
                    {this.state.dataToDisplay.map((item, index) => (
                        <Text key={index}>
                            {`ID: ${item.id}, Name: ${item.name}, Value: ${item.value}, Min Value: ${item.valueMin}, Color: ${item.color}, Center Color: ${item.gradientCenterColor}`}
                        </Text>
                    ))}
                </View>

            </View>
        );
    }
}


export default PieChartFront;

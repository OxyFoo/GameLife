import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { PieChart as PieChartLib } from 'react-native-gifted-charts';

import themeManager from 'Managers/ThemeManager';
import styles from './style';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {{ name: string, color:string, value: number }} Item
 * @typedef {{ id: number, valueMin: number, color: string }} ItemBase
 * @typedef {{ id: number, value: number, name: string }} FocusedActivity
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 * 
 * @typedef {Object} itemType // object from lib gifted-charts
 */

const InputProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Array<itemType>} */
    data: [],

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
        <FlatList
            style={{ width: '100%' }}
            data={dataToDisplay}
            renderItem={({ item, index }) => this.renderLegendItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            numColumns={elem_per_row}
            contentContainerStyle={{ paddingHorizontal: 5 }} 
            columnWrapperStyle={styles.legendRow}
            scrollEnabled={false}
        />
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
                        innerCircleColor={themeManager.GetColor(this.props.insideBackgroundColor)}
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

PieChart.prototype.props = InputProps;
PieChart.defaultProps = InputProps;


export default PieChart;

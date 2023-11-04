import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts"

import styles from './style';
import LineChartBack from './back';

class LineChartSkill extends LineChartBack {
    render() {


        /**
         * Renders a label component. (In our case, the date and the activity with the value)
         * 
         * @param {{ date: string, activity: string, value: number }[]} items - The data array of items with date, activity, and value properties.
         * @returns {JSX.Element} A View component styled as a label component.
         */
        const renderLabelComponent = (items) => {
            return (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelDate}>
                        {items[0].date}
                    </Text>

                    <View style={styles.labelWhiteContainer}>
                        <Text style={styles.labelText}>
                            {items[0].value + " min of " + items[0].activity}
                        </Text>
                        {items.length > 1 &&
                            <Text style={styles.labelText}>
                                {items[1].value + " min of " + items[1].activity}
                            </Text>
                        }
                    </View>
                </View>
            );
        }

        return (
            <View
                style={styles.container}>
                {this.dataReady && this.state.cleanedData ?
                    <BarChart
                        data={this.state.cleanedData}
                        width={this.props.chartWidth}
                        barWidth={this.barWidth}
                        initialSpacing={0}
                        spacing={0}
                        cappedBars
                        capColor={'rgba(78, 0, 142)'}
                        capThickness={4}
                        showGradient
                        gradientColor={'rgba(200, 100, 244,0.8)'}
                        frontColor={'rgba(219, 182, 249,0.2)'}
                        isAnimated
                    />
                    : <></>
                }
            </View>
        )
    }
};

export default LineChartSkill 
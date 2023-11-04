import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts"

import styles from './style';
import BarChartBack from './back';

class BarChartSkill extends BarChartBack {
    render() {

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
                        yAxisTextStyle={{color: 'white'}}
                        yAxisColor={'white'}
                        xAxisColor={'white'}
                        isAnimated
                    />
                    : <></>
                }
            </View>
        )
    }
};

export default BarChartSkill; 
import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart as LineChartLib } from 'react-native-gifted-charts';
import { Svg, Path, G, Line, Text } from 'react-native-svg';

import styles from './style';
import LineChartBack from './back';

// Helper function to scale data points to the SVG Canvas
const scaleX = (point, index, data, width) => (width / data.length) * index;
const scaleY = (point, maxPoint, height) => (height - (point / maxPoint) * height) + 10; // 10 is for padding from top

// Function to create the SVG path
const createLine = (data, width, height) => {
    if (data.length === 0) {
        return '';
    }

    const maxPoint = Math.max(...data.map(p => p.value));
    let pathD = `M ${scaleX(data[0].value, 0, data, width)} ${scaleY(data[0].value, maxPoint, height)}`;

    data.forEach((point, index) => {
        pathD += ` L ${scaleX(point.value, index, data, width)} ${scaleY(point.value, maxPoint, height)}`;
    });

    return pathD;
};

class LineChart extends LineChartBack {

    render() {
        return (
            <View
                style={{
                    marginVertical: 20,
                    paddingVertical: 20,
                    paddingLeft: 20,
                    backgroundColor: '#1C1C1C',
                }}>

                {this.props.data && this.props.spacing && this.props.maxVal ?
                    <LineChartLib
                        areaChart
                        data={this.props.data}
                        rotateLabel
                        width={300}
                        hideDataPoints
                        spacing={this.props.spacing}
                        color="#00ff83"
                        thickness={2}
                        startFillColor="rgba(20,105,81,0.3)"
                        endFillColor="rgba(20,85,81,0.01)"
                        startOpacity={0.9}
                        endOpacity={0.2}
                        initialSpacing={0}
                        noOfSections={6}
                        maxValue={this.props.maxVal}
                        yAxisColor="white"
                        yAxisThickness={0}
                        rulesType="solid"
                        rulesColor="gray"
                        yAxisTextStyle={{ color: 'gray' }}
                        yAxisSide='right'
                        xAxisColor="lightgray"
                    />
                    : <></>
                }

            </View>
        )
    };
}

export default LineChart; 
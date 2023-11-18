import React from 'react';
import { View } from 'react-native';
import { Svg, Polyline, Line, Text, Circle } from 'react-native-svg';

import LineChartSvgBack from './back';
import themeManager from 'Managers/ThemeManager';

class LineChartSvg extends LineChartSvgBack {
    renderChartContent() {
        const { data, lineColor } = this.props;
        const { points, layoutWidth } = this.state;

        if (points.length <= 1 || layoutWidth === 0) {
            return null;
        }

        // Ensure this is visible against the background
        const svgColor = themeManager.GetColor(lineColor);

        // Single point
        if (data.length === 1) {
            const [x, y] = points.split(',').map(Number);
            return (
                <Circle
                    key={`point_single`}
                    cx={x}
                    cy={y}
                    r='3' // Adjust if needed
                    fill={svgColor}
                />
            );
        }

        // Line chart
        return (
            <Polyline
                points={points}
                fill='none'
                stroke={svgColor}
                strokeWidth='2'
            />
        );
    }

    render() {
        const { graphHeight } = this.props;
        const { layoutWidth, maxValue, yAxisValues } = this.state;

        return (
            <View>
                <Svg
                    height={graphHeight + 40}
                    width={'100%'}
                    onLayout={this.onLayout}>

                    {/* Y-axis lines and labels */}
                    {maxValue > 0 && layoutWidth !== 0 && yAxisValues.map((value, index) => (
                        <React.Fragment key={`yaxis_line_${index}`}>
                            <Line
                                x1={this.leftMargin}
                                y1={graphHeight - this.scaleY(value, maxValue)}
                                x2={layoutWidth}
                                y2={graphHeight - this.scaleY(value, maxValue)}
                                stroke='rgba(100,100,100,0.4)'
                            />
                            <Text
                                x={0}
                                y={graphHeight - this.scaleY(value, maxValue)}
                                fontSize='14'
                                fill='rgb(150,150,150)'
                                alignmentBaseline='middle'
                            >
                                {value.toFixed(0)}
                            </Text>
                        </React.Fragment>
                    ))}

                    {/* Chart line or point */}
                    {this.renderChartContent()}

                    {/* Date labels for first and last data points */}
                    <Text
                        key={`text_first`}
                        x={60}
                        y={graphHeight + 15}
                        fontSize='12'
                        textAnchor='middle'
                        fill='rgba(150,150,150,1)'
                    >
                        {this.firstDate}
                    </Text>
                    <Text
                        key={`text_last`}
                        x={layoutWidth - 35}
                        y={graphHeight + 15}
                        fontSize='12'
                        textAnchor='middle'
                        fill='rgba(150,150,150,1)'
                    >
                        {this.lastDate}
                    </Text>
                </Svg>
            </View>
        );
    }
}

export default LineChartSvg;
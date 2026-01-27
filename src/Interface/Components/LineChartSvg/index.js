import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Line, Text, Circle, Path } from 'react-native-svg';

import LineChartSvgBack from './back';
import themeManager from 'Managers/ThemeManager';
import { generateSmoothPath } from 'Utils/Svg';

class LineChartSvg extends LineChartSvgBack {
    render() {
        const { graphHeight } = this.props;
        const { layoutWidth, maxValue, yAxisValues } = this.state;

        return (
            <View style={styles.svgContainer} onLayout={this.onLayout}>
                <Svg height={graphHeight + 40} width={'100%'}>
                    {/* Y-axis lines and labels */}
                    {maxValue > 0 &&
                        layoutWidth !== 0 &&
                        yAxisValues.map((value, index) => (
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

    renderChartContent() {
        const { lineColor, graphHeight, isAreaChart, smoothness } = this.props;
        const { points, layoutWidth } = this.state;

        if (points.length === 0 || layoutWidth === 0) {
            return null;
        }

        // Colors
        const topLineColor = themeManager.GetColor(lineColor);
        const fillColor = topLineColor + '30';

        // Single point
        if (points.length === 1) {
            return <Circle key={`point_single`} cx={points[0].x} cy={points[0].y} r='3' fill={topLineColor} />;
        }

        // Generate smooth curve path
        const linePath = generateSmoothPath(points, smoothness);

        // Area chart path - close the path to fill
        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];
        const areaPath = `${linePath} L${lastPoint.x},${graphHeight} L${firstPoint.x},${graphHeight} Z`;

        return (
            <>
                {/* Area fill */}
                {isAreaChart && <Path d={areaPath} fill={fillColor} />}

                {/* Smooth curve line */}
                <Path d={linePath} fill='none' stroke={topLineColor} strokeWidth='3' />
            </>
        );
    }
}

const styles = StyleSheet.create({
    svgContainer: {
        width: '100%'
    }
});

export { LineChartSvg };

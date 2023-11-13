import React, { useState, useRef } from 'react';
import { View, Text as RNText } from 'react-native';
import { Svg, Polyline, Line, Text } from 'react-native-svg';

import styles from './style';
import LineChartSvgBack from './back';

/**
 * @typedef {import('./back').Item} Item
 */

class LineChartSvg extends LineChartSvgBack {

    render() {

        return (
            <View>
                <Svg
                    height={this.props.graph_height + 40}
                    width={"100%"}
                    ref={this.svgRef}
                    onLayout={() => {
                        // Measure the width of the SVG after layout
                        this.svgRef.current.measure((x, y, width, height) => {
                            this.setState({ layoutWidth: width });
                        });
                    }}>

                    {/* Y-axis lines and labels */}
                    {this.state.dataReady && this.state.yAxisValues.map((value, index) => (
                        <React.Fragment key={`yaxis_line_${index}`}>
                            <Line
                                x1={this.left_margin}
                                y1={this.props.graph_height - this.scaleY(value, this.state.maxValue)}
                                x2={this.state.layoutWidth}
                                y2={this.props.graph_height - this.scaleY(value, this.state.maxValue)}
                                stroke="rgba(100,100,100,0.4)"
                            />
                            <Text
                                x={0}
                                y={this.props.graph_height - this.scaleY(value, this.state.maxValue)}
                                fontSize="14"
                                fill='rgba(150,150,150,1)'
                                alignmentBaseline="middle"
                            >
                                {value.toFixed(0)}
                            </Text>
                        </React.Fragment>
                    ))}

                    {/* Line chart */}
                    {this.state.dataReady && this.state.layoutWidth ?
                        <Polyline
                            points={this.state.points}
                            fill="none"
                            stroke={this.props.lineColor}
                            strokeWidth="2"
                        />
                        : <></>}

                    {/* Date labels for first and last data points */}
                    <Text
                        key={`text_first`}
                        x={60}
                        y={this.props.graph_height + 15}
                        fontSize="12"
                        textAnchor="middle"
                        fill="rgba(150,150,150,1)"
                    >
                        {this.props.data[0].date}
                    </Text>
                    <Text
                        key={`text_last`}
                        x={this.state.layoutWidth - 35}
                        y={this.props.graph_height + 15}
                        fontSize="12"
                        textAnchor="middle"
                        fill="rgba(150,150,150,1)"
                    >
                        {this.props.data[this.props.data.length - 1].date}
                    </Text>
                </Svg>
            </View>
        );
    }
}


export default LineChartSvg;

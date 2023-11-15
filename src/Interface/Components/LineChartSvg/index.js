import React from 'react';
import { View } from 'react-native';
import { Svg, Polyline, Line, Text } from 'react-native-svg';

import themeManager from 'Managers/ThemeManager';
import LineChartSvgBack from './back';

class LineChartSvg extends LineChartSvgBack {

    render() {

        return (
            <View>
                <Svg
                    height={this.props.graph_height + 40}
                    width={"100%"}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        this.onLayout(width);
                    }}>

                    {/* Y-axis lines and labels */}
                    {this.state.maxValue > 0 && this.state.layoutWidth !== 0 && this.state.yAxisValues.map((value, index) => (
                        <React.Fragment key={`yaxis_line_${index}`}>
                            <Line
                                x1={this.leftMargin}
                                y1={this.props.graph_height - this.scaleY(value, this.state.maxValue)}
                                x2={this.state.layoutWidth}
                                y2={this.props.graph_height - this.scaleY(value, this.state.maxValue)}
                                stroke="rgba(100,100,100,0.4)"
                            />
                            <Text
                                x={0}
                                y={this.props.graph_height - this.scaleY(value, this.state.maxValue)}
                                fontSize="14"
                                fill='rgb(150,150,150)'
                                alignmentBaseline="middle"
                            >
                                {value.toFixed(0)}
                            </Text>
                        </React.Fragment>
                    ))}

                    {/* Line chart */}
                    {this.state.points.length > 1 && this.state.layoutWidth !== 0 ?
                        <Polyline
                            points={this.state.points}
                            fill="none"
                            stroke={themeManager.GetColor(this.props.lineColor)}
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
                        {this.firstDate}
                    </Text>
                    <Text
                        key={`text_last`}
                        x={this.state.layoutWidth - 35}
                        y={this.props.graph_height + 15}
                        fontSize="12"
                        textAnchor="middle"
                        fill="rgba(150,150,150,1)"
                    >
                        {this.lastDate}
                    </Text>
                </Svg>
            </View>
        );
    }
}


export default LineChartSvg;

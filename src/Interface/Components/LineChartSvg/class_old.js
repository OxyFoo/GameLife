import React, { useState, useRef } from 'react';
import { View, Text as RNText } from 'react-native';
import { Svg, Polyline, Line, Text } from 'react-native-svg';


const getYAxisValues = (maxValue) => {
    // Create 5 values for Y axis (0, max, and 3 intermediaries)
    const step = maxValue / 4;
    return [0, step, 2 * step, 3 * step, maxValue];
};

const Graph = ({ data, graph_height }) => {
    const [layoutWidth, setLayoutWidth] = useState(0);
    const svgRef = useRef();

    const left_margin = 40;

    const maxValue = Math.max(...data.map(d => d.value)) * 1.05; // Increase max value for padding
    const scaleY = (value) => (value / maxValue) * (graph_height - 20);

    // Calculate the x-coordinate in pixels based on layoutWidth
    const getXCoordinate = (index, arrayLength) => {
        const spacing = (layoutWidth - left_margin*1.1) / (arrayLength - 1);
        return left_margin + (index * spacing);
    };

    // Construct the points for polyline
    const points = data.map((item, index) => {
        const x = getXCoordinate(index, data.length); // Get the x-coordinate in pixels
        const y = graph_height - scaleY(item.value);  // Calculate the y-coordinate
        return `${x},${y}`; // Return the coordinate pair
    }).join(' ');

    const yAxisValues = getYAxisValues(maxValue);

    return (
        <View style={{ width: "100%", backgroundColor: "purple", padding: 25 }}>

            <View style={{ backgroundColor: "#232B5D", paddingTop: 10, paddingLeft: 15, paddingRight: 20, borderRadius: 20 }}>
                <Svg
                    height={graph_height + 40}
                    width={"100%"}
                    ref={svgRef}
                    onLayout={() => {
                        // Measure the width of the SVG after layout
                        svgRef.current.measure((x, y, width, height) => {
                            setLayoutWidth(width);
                        });
                    }}>

                    {/* Y-axis lines and labels */}
                    {yAxisValues.map((value, index) => (
                        <React.Fragment key={`yaxis_line_${index}`}>
                            <Line
                                x1={left_margin}
                                y1={graph_height - scaleY(value)}
                                x2={layoutWidth}
                                y2={graph_height - scaleY(value)}
                                stroke="rgba(100,100,100,0.4)"
                            />
                            <Text
                                x={0}
                                y={graph_height - scaleY(value)}
                                fontSize="14"
                                fill='rgba(150,150,150,1)'
                                alignmentBaseline="middle"
                            >
                                {value.toFixed(0)}
                            </Text>
                        </React.Fragment>
                    ))}

                    {/* Line chart */}
                    {layoutWidth ?
                        <Polyline
                            points={points}
                            fill="none"
                            stroke="#006DFF"
                            strokeWidth="2"
                        />
                        : <></>}

                    {/* Date labels for first and last data points */}
                    <Text
                        key={`text_first`}
                        x={60}
                        y={graph_height + 15}
                        fontSize="12"
                        textAnchor="middle"
                        fill="rgba(150,150,150,1)"
                    >
                        {data[0].date}
                    </Text>
                    <Text
                        key={`text_last`}
                        x={layoutWidth - 35}
                        y={graph_height + 15}
                        fontSize="12"
                        textAnchor="middle"
                        fill="rgba(150,150,150,1)"
                    >
                        {data[data.length - 1].date}
                    </Text>
                </Svg>
            </View>

        </View>
    );
};

export default Graph;
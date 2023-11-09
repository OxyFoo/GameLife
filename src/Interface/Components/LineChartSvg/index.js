import React from 'react';
import { View, Dimensions, Text as RNText } from 'react-native';
import { Svg, Polyline, Line, Circle, Text } from 'react-native-svg';

const { width } = Dimensions.get('window');
const GRAPH_MARGIN = 20;
const GRAPH_TOP_PADDING = 20; // Additional padding for the top of the graph
const GRAPH_HEIGHT = 200;
const LEFT_MARGIN = 40; // Increased left margin for Y-axis values
const GRAPH_WIDTH = width - GRAPH_MARGIN * 2 - LEFT_MARGIN; // Adjust graph width accordingly

const formatDate = (dateString) => {
    const [day, month] = dateString.split('/');
    return `${day}/${month}`;
};

const getYAxisValues = (maxValue) => {
    // Create 5 values for Y axis (0, max, and 3 intermediaries)
    const step = maxValue / 4;
    return [0, step, 2 * step, 3 * step, maxValue];
};

const Graph = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // Increase max value for padding
    const scaleY = (value) => (value / maxValue) * (GRAPH_HEIGHT - GRAPH_TOP_PADDING);
    const stepX = GRAPH_WIDTH / (data.length - 1);

    const yAxisValues = getYAxisValues(maxValue);

    // Construct the points for polyline, adding LEFT_MARGIN to x-coordinate
    const points = data.map((item, index) =>
        `${LEFT_MARGIN + stepX * index},${GRAPH_HEIGHT - scaleY(item.value)}`
    ).join(' ');

    return (
        <View style={{ margin: GRAPH_MARGIN }}>
            <Svg height={GRAPH_HEIGHT + GRAPH_MARGIN * 2} width={width}>
                {/* Y-axis lines and labels */}
                {yAxisValues.map((value, index) => (
                    <React.Fragment key={`yaxis_line_${index}`}>
                        <Line
                            x1={LEFT_MARGIN}
                            y1={GRAPH_HEIGHT - scaleY(value)}
                            x2={width - GRAPH_MARGIN}
                            y2={GRAPH_HEIGHT - scaleY(value)}
                            stroke="#ccc"
                        />
                        <Text
                            x={LEFT_MARGIN / 2}
                            y={GRAPH_HEIGHT - scaleY(value)}
                            fontSize="10"
                            fill="black"
                            alignmentBaseline="middle"
                        >
                            {value.toFixed(0)}
                        </Text>
                    </React.Fragment>
                ))}
                {/* Line chart */}
                <Polyline
                    points={points}
                    fill="none"
                    stroke="blue"
                    strokeWidth="2"
                />
                {/* Points */}
                {data.map((item, index) => (
                    <Circle
                        key={`circle_${index}`}
                        cx={LEFT_MARGIN + stepX * index}
                        cy={GRAPH_HEIGHT - scaleY(item.value)}
                        r="0"
                        fill="blue"
                    />
                ))}
                {/* Date labels for first and last data points */}
                <Text
                    key={`text_first`}
                    x={LEFT_MARGIN}
                    y={GRAPH_HEIGHT + 15}
                    fontSize="10"
                    textAnchor="middle"
                    fill="black"
                >
                    {formatDate(data[0].date)}
                </Text>
                <Text
                    key={`text_last`}
                    x={width - GRAPH_MARGIN * 2}
                    y={GRAPH_HEIGHT + 15}
                    fontSize="10"
                    textAnchor="middle"
                    fill="black"
                >
                    {formatDate(data[data.length - 1].date)}
                </Text>
            </Svg>
        </View>
    );
};

export default Graph;

import React from 'react';
import { View, Animated } from 'react-native';
import { Svg, Polygon, Line, G, Text as SvgText } from 'react-native-svg';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

import { SpringAnimation } from 'Utils/Animations';

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 *
 * @typedef {Object} RadarDataItem
 * @property {string} label - Label of the axis
 * @property {number} value - Value of the axis (0-1)
 *
 * @typedef {Object} RadarChartProps
 * @property {RadarDataItem[]} data - Array of data for the radar chart (6 axes)
 * @property {number} [size] - Size of the radar chart in pixels
 * @property {StyleViewProp} [style] - Container styles
 * @property {boolean} [showLabels] - Show labels on axes
 * @property {number} [levels] - Number of concentric hexagons
 * @property {number} [basePadding] - Base padding around the chart
 */

/**
 * @type {RadarChartProps}
 */
const RadarChartProps = {
    data: [],
    size: 140,
    style: {},
    showLabels: false,
    levels: 4
};

/**
 * Generate hexagon points for a given radius
 * @param {number} cx - Center X
 * @param {number} cy - Center Y
 * @param {number} radius - Radius of the hexagon
 * @returns {string} - Points string for SVG Polygon
 */
function getHexagonPoints(cx, cy, radius) {
    const points = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        points.push(`${x},${y}`);
    }
    return points.join(' ');
}

/**
 * Radar Chart component (hexagon shape) for stats visualization
 * @param {RadarChartProps} props
 */
function RadarChart({ data, size = 140, style, showLabels = false, levels = 4, basePadding = 10 } = RadarChartProps) {
    const animValue = React.useRef(new Animated.Value(showLabels ? 1 : 0)).current;
    const [padding, setPadding] = React.useState(showLabels ? basePadding + 20 : basePadding);

    const labelOpacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    React.useEffect(() => {
        const listenerId = animValue.addListener(({ value }) => {
            setPadding(basePadding + value * 20);
        });

        SpringAnimation(animValue, showLabels ? 1 : 0, true).start();

        return () => {
            animValue.removeListener(listenerId);
        };
    }, [showLabels, animValue, basePadding]);

    const center = size / 2;
    const maxRadius = center - padding;

    const gridColor = themeManager.GetColor('border', { opacity: 0.3 });
    const axisColor = themeManager.GetColor('border', { opacity: 0.2 });
    const dataFillColor = themeManager.GetColor('main1', { opacity: 0.4 });
    const dataStrokeColor = themeManager.GetColor('main1');
    const labelColor = themeManager.GetColor('secondary');

    // Generate data points
    const dataPoints = data
        .map((item, i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const r = maxRadius * Math.min(1, Math.max(0, item.value));
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        })
        .join(' ');

    // Generate label positions
    const labelPositions = data.map((item, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const labelRadius = maxRadius + 15;
        return {
            x: center + labelRadius * Math.cos(angle),
            y: center + labelRadius * Math.sin(angle),
            label: item.label
        };
    });

    return (
        <View style={[{ width: size, height: size }, styles.container, style]}>
            <Svg width={size} height={size}>
                <G>
                    {/* Concentric hexagon grid */}
                    {Array.from({ length: levels }, (_, i) => {
                        const levelRadius = maxRadius * ((i + 1) / levels);
                        return (
                            <Polygon
                                key={`level-${i}`}
                                points={getHexagonPoints(center, center, levelRadius)}
                                fill='none'
                                stroke={gridColor}
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Axis lines from center to vertices */}
                    {Array.from({ length: 6 }, (_, i) => {
                        const angle = (Math.PI / 3) * i - Math.PI / 2;
                        const x2 = center + maxRadius * Math.cos(angle);
                        const y2 = center + maxRadius * Math.sin(angle);
                        return (
                            <Line
                                key={`axis-${i}`}
                                x1={center}
                                y1={center}
                                x2={x2}
                                y2={y2}
                                stroke={axisColor}
                                strokeWidth={1}
                            />
                        );
                    })}

                    {/* Data polygon */}
                    {data.length === 6 && (
                        <Polygon points={dataPoints} fill={dataFillColor} stroke={dataStrokeColor} strokeWidth={2} />
                    )}

                    {/* Labels */}
                    {labelPositions.map((pos, i) => (
                        <AnimatedSvgText
                            key={`label-${i}`}
                            x={pos.x}
                            y={pos.y}
                            fill={labelColor}
                            fontSize={10}
                            textAnchor='middle'
                            alignmentBaseline='middle'
                            opacity={labelOpacity}
                        >
                            {pos.label}
                        </AnimatedSvgText>
                    ))}
                </G>
            </Svg>
        </View>
    );
}

export { RadarChart };

import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

import styles from './style';

/**
 * @typedef {Object} DonutDataItem
 * @property {string} label - Label of the segment
 * @property {number} value - Value of the segment
 * @property {string} stroke - Color of the segment
 * @property {Object} [style] - Additional SVG styles
 */

/**
 * @typedef {Object} DonutChartProps
 * @property {DonutDataItem[]} data - Array of data for the donut chart
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {number} [strokeWidth] - Width of the donut stroke
 * @property {'round' | 'square' | 'butt'} [strokeLinecap] - Line cap style
 * @property {Object} [style] - Container styles
 * @property {(value: number) => number} [easing] - Easing function for animation
 * @property {Function} [onMeasure] - Callback with graph dimensions
 * @property {React.ReactNode} [children] - Content to display in center
 * @property {number} [segmentGap] - Gap between segments in degrees
 * @property {number} [size] - Size of the donut chart in pixels
 */

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Custom DonutChart component with animation support and light diffusion
 * @param {DonutChartProps} props
 */
function DonutChart({
    data,
    delay = 0,
    duration = 1500,
    strokeWidth = 8,
    strokeLinecap = 'round',
    style,
    easing = Easing.out(Easing.exp),
    onMeasure,
    children,
    segmentGap = 4, // Gap between segments in degrees
    size = 100 // Allow size to be configurable
}) {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;

    // Animation values for each segment - recreate when component mounts
    /** @type {Animated.Value[]} */
    const animationValues = useRef(data.map(() => new Animated.Value(0))).current;

    // Ensure we have the right number of animation values and reset them when data changes
    useEffect(() => {
        // Reset all animation values to 0 first
        animationValues.forEach((animValue) => animValue.setValue(0));
        
        // Adjust animation values array to match data length
        while (animationValues.length < data.length) {
            animationValues.push(new Animated.Value(0));
        }
        while (animationValues.length > data.length) {
            animationValues.pop();
        }
    }, [animationValues, data.length]);

    // Calculate total value
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    useEffect(() => {
        // Start animations with delay
        const animations = animationValues.map((animValue, index) =>
            Animated.timing(animValue, {
                toValue: 1,
                duration,
                delay: delay + index * 100, // Stagger each segment slightly
                easing,
                useNativeDriver: false
            })
        );

        // Cancel any existing animations before starting new ones
        animationValues.forEach((animValue) => animValue.stopAnimation());
        
        Animated.parallel(animations).start();
    }, [animationValues, data, delay, duration, easing]);

    useEffect(() => {
        if (onMeasure) {
            onMeasure(size);
        }
    }, [size, onMeasure]);

    // Create path segments with gaps
    let currentAngle = -90; // Start from top
    const totalGaps = data.length * segmentGap;
    const availableAngle = 360 - totalGaps;

    const segments = data.map((item, index) => {
        const percentage = item.value / totalValue;
        const angle = percentage * availableAngle;

        const startAngleRad = (currentAngle * Math.PI) / 180;
        const endAngleRad = ((currentAngle + angle) * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startAngleRad);
        const y1 = center + radius * Math.sin(startAngleRad);
        const x2 = center + radius * Math.cos(endAngleRad);
        const y2 = center + radius * Math.sin(endAngleRad);

        const largeArcFlag = angle > 180 ? 1 : 0;

        const pathData = [`M ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`].join(' ');

        // Calculate the path length for this specific segment
        const segmentCircumference = (angle / 360) * (2 * Math.PI * radius);

        currentAngle += angle + segmentGap; // Add gap after each segment

        return {
            path: pathData,
            stroke: item.stroke,
            label: item.label,
            value: item.value,
            percentage: Math.round(percentage * 100),
            style: item.style || {},
            animationValue: animationValues[index],
            segmentCircumference
        };
    });

    return (
        <View style={[{ width: size, height: size }, styles.parent, style]}>
            <Svg width={size} height={size}>
                <G>
                    {segments.map((segment, index) => {
                        // Safety check for animation value
                        if (!segment.animationValue) {
                            return null;
                        }

                        return (
                            <AnimatedPath
                                key={`segment-${index}`}
                                d={segment.path}
                                stroke={segment.stroke}
                                strokeWidth={strokeWidth}
                                strokeLinecap={strokeLinecap}
                                fill='transparent'
                                strokeDasharray={segment.segmentCircumference}
                                strokeDashoffset={segment.animationValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [segment.segmentCircumference, 0]
                                })}
                                {...segment.style}
                            />
                        );
                    })}
                </G>
            </Svg>

            {/* Center content */}
            {children && <View style={styles.content}>{children}</View>}
        </View>
    );
}

export { DonutChart };

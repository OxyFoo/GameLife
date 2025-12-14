import React from 'react';
import { View } from 'react-native';
import { Svg, G } from 'react-native-svg';

import styles from './style';
import { DonutSegment } from './segment';

import { Sum } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native-svg').PathProps} PathProps
 */

/**
 * @typedef {Object} DonutDataItem
 * @property {string} label - Label of the segment
 * @property {number} value - Value of the segment
 * @property {string} stroke - Color of the segment
 * @property {PathProps} [style] - Additional SVG styles
 */

/**
 * @typedef {Object} DonutChartProps
 * @property {DonutDataItem[]} data - Array of data for the donut chart
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {number} [strokeWidth] - Width of the donut stroke
 * @property {'round' | 'square' | 'butt'} [strokeLinecap] - Line cap style
 * @property {StyleViewProp} [style] - Container styles
 * @property {React.ReactNode} [children] - Content to display in center
 * @property {number} [segmentGap] - Gap between segments in degrees
 * @property {number} [size] - Size of the donut chart in pixels
 */

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
    children,
    segmentGap = 4, // Gap between segments in degrees
    size = 100 // Allow size to be configurable
}) {
    // Calculate total value of hour segments
    const values = data.map((item) => item.value);
    const totalValue = Sum(values);

    // No data to display
    if (values.length === 0 || totalValue <= 0) {
        return null;
    }

    // Create path segments with gaps
    let currentAngle = -90; // Start from top
    const totalGaps = data.length * segmentGap;
    const availableAngle = 360 - totalGaps;

    return (
        <View style={[{ width: size, height: size }, styles.parent, style]}>
            <Svg width={size} height={size}>
                <G>
                    {/** Segments */}
                    {data.map((item, index) => {
                        const percentage = item.value / totalValue;

                        // Calculate cumulative angle for this segment
                        const angle = percentage * availableAngle;
                        const segmentStartAngle = currentAngle; // Store start angle before updating
                        currentAngle += angle + segmentGap; // Add gap after each segment

                        return (
                            <DonutSegment
                                key={item.label}
                                index={index}
                                item={item}
                                size={size}
                                totalValue={totalValue}
                                strokeWidth={strokeWidth}
                                currentAngle={segmentStartAngle}
                                strokeLinecap={strokeLinecap}
                                availableAngle={availableAngle}
                                delay={delay}
                                duration={duration}
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

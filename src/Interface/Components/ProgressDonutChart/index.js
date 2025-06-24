import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

import styles from './style';

import { Svg, Circle, G } from 'react-native-svg';

/**
 * @typedef {Object} ProgressDonutChartProps
 * @property {number} current - Current progress value
 * @property {number} goal - Goal/target value
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {number} [strokeWidth] - Width of the donut stroke
 * @property {'round' | 'square' | 'butt'} [strokeLinecap] - Line cap style
 * @property {Object} [style] - Container styles
 * @property {(value: number) => number} [easing] - Easing function for animation
 * @property {Function} [onMeasure] - Callback with graph dimensions
 * @property {React.ReactNode} [children] - Content to display in center
 * @property {number} [size] - Size of the donut chart in pixels
 * @property {string} [progressColor] - Color of the progress segment
 * @property {string} [backgroundTrackColor] - Color of the background track
 */

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Progress DonutChart component with animation support
 * @param {ProgressDonutChartProps} props
 */
function ProgressDonutChart({
    current,
    goal,
    delay = 0,
    duration = 1500,
    strokeWidth = 8,
    strokeLinecap = 'round',
    style,
    easing = Easing.out(Easing.exp),
    onMeasure,
    children,
    size = 110,
    progressColor = '#4CAF50',
    backgroundTrackColor = '#E0E0E050'
}) {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    // Animation value for progress
    const animationValue = useRef(new Animated.Value(0)).current;

    // Calculate progress percentage (0-1)
    const progressPercentage = goal > 0 ? Math.min(current / goal, 1) : 0;

    useEffect(() => {
        // Reset and start animation
        animationValue.setValue(0);

        Animated.timing(animationValue, {
            toValue: progressPercentage,
            duration,
            delay,
            easing,
            useNativeDriver: false
        }).start();
    }, [animationValue, progressPercentage, delay, duration, easing]);

    useEffect(() => {
        if (onMeasure) {
            onMeasure(size);
        }
    }, [size, onMeasure]);

    return (
        <View style={[{ width: size, height: size }, styles.parent, style]}>
            <Svg width={size} height={size}>
                <G>
                    {/* Background track */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={backgroundTrackColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap={strokeLinecap}
                        fill='transparent'
                    />

                    {/* Progress */}
                    <AnimatedCircle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap={strokeLinecap}
                        fill='transparent'
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={animationValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [circumference, 0]
                        })}
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                </G>
            </Svg>

            {/* Center content */}
            {children && <View style={styles.content}>{children}</View>}
        </View>
    );
}

export { ProgressDonutChart };

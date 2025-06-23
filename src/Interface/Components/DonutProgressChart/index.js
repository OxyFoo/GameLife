import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

// Styles inline pour éviter le problème d'import
const styles = {
    parent: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none'
    }
};

/**
 * @typedef {Object} DonutProgressChartProps
 * @property {number} current - Current progress value
 * @property {number} goal - Goal value to reach
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {number} [strokeWidth] - Width of the donut stroke
 * @property {'round' | 'square' | 'butt'} [strokeLinecap] - Line cap style
 * @property {Object} [style] - Container styles
 * @property {(value: number) => number} [easing] - Easing function for animation
 * @property {React.ReactNode} [children] - Content to display in center
 * @property {number} [size] - Size of the donut chart in pixels
 * @property {string} [progressColor] - Color for the progress arc
 * @property {string} [backgroundColor] - Color for the background circle
 */

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * DonutProgressChart component - A circular progress indicator
 * Shows progress as a fraction of a complete circle, always starting from top (12 o'clock)
 * @param {DonutProgressChartProps} props
 */
function DonutProgressChart({
    current = 0,
    goal = 100,
    delay = 0,
    duration = 1500,
    strokeWidth = 8,
    strokeLinecap = 'round',
    style,
    easing = Easing.out(Easing.exp),
    children,
    size = 100,
    progressColor = '#007AFF',
    backgroundColor = '#E0E0E0'
}) {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    // Animation value for progress
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Reset and start animation
        animationValue.setValue(0);

        Animated.timing(animationValue, {
            toValue: 1,
            duration,
            delay,
            easing,
            useNativeDriver: false
        }).start();
    }, [current, goal, delay, duration, easing, animationValue]);

    // Calculate progress ratio (0 to 1, capped at 1)
    const progressRatio = goal > 0 ? Math.min(current / goal, 1) : 0;

    // Create background circle path (full circle)
    const backgroundPath = `M ${center} ${center - radius} 
                           A ${radius} ${radius} 0 1 1 ${center - 0.001} ${center - radius}`;

    // Create progress arc path - simple full circle for strokeDasharray animation
    const progressPath = `M ${center} ${center - radius} 
                         A ${radius} ${radius} 0 1 1 ${center - 0.001} ${center - radius}`;

    return (
        <View style={[{ width: size, height: size }, styles.parent, style]}>
            <Svg width={size} height={size}>
                <G>
                    {/* Background circle - always visible */}
                    <Path
                        d={backgroundPath}
                        stroke={backgroundColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap={strokeLinecap}
                        fill='transparent'
                        opacity={0.3}
                    />

                    {/* Progress arc - only visible if there's progress */}
                    {progressRatio > 0 && (
                        <AnimatedPath
                            d={progressPath}
                            stroke={progressColor}
                            strokeWidth={strokeWidth}
                            strokeLinecap={strokeLinecap}
                            fill='transparent'
                            strokeDasharray={circumference}
                            strokeDashoffset={animationValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [circumference, circumference * (1 - progressRatio)]
                            })}
                            transform={`rotate(0 ${center} ${center})`}
                        />
                    )}
                </G>
            </Svg>

            {/* Center content */}
            {children && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    {children}
                </View>
            )}
        </View>
    );
}

export { DonutProgressChart };

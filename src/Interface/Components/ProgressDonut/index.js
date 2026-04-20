import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';

import styles from './style';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @typedef {Object} ProgressDonutChartProps
 * @property {number} value - Progress value [0-1]
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {number} [strokeWidth] - Width of the donut stroke
 * @property {'round' | 'square' | 'butt'} [strokeLinecap] - Line cap style
 * @property {Object} [style] - Container styles
 * @property {((value: number) => number) | null} [easing] - Easing function for animation
 * @property {Function} [onMeasure] - Callback with graph dimensions
 * @property {React.ReactNode} [children] - Content to display in center
 * @property {number} [size] - Size of the donut chart in pixels
 * @property {ThemeColor} [progressColor] - Color of the progress segment
 * @property {ThemeColor} [backgroundTrackColor] - Color of the background track
 * @property {number} [backgroundTrackColorTransparency] - Transparency of the background track [0-1]
 */

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Progress DonutChart component with animation support
 * @param {ProgressDonutChartProps} props
 */
function ProgressDonut({
    value,
    delay = 0,
    duration = 1500,
    strokeWidth = 8,
    strokeLinecap = 'round',
    style,
    easing = null,
    children,
    size = 110,
    progressColor = 'success',
    backgroundTrackColor = 'borderLight',
    backgroundTrackColorTransparency = 0.3
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
            toValue: value,
            duration,
            delay,
            easing: easing ?? Easing.out(Easing.exp),
            useNativeDriver: false
        }).start();
    }, [animationValue, value, delay, duration, easing]);

    return (
        <View style={[{ width: size, height: size }, styles.parent, style]}>
            <Svg width={size} height={size}>
                <G>
                    {/* Background track */}
                    <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={themeManager.GetColor(backgroundTrackColor, {
                            opacity: backgroundTrackColorTransparency
                        })}
                        strokeWidth={strokeWidth}
                        strokeLinecap={strokeLinecap}
                        fill='transparent'
                    />

                    {/* Progress */}
                    <AnimatedCircle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={themeManager.GetColor(progressColor)}
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

export { ProgressDonut };

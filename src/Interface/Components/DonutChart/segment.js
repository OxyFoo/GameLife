import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * @typedef {import('./index').DonutDataItem} DonutDataItem
 */

/**
 * @typedef {Object} DonutSegmentProps
 * @property {DonutDataItem} item - Data item for the segment
 * @property {number} totalValue - Total value of all segments
 * @property {number} availableAngle - Total angle available for segments
 * @property {number} size - Size of the donut chart
 * @property {number} strokeWidth - Width of the donut stroke
 * @property {'round' | 'square' | 'butt'} strokeLinecap - Line cap style
 * @property {number} currentAngle - Current angle for the segment
 * @property {number} [delay] - Animation delay in milliseconds
 * @property {number} [duration] - Animation duration in milliseconds
 * @property {((value: number) => number) | null} [easing] - Easing function for animation
 * @property {number} [index] - Index of the segment for staggered animation
 */

/**
 * Generates the SVG path for a donut segment
 * @param {DonutSegmentProps} props
 * @return {JSX.Element} Returns a JSX element representing the donut segment
 */
function DonutSegment({
    item,
    totalValue,
    availableAngle,
    size,
    strokeWidth,
    currentAngle,
    strokeLinecap,
    delay = 0,
    duration = 1500,
    easing = null,
    index = 0
}) {
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Reset animation value
        animationValue.setValue(0);

        // Start animation with staggered delay
        const animation = Animated.timing(animationValue, {
            toValue: 1,
            duration,
            delay: delay + index * 100, // Stagger each segment slightly
            easing: easing ?? Easing.out(Easing.exp),
            useNativeDriver: false
        });

        // Cancel any existing animation before starting new one
        animationValue.stopAnimation();
        animation.start();

        // Cleanup function
        return () => {
            animationValue.stopAnimation();
        };
    }, [animationValue, delay, duration, easing, index]);

    const radius = (size - strokeWidth) / 2;
    const center = size / 2;

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

    return (
        <AnimatedPath
            d={pathData}
            stroke={item.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            fill='transparent'
            strokeDasharray={segmentCircumference}
            strokeDashoffset={animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [segmentCircumference, 0]
            })}
            {...item.style}
        />
    );
}

export { DonutSegment };

import * as React from 'react';
import { Animated, View } from 'react-native';
import { Svg, Path } from 'react-native-svg';

import themeManager from 'Managers/ThemeManager';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @param {object} props
 * @param {StyleProp} [props.style]
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {number | Animated.Value} [props.percentage]
 * @param {number} [props.strokeWidth]
 * @param {number} [props.borderRadius]
 * @param {ThemeColor | ThemeText} [props.color]
 * @returns {JSX.Element}
 */
const AnimBorder = ({
    style = {},
    width = 100,
    height = 200,
    percentage = 100,
    strokeWidth = 2,
    borderRadius = 8,
    color = 'main1'
}) => {
    const rectWidth = width - strokeWidth;
    const rectHeight = height - strokeWidth;
    const x = strokeWidth / 2;
    const y = strokeWidth / 2;
    const squareFill = themeManager.GetColor(color);

    const perimeterSides = 2 * (rectWidth + rectHeight - 4 * borderRadius);
    const perimeterCorners = 2 * Math.PI * borderRadius;
    const perimeter = perimeterSides + perimeterCorners;

    const fillLength =
        typeof percentage === 'number'
            ? percentage * ((perimeter * 100) / 99)
            : Animated.multiply(percentage, (perimeter * 100) / 99);

    const pathData = `
        M ${x + rectWidth / 2 - 2 /* -2 is a correction for the "ptit quiqui" */} ${y}
        L ${x + rectWidth - borderRadius} ${y}
        Q ${x + rectWidth} ${y} ${x + rectWidth} ${y + borderRadius}
        L ${x + rectWidth} ${y + rectHeight - borderRadius}
        Q ${x + rectWidth} ${y + rectHeight} ${x + rectWidth - borderRadius} ${y + rectHeight}
        L ${x + borderRadius} ${y + rectHeight}
        Q ${x} ${y + rectHeight} ${x} ${y + rectHeight - borderRadius}
        L ${x} ${y + borderRadius}
        Q ${x} ${y} ${x + borderRadius} ${y}
        Z
    `;

    return (
        <View style={[{ width, height }, style]}>
            <Svg width={width} height={height}>
                <AnimatedPath
                    d={pathData}
                    fill='transparent'
                    stroke={squareFill}
                    strokeWidth={strokeWidth}
                    strokeDasharray={[fillLength, perimeter]}
                    clipRule='evenodd'
                    strokeLinecap='butt'
                />
            </Svg>
        </View>
    );
};

export default AnimBorder;

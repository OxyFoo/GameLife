import * as React from 'react';
import { View } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { Circle, Svg } from 'react-native-svg';

/**
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @param {object} props
 * @param {number} [props.percentage]
 * @param {number} [props.size]
 * @param {number} [props.margin]
 * @param {number} [props.circleStrokeWidth]
 * @param {ThemeColor} [props.color]
 * @returns {JSX.Element}
 */
const FilledCircle = ({ percentage = 100, size = 32, margin = 6, circleStrokeWidth = 2, color = 'main1' }) => {
    const containerSize = size + margin * 2 + circleStrokeWidth * 2;

    const circleSize = size - circleStrokeWidth;
    const circleRadius = circleSize / 2;
    const cx = circleRadius + margin + circleStrokeWidth;
    const cy = circleRadius + margin + circleStrokeWidth;
    const circleFillPercentage = (percentage / 100) * (2 * Math.PI * circleRadius);
    const circleFill = themeManager.GetColor(color);

    const diskSize = circleSize / 2 - margin / 2 - 3;
    const diskRadius = diskSize / 2;
    const cx2 = diskRadius + margin + (circleSize - diskSize) / 2 + circleStrokeWidth;
    const cy2 = diskRadius + margin + (circleSize - diskSize) / 2 + circleStrokeWidth;
    const diskStrokeWidth = diskSize;
    const diskFillPercentage = (percentage / 100) * (2 * Math.PI * diskRadius);
    const diskFill = themeManager.GetColor(color, { opacity: .4 });

    return (
        <View style={{ width: containerSize, height: containerSize, marginTop: -circleStrokeWidth, marginLeft: -circleStrokeWidth-1, overflow: 'visible' }}>
            <Svg width={containerSize} height={containerSize}>
                <Circle
                    rotation={-90}
                    origin={[cx + 1, cy + 1]}
                    cx={cx}
                    cy={cy}
                    r={circleRadius}
                    fill='transparent'
                    stroke={circleFill}
                    strokeWidth={circleStrokeWidth}
                    strokeDasharray={[circleFillPercentage, 2 * Math.PI * circleRadius]}
                    clipRule='evenodd'
                    strokeLinecap='butt'
                />
                <Circle
                    rotation={-90}
                    origin={[cx2 + 1, cy2 + 1]}
                    cx={cx2}
                    cy={cy2}
                    r={diskRadius}
                    fill='transparent'
                    stroke={diskFill}
                    strokeWidth={diskStrokeWidth}
                    strokeDasharray={[diskFillPercentage, 2 * Math.PI * diskRadius]}
                    clipRule='evenodd'
                    strokeLinecap='butt'
                />
            </Svg>
        </View>
    );
};

export default FilledCircle;

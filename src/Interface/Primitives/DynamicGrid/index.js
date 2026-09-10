import React from 'react';
import { View, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';
import { Defs, G, Line, Mask, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @description Faded grid background for FlowEngine.
 * Vertical lines are tinted with `color1`, horizontal lines with `color2`.
 * A radial mask keeps the grid crisp near the top and fades it toward the edges.
 * @param {object} props
 * @param {StyleProp} [props.style]
 * @param {number} [props.spacing] Space between lines in px, default: 30
 * @param {number} [props.opacity] Line opacity between 0 and 1, default: 0.09
 * @param {ThemeColor} [props.color1] Vertical lines color, default: 'main1'
 * @param {ThemeColor} [props.color2] Horizontal lines color, default: 'main2'
 * @param {ViewStyle['backgroundColor']} [props.backgroundColor] Background color, default: 'transparent'
 * @returns {React.ReactNode | null}
 */
function DynamicGrid({
    style,
    spacing = 30,
    opacity = 0.07,
    color1 = 'main1',
    color2 = 'main2',
    backgroundColor = 'transparent'
}) {
    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    const { width, height } = layout;

    const verticalLines = [];
    const horizontalLines = [];
    if (width > 0 && height > 0 && spacing > 0) {
        for (let x = spacing; x < width; x += spacing) {
            verticalLines.push(x);
        }
        for (let y = spacing; y < height; y += spacing) {
            horizontalLines.push(y);
        }
    }

    return (
        <View
            style={[styles.parent, { backgroundColor }, style]}
            onLayout={(e) => setLayout(e.nativeEvent.layout)}
            pointerEvents='none'
        >
            {width > 0 && height > 0 && (
                <Svg width={width} height={height}>
                    <Defs>
                        {/* Crisp near the top-center, fading out toward the edges/bottom */}
                        <RadialGradient id='gridMaskGrad' cx='50%' cy='22%' rx='100%' ry='95%' fx='50%' fy='22%'>
                            <Stop offset='0%' stopColor='#fff' stopOpacity='1' />
                            <Stop offset='55%' stopColor='#fff' stopOpacity='1' />
                            <Stop offset='100%' stopColor='#fff' stopOpacity='0' />
                        </RadialGradient>
                        <Mask id='gridMask'>
                            <Rect x='0' y='0' width={width} height={height} fill='url(#gridMaskGrad)' />
                        </Mask>
                    </Defs>

                    <G mask='url(#gridMask)'>
                        {verticalLines.map((x) => (
                            <Line
                                key={`v-${x}`}
                                x1={x}
                                y1={0}
                                x2={x}
                                y2={height}
                                stroke={themeManager.GetColor(color1)}
                                strokeWidth={1}
                                strokeOpacity={opacity}
                            />
                        ))}
                        {horizontalLines.map((y) => (
                            <Line
                                key={`h-${y}`}
                                x1={0}
                                y1={y}
                                x2={width}
                                y2={y}
                                stroke={themeManager.GetColor(color2)}
                                strokeWidth={1}
                                strokeOpacity={opacity}
                            />
                        ))}
                    </G>
                </Svg>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
    }
});

export { DynamicGrid };

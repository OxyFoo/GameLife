import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Radial } from './radial';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const PATH1 = [
    { x: 0, y: 0 },
    { x: 1, y: 0.5 },
    { x: 0, y: 0.5 },
    { x: 1, y: 0 },
    { x: 0, y: 0 }
];
const PATH2 = [
    { x: 1, y: 0.5 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0.5, y: 1 },
    { x: 0, y: 0.5 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0.5 }
];

/**
 * @description Radial background for FlowEngine
 * @param {object} props
 * @param {StyleProp} [props.style]
 * @param {number} [props.opacity] Between 0 and 1, default: 0.2
 * @param {ViewStyle['backgroundColor']} [props.backgroundColor] Color of the radial background
 * @returns {JSX.Element | null}
 */
function DynamicBackground({ style, opacity = 0.2, backgroundColor = '#000000' }) {
    const [layout, setLayout] = React.useState({ width: 0, height: 0 });

    return (
        <View
            style={[styles.parent, { backgroundColor }, style]}
            onLayout={(e) => setLayout(e.nativeEvent.layout)}
            pointerEvents='none'
        >
            <Radial
                color='main1'
                animPath={PATH1}
                size={{ width: layout.width, height: layout.height }}
                opacity={opacity}
                duration={30000}
            />
            <Radial
                color='main2'
                animPath={PATH2}
                size={{ width: layout.width, height: layout.height }}
                opacity={opacity}
                duration={30000}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: '100%'
    }
});

export { DynamicBackground, Radial };

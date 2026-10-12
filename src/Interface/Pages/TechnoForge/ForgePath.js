import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import { CATALYST_SIZE, CATALYSTS_GAP, CONNECTOR_HEIGHT } from './style';

/**
 * The inverted Y between the catalysts and the main slot: two branches up from the catalysts, a bar,
 * and a stem up to the main slot. A lit copy of the path grows over the grey one as `progress` goes
 * from 0 to 1: the branches first (bottom to top), then the bar from both ends to the centre, then
 * the stem. Only transforms, so everything runs on the native driver.
 * @param {object} props
 * @param {Animated.Value} props.progress 0 = dark, 1 = lit up to the main slot
 * @param {string} props.lineColor The path at rest
 * @param {string} props.litColor The path once the catalysts flow through it
 */
function ForgePath({ progress, lineColor, litColor }) {
    const width = CATALYST_SIZE + CATALYSTS_GAP;
    const half = width / 2;

    // Three segments of the same value, each clamped to its own window
    const branches = progress.interpolate({ inputRange: [0, 0.35], outputRange: [0, 1], extrapolate: 'clamp' });
    const bar = progress.interpolate({ inputRange: [0.35, 0.7], outputRange: [0, 1], extrapolate: 'clamp' });
    const stem = progress.interpolate({ inputRange: [0.7, 1], outputRange: [0, 1], extrapolate: 'clamp' });

    /** A vertical line growing from its bottom: scaled around its centre, then pushed down by the missing half */
    const growUp = (/** @type {Animated.AnimatedInterpolation<number>} */ segment) => ({
        transform: [
            { translateY: segment.interpolate({ inputRange: [0, 1], outputRange: [CONNECTOR_HEIGHT / 2, 0] }) },
            { scaleY: segment.interpolate({ inputRange: [0, 1], outputRange: [0.001, 1] }) }
        ]
    });
    /** A half bar growing from one end towards the centre (sign = which end it starts from) */
    const growIn = (/** @type {Animated.AnimatedInterpolation<number>} */ segment, /** @type {number} */ sign) => ({
        transform: [
            { translateX: segment.interpolate({ inputRange: [0, 1], outputRange: [(sign * half) / 2, 0] }) },
            { scaleX: segment.interpolate({ inputRange: [0, 1], outputRange: [0.001, 1] }) }
        ]
    });

    const dark = { backgroundColor: lineColor };
    const lit = { backgroundColor: litColor };

    /** A vertical line and its lit copy, in a box of the line's own width */
    const verticalLine = (/** @type {Animated.AnimatedInterpolation<number>} */ segment) => (
        <View style={styles.vertical}>
            <View style={[styles.line, dark]} />
            <Animated.View style={[styles.line, styles.over, lit, growUp(segment)]} />
        </View>
    );

    return (
        <View style={[styles.path, { width }]} pointerEvents='none'>
            {verticalLine(stem)}
            <View style={[styles.barRow, { width }]}>
                <View style={[styles.bar, { width }, dark]} />
                <Animated.View style={[styles.bar, styles.over, { width: half }, lit, growIn(bar, -1)]} />
                <Animated.View style={[styles.bar, styles.over, { width: half, left: half }, lit, growIn(bar, 1)]} />
            </View>
            <View style={[styles.branchesRow, { width }]}>
                {verticalLine(branches)}
                {verticalLine(branches)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    path: {
        alignItems: 'center'
    },
    barRow: {
        height: 1.5
    },
    branchesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    vertical: {
        width: 1.5,
        height: CONNECTOR_HEIGHT
    },
    line: {
        width: 1.5,
        height: CONNECTOR_HEIGHT
    },
    bar: {
        height: 1.5
    },
    over: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export { ForgePath };

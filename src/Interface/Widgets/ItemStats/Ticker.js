import * as React from 'react';
import { Animated, Easing, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import { ItemStatBadge, SortedItemStats } from './index';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemStatsMap} ItemStatsMap
 */

/** Space between the end of the line and its next copy, in points */
const LOOP_GAP = 16;
/** Fade of each edge while the line scrolls, in points */
const FADE_WIDTH = 8;
/** Pause at the start of each turn, in ms */
const HOLD_MS = 0;

/**
 * The stats of a copy on ONE line. When the line is wider than its box, it scrolls to the left
 * for ever, seamlessly: the line is laid out twice, one copy after the other, and the loop
 * returns to its start exactly when the second copy stands where the first one started. Two copies,
 * never more, whatever the time it runs; both edges fade out while it scrolls.
 * The loop is ONE native timing of a single value looped by the native driver (no sequence, no JS
 * restart between turns): it runs for ever, whatever the JS thread or the re-renders do. The pause
 * at the start of each turn is a flat segment of the interpolation.
 * @param {object} props
 * @param {ItemStatsMap} props.stats
 * @param {number} props.width The box the line lives in, in points
 * @param {number} [props.speed] Points per second
 * @param {StyleProp} [props.style]
 */
function ItemStatsTicker({ stats, width, speed = 16, style }) {
    const rows = SortedItemStats(stats);
    const [contentWidth, setContentWidth] = React.useState(0);
    /** 0 → 1 over one turn: still during the hold, then one full period to the left */
    const progress = React.useRef(new Animated.Value(0)).current;

    const scrolls = contentWidth > width;
    const period = contentWidth + LOOP_GAP;
    const duration = HOLD_MS + (period / speed) * 1000;
    const translate = progress.interpolate({
        inputRange: [0, HOLD_MS / duration, 1],
        outputRange: [0, 0, -period]
    });

    React.useEffect(() => {
        progress.setValue(0);
        if (!scrolls) {
            return undefined;
        }
        const loop = Animated.loop(
            Animated.timing(progress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
        );
        loop.start();
        return () => loop.stop();
    }, [scrolls, duration, progress]);

    /** @param {LayoutChangeEvent} event */
    const onLayoutLine = (event) => {
        const measured = Math.ceil(event.nativeEvent.layout.width);
        if (measured !== contentWidth) {
            setContentWidth(measured);
        }
    };

    if (rows.length === 0) {
        return <View style={[styles.ticker, { width }, style]} />;
    }

    /** @param {string} suffix */
    const renderLine = (suffix) => (
        <View style={styles.tickerLine}>
            {rows.map(({ key, value }) => (
                <ItemStatBadge key={`${key}-${suffix}`} statKey={key} value={value} compact />
            ))}
        </View>
    );

    const content = (
        <Animated.View
            style={[
                styles.tickerContent,
                scrolls ? styles.tickerScrolling : null,
                { transform: [{ translateX: translate }] }
            ]}
        >
            <View testID='item-stats-line' onLayout={onLayoutLine}>
                {renderLine('a')}
            </View>
            {scrolls && <View style={{ width: LOOP_GAP }} />}
            {scrolls && renderLine('b')}
        </Animated.View>
    );

    if (!scrolls) {
        return <View style={[styles.ticker, { width }, style]}>{content}</View>;
    }

    return (
        <MaskedView
            style={[styles.ticker, { width }, style]}
            maskElement={
                <LinearGradient
                    style={styles.tickerMask}
                    colors={['#FFFFFF00', '#FFFFFF', '#FFFFFF', '#FFFFFF00']}
                    locations={[0, FADE_WIDTH / width, 1 - FADE_WIDTH / width, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            }
        >
            {content}
        </MaskedView>
    );
}

export { ItemStatsTicker };

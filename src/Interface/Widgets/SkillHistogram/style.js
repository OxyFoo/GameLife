import { StyleSheet } from 'react-native';

/** Height of the bars area, in pixels */
const PLOT_HEIGHT = 120;

/** Height of the labels under the bars, in pixels */
const LABELS_HEIGHT = 30;

/** Width of the Y axis column, in pixels */
const AXIS_WIDTH = 34;

/** Minimum height of a non-empty bar, in pixels */
const MIN_BAR_HEIGHT = 3;

/** Horizontal gap on each side of a bar, in pixels */
const BAR_GAP = 3;

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        padding: 12
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    headerTitle: {
        flexShrink: 1,
        textAlign: 'left'
    },
    plot: {
        flexDirection: 'row',
        height: PLOT_HEIGHT + LABELS_HEIGHT
    },
    gridLines: {
        position: 'absolute',
        left: AXIS_WIDTH,
        right: 0,
        top: 0,
        height: PLOT_HEIGHT
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1
    },
    gridLineTop: {
        top: 0
    },
    gridLineMiddle: {
        top: PLOT_HEIGHT / 2
    },
    gridLineBottom: {
        top: PLOT_HEIGHT - 1
    },
    axis: {
        width: AXIS_WIDTH,
        height: PLOT_HEIGHT
    },
    axisLabel: {
        position: 'absolute',
        right: 6,
        textAlign: 'right'
    },
    axisLabelTop: {
        top: -6
    },
    axisLabelMiddle: {
        top: PLOT_HEIGHT / 2 - 6
    },
    list: {
        flex: 1
    },
    listContent: {
        flexGrow: 1,
        justifyContent: 'flex-end'
    },
    empty: {
        height: PLOT_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Bars
    slot: {
        alignItems: 'center'
    },
    plotSlot: {
        height: PLOT_HEIGHT,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    glow: {
        position: 'absolute',
        bottom: -2
    },
    emptyDot: {
        width: 3,
        height: 3,
        borderRadius: 2
    },
    dayLabel: {
        marginTop: 4
    },
    monthLabel: {
        marginTop: -2
    }
});

export default styles;
export { PLOT_HEIGHT, LABELS_HEIGHT, AXIS_WIDTH, MIN_BAR_HEIGHT, BAR_GAP };

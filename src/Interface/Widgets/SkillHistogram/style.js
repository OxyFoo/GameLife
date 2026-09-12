import { StyleSheet } from 'react-native';

/** Height of the bars area, in pixels */
const PLOT_HEIGHT = 120;

/** Height of the labels under the bars, in pixels */
const LABELS_HEIGHT = 30;

/** Width of the Y axis column, in pixels — the widest label ("30m" at fs9) plus a small gap */
const AXIS_WIDTH = 20;

/** Minimum height of a non-empty bar, in pixels */
const MIN_BAR_HEIGHT = 3;

/** Horizontal gap on each side of a bar, in pixels */
const BAR_GAP = 4;

/** Width of the day and month labels, in pixels */
const LABEL_WIDTH = 30;

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
    headerTexts: {
        flexShrink: 1,
        alignItems: 'flex-start'
    },
    headerTitle: {
        textAlign: 'left'
    },
    headerSelected: {
        textAlign: 'left',
        marginTop: 2
    },
    windowButton: {
        width: 'auto',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20 // Radius of the ripple effect
    },
    windowButtonBackground: {
        borderRadius: 20
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
        left: 0
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
    bar: {
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2
    },
    emptyDot: {
        width: 3,
        height: 3,
        borderRadius: 2
    },
    // Labels are wider than a narrow slot and overflow it evenly, so a date never wraps
    dayLabel: {
        width: LABEL_WIDTH,
        marginTop: 4
    },
    monthLabel: {
        width: LABEL_WIDTH,
        marginTop: -2
    }
});

export default styles;
export { PLOT_HEIGHT, LABELS_HEIGHT, AXIS_WIDTH, MIN_BAR_HEIGHT, BAR_GAP };

import * as React from 'react';
import { Platform } from 'react-native';

import langManager from 'Managers/LangManager';

import { TwoDigit } from 'Utils/Functions';
import { DayIndexToDate, GetHistogramDays, GetNiceMaxMinutes } from 'Data/User/Activities/skillFrequency';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').FlatList<HistogramDay>} FlatListDays
 * @typedef {import('Data/User/Activities/skillFrequency').HistogramDay} HistogramDay
 *
 * @typedef {object} HistogramData
 * @property {HistogramDay[]} days Loaded days, from the oldest to today
 * @property {number} niceMax Scale maximum, in minutes
 */

/** Days loaded per batch when scrolling to the past */
const BATCH_DAYS = 60;

/** Bars displayed at once with a fixed window */
const VISIBLE_BARS = 14;

/** Bars displayed at once on the whole history (narrower bars, more data) */
const VISIBLE_BARS_ALL = 30;

/** Day labels shown every N days on the whole history (the 1st of each month is always shown) */
const DAY_LABEL_STEP_ALL = 5;

const SkillHistogramProps = {
    /** @type {StyleViewProp} */
    style: {},

    /** @type {Map<number, number>} Minutes per local day index */
    dailyMinutes: new Map(),

    /** @type {number | null} Local day index of the first activity, null if none */
    firstDayIndex: null,

    /** @type {number} Local day index of today */
    todayIndex: 0,

    /** @type {number | null} Displayed window in days (today included), null = whole history with lazy loading */
    windowDays: null,

    /** @type {string} Label of the window button */
    windowLabel: '',

    /** Called when the window button is pressed */
    onWindowPress: () => {}
};

class BackSkillHistogram extends React.Component {
    state = {
        /** Width available for the bars list, 0 before the first layout */
        listWidth: 0,

        /** Oldest loaded day, before clamping to the first activity */
        oldestDayIndex: 0,

        /** @type {number | null} */
        selectedDayIndex: null
    };

    /** @type {React.RefObject<FlatListDays | null>} */
    refList = React.createRef();

    /** Avoid loading two batches at once */
    loading = false;

    /** The user took over the scroll position, stop snapping the list to today */
    userInteracted = false;

    /** Unfloored list width, to snap the scroll exactly to the end of the content */
    exactListWidth = 0;

    /** @type {{ dailyMinutes: Map<number, number> | null, oldest: number, today: number, data: HistogramData }} */
    cache = { dailyMinutes: null, oldest: 0, today: 0, data: { days: [], niceMax: GetNiceMaxMinutes(0) } };

    /** @param {typeof SkillHistogramProps} props */
    constructor(props) {
        super(props);
        this.state.oldestDayIndex = props.todayIndex - BATCH_DAYS + 1;
    }

    /** @returns {number} Oldest displayed day, clamped to [firstDayIndex, todayIndex] */
    getOldestDayIndex = () => {
        const { firstDayIndex, todayIndex, windowDays } = this.props;
        if (firstDayIndex === null) {
            return todayIndex + 1;
        }
        const oldest = windowDays !== null ? todayIndex - windowDays + 1 : this.state.oldestDayIndex;
        return Math.max(firstDayIndex, Math.min(oldest, todayIndex));
    };

    /** More days can be loaded only without fixed window */
    hasMoreDays = () => {
        const { firstDayIndex, windowDays } = this.props;
        return windowDays === null && firstDayIndex !== null && this.getOldestDayIndex() > firstDayIndex;
    };

    /** @returns {HistogramData} Loaded days and scale, memoized */
    getData = () => {
        const { dailyMinutes, todayIndex } = this.props;
        const oldest = this.getOldestDayIndex();
        const { cache } = this;

        if (cache.dailyMinutes !== dailyMinutes || cache.oldest !== oldest || cache.today !== todayIndex) {
            const days = GetHistogramDays(dailyMinutes, oldest, todayIndex);
            const maxMinutes = days.reduce((max, day) => Math.max(max, day.minutes), 0);
            this.cache = {
                dailyMinutes,
                oldest,
                today: todayIndex,
                data: { days, niceMax: GetNiceMaxMinutes(maxMinutes) }
            };
        }

        return this.cache.data;
    };

    /** @returns {number} Bars displayed at once, more of them on the whole history */
    getVisibleBars = () => (this.props.windowDays === null ? VISIBLE_BARS_ALL : VISIBLE_BARS);

    /** @returns {number} Days between two day labels */
    getDayLabelStep = () => (this.props.windowDays === null ? DAY_LABEL_STEP_ALL : 1);

    getSlotWidth = () => this.state.listWidth / this.getVisibleBars();

    /** @param {typeof SkillHistogramProps} prevProps */
    componentDidUpdate(prevProps) {
        if (prevProps.windowDays !== this.props.windowDays) {
            this.userInteracted = false;
        }
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutList = (event) => {
        this.exactListWidth = event.nativeEvent.layout.width;
        const listWidth = Math.floor(event.nativeEvent.layout.width);
        if (listWidth !== this.state.listWidth) {
            this.userInteracted = false;
            this.setState({ listWidth });
        }
    };

    onScrollBeginDrag = () => {
        this.userInteracted = true;
    };

    /**
     * On iOS, `initialScrollIndex` leaves the list short of its end by a fraction of a slot (the
     * bars drift to the right and today is clipped). Once the content is sized, snap to the exact
     * end — today against the right edge — as long as the user did not take over the scroll.
     * @param {number} contentWidth
     */
    onListContentSizeChange = (contentWidth) => {
        if (Platform.OS !== 'ios' || this.userInteracted || this.refList.current === null) {
            return;
        }
        this.refList.current.scrollToOffset({
            offset: Math.max(0, contentWidth - this.exactListWidth),
            animated: false
        });
    };

    /** @type {FlatListDays['props']['getItemLayout']} */
    getItemLayout = (_data, index) => {
        const length = this.getSlotWidth();
        return { length, offset: length * index, index };
    };

    /** Load the previous batch of days when scrolling to the past */
    /** @type {FlatListDays['props']['onStartReached']} */
    onStartReached = () => {
        if (this.loading || !this.hasMoreDays()) {
            return;
        }

        this.loading = true;
        this.setState({ oldestDayIndex: this.getOldestDayIndex() - BATCH_DAYS }, () => {
            this.loading = false;
        });
    };

    /** @param {number} dayIndex */
    onBarPress = (dayIndex) => {
        this.setState(
            /** @param {this['state']} prevState */
            (prevState) => ({ selectedDayIndex: prevState.selectedDayIndex === dayIndex ? null : dayIndex })
        );
    };

    /**
     * @param {number} minutes
     * @returns {string} "2h", "1h 20m" or "45m"
     */
    formatMinutes = (minutes) => {
        const langDates = langManager.curr['dates']['names'];
        const hours = Math.floor(minutes / 60);
        const remaining = Math.round(minutes % 60);

        if (hours > 0 && remaining > 0) {
            return `${hours}${langDates['hours-min']} ${remaining}${langDates['minutes-min']}`;
        }
        if (hours > 0) {
            return `${hours}${langDates['hours-min']}`;
        }
        return `${remaining}${langDates['minutes-min']}`;
    };

    /**
     * @param {number} dayIndex
     * @returns {string} "DD/MM/YYYY · 1h 20m"
     */
    getSelectedText = (dayIndex) => {
        const { day, month, year } = DayIndexToDate(dayIndex);
        const minutes = this.props.dailyMinutes.get(dayIndex) ?? 0;
        return `${TwoDigit(day)}/${TwoDigit(month + 1)}/${year} · ${this.formatMinutes(minutes)}`;
    };
}

BackSkillHistogram.prototype.props = SkillHistogramProps;
BackSkillHistogram.defaultProps = SkillHistogramProps;

export default BackSkillHistogram;
export { BATCH_DAYS, VISIBLE_BARS, VISIBLE_BARS_ALL };

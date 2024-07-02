import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

import { GetBlockMonth } from 'Interface/Widgets/BlockMonth/script';
import { TIME_STEP_MINUTES } from 'Utils/Activities';
import { GetLocalTime, GetTimeZone, RoundTimeTo } from 'Utils/Time';

/**
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} ScrollEvent
 *
 * @typedef {import('Class/Activities').Activity} Activity
 * @typedef {import('Interface/Components').ActivityTimeline} ActivityTimeline
 * @typedef {import('Interface/Widgets').ActivityPanel} ActivityPanel
 * @typedef {import('Interface/Widgets/BlockMonth/index').MonthData} MonthData
 */

class BackCalendar extends PageBase {
    state = {};

    /** @type {Symbol | null} */
    activitiesListener = null;

    static feKeepMounted = true;
    static feShowUserHeader = true;
    static feShowNavBar = true;

    componentDidMount() {
        return;

        const today = new Date();
        const Day = today.getDate();
        const Month = today.getMonth();
        const FullYear = today.getFullYear();
        this.daySelect(Day, Month, FullYear);

        this.activitiesListener = user.activities.allActivities.AddListener(async () => {
            // Update activities
            if (this.state.selectedALL === null) return;

            const { day, month, year } = this.state.selectedALL;
            await this.daySelect(day, month, year, true);
        });
    }

    componentWillUnmount() {
        user.activities.allActivities.RemoveListener(this.activitiesListener);
    }

    /**
     * @param {number} day
     * @param {number} month
     * @param {number} year
     * @param {boolean} [force=false]
     * @returns {Promise<void>}
     */
    daySelect = async (
        day = null,
        month = this.state.selectedALL?.month,
        year = this.state.selectedALL?.year,
        force = false
    ) => {
        if (
            !force &&
            this.state.selectedALL?.day === day &&
            this.state.selectedALL?.month === month &&
            this.state.selectedALL.year === year
        ) {
            // Already selected
            return;
        }

        const date = new Date(year, month, day);

        // Select day
        if (day !== null) {
            const now = new Date();
            date.setHours(now.getHours(), now.getMinutes(), 0, 0);
            const nowLocalTime = GetLocalTime(date) + GetTimeZone() * 60;
            user.tempSelectedTime = RoundTimeTo(TIME_STEP_MINUTES, nowLocalTime);

            if (!this.opened) {
                this.showPanel();
            }
        }

        // Unselect day (calendar mode)
        else {
            user.tempSelectedTime = null;
            if (this.opened) {
                this.hidePanel();
            }
        }

        return new Promise((resolve, reject) => {
            if (day !== null) {
                const weeks = GetBlockMonth(month, year, undefined, day).data;
                const week = weeks.findIndex((w) => w.filter((d) => d?.day === day).length > 0);
                const activities = user.activities.GetByTime(GetLocalTime(date));

                this.setState(
                    {
                        currActivities: activities,
                        selectedALL: { day, week, month, year }
                    },
                    resolve
                );
            } else {
                this.setState({ selectedALL: null }, resolve);
            }
        });
    };
    dayRefresh = () => this.daySelect();
}

export default BackCalendar;

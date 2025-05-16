import { Sum } from 'Utils/Functions';
import { DAY_TIME, GetDate, GetLocalTime } from 'Utils/Time';

/**
 * @typedef {import('Data/User/Activities/index').default} Activities
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Quests').Quest} Quest
 *
 * @typedef {'past' | 'filling' | 'future' | 'disabled'} DayClockStates
 *
 * @typedef {object} DayType
 * @property {number} day
 * @property {boolean} isToday
 * @property {DayClockStates} state
 * @property {number} progress Value between 0 and 1 (can be over 1 if more than 100%), Only used if state is 'past' or 'filling'
 */

/**
 * @param {Activities} activities
 * @param {Quest} quest
 * @param {number} time in seconds
 * @returns {DayType[]} Days of the week
 * @private
 */
function getDayFromMonthOrWeek(activities, quest, time = GetLocalTime()) {
    const dateNow = GetDate(time);
    const currentDate = dateNow.getDate() - 1;
    const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
    const { skills, schedule } = quest;

    if (schedule.duration === 0) return []; // Avoid division by 0

    /** @type {DayType[]} */
    const days = [];

    for (let i = 0; i < 7; i++) {
        /** @type {DayClockStates} */
        let state = 'filling';
        let progress = 0;
        const isToday = i === currentDayIndex;

        // Disabled if not in repeat
        if (
            (schedule.type === 'week' && !schedule.repeat.includes(i)) ||
            (schedule.type === 'month' && !schedule.repeat.includes((currentDate - currentDayIndex + i + 31) % 31))
        ) {
            state = 'disabled';
        }

        // Filling if in repeat and not completed
        if (state !== 'disabled') {
            const deltaToNewDay = i - currentDayIndex;
            const activitiesNewDay = activities
                .GetByTime(time + deltaToNewDay * DAY_TIME)
                .filter((activity) => skills.includes(activity.skillID))
                .filter((activity) => activities.GetExperienceStatus(activity) === 'grant');

            // Past
            if (deltaToNewDay <= 0) {
                const totalDuration = Sum(activitiesNewDay.map((activity) => activity.duration));
                progress = totalDuration / schedule.duration;
                if (deltaToNewDay < 0) {
                    state = 'past';
                }
            }

            // Future
            else if (deltaToNewDay > 0) {
                state = 'future';
            }
        }

        days.push({ day: i, isToday, state, progress });
    }

    return days;
}

/**
 * @param {Activities} activities
 * @param {Quest} quest
 * @param {number} time in seconds
 * @returns {DayType[]} Days of the week
 * @private
 */
function getDayFromFrequencyByMonth(activities, quest, time = GetLocalTime()) {
    const dateNow = GetDate(time);
    const currentDate = new Date().getDate();
    const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
    const maxDate = currentDate + 7 - currentDayIndex;
    const firstDateWeek = currentDate - currentDayIndex;
    const { skills, schedule } = quest;

    /** @type {DayType[]} */
    const days = [];

    // Avoid division by 0
    if (schedule.type !== 'frequency' || schedule.frequencyMode !== 'month' || schedule.duration === 0) {
        return days;
    }

    const firstDayMonth = new Date();
    firstDayMonth.setDate(1);
    const firstTime = firstDayMonth.setHours(0, 0, 0, 0) / 1000;

    let dayFilled = 0;
    const _activities = activities
        .Get()
        .filter((activity) => activity.startTime + activity.timezone * 3600 >= firstTime)
        .filter((activity) => skills.includes(activity.skillID))
        .filter((activity) => activities.GetExperienceStatus(activity) === 'grant');

    for (let i = 0; i < maxDate; i++) {
        const day = i - firstDateWeek + 1;

        /** @type {DayType} */
        const newDay = {
            day,
            state: 'disabled',
            isToday: day === currentDayIndex,
            progress: 0
        };

        const deltaToNewDay = day - currentDayIndex;

        const activitiesDay = _activities.filter(
            (activity) =>
                activity.startTime + activity.timezone * 3600 >= firstTime + i * DAY_TIME &&
                activity.startTime + activity.timezone * 3600 < firstTime + (i + 1) * DAY_TIME
        );

        const totalDuration = Sum(activitiesDay.map((activity) => activity.duration));

        if (dayFilled < schedule.quantity) {
            newDay.state = 'filling';
            newDay.progress = totalDuration / schedule.duration;

            if (deltaToNewDay < 0) {
                newDay.state = 'past';
            } else if (deltaToNewDay > 0) {
                newDay.state = 'future';
            }

            if (totalDuration >= schedule.duration) {
                dayFilled++;
            }
        }

        if (day >= 0) {
            days.push(newDay);
        }
    }

    return days;
}

/**
 * @param {Activities} activities
 * @param {Quest} quest
 * @param {number} time in seconds
 * @returns {DayType[]} Days of the week
 * @private
 */
function getDayFromFrequencyByWeek(activities, quest, time = GetLocalTime()) {
    const dateNow = GetDate(time);
    const currentDate = new Date().getDate();
    const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
    const { skills, schedule } = quest;

    /** @type {DayType[]} */
    const days = [];

    // Avoid division by 0
    if (schedule.type !== 'frequency' || schedule.frequencyMode !== 'week' || schedule.duration === 0) {
        return days;
    }

    const firstDayWeek = new Date();
    firstDayWeek.setDate(currentDate - currentDayIndex);
    const firstTime = firstDayWeek.setHours(0, 0, 0, 0) / 1000;

    let dayFilled = 0;
    const _activities = activities
        .Get()
        .filter((activity) => activity.startTime + activity.timezone * 3600 >= firstTime)
        .filter((activity) => skills.includes(activity.skillID))
        .filter((activity) => activities.GetExperienceStatus(activity) === 'grant');

    for (let i = 0; i < 7; i++) {
        /** @type {DayType} */
        const newDay = {
            day: i,
            state: 'disabled',
            isToday: i === currentDayIndex,
            progress: 0
        };

        const deltaToNewDay = i - currentDayIndex;

        const activitiesDay = _activities.filter(
            (activity) =>
                activity.startTime + activity.timezone * 3600 >= firstTime + i * DAY_TIME &&
                activity.startTime + activity.timezone * 3600 < firstTime + (i + 1) * DAY_TIME
        );

        const totalDuration = Sum(activitiesDay.map((activity) => activity.duration));

        if (dayFilled < schedule.quantity) {
            newDay.state = 'filling';
            newDay.progress = totalDuration / schedule.duration;

            if (deltaToNewDay < 0) {
                newDay.state = 'past';
            } else if (deltaToNewDay > 0) {
                newDay.state = 'future';
            }

            if (totalDuration >= schedule.duration) {
                dayFilled++;
            }
        }

        days.push(newDay);
    }

    return days;
}

export { getDayFromMonthOrWeek, getDayFromFrequencyByMonth, getDayFromFrequencyByWeek };

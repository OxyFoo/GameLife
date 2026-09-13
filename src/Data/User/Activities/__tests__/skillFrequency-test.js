import Activities from '../index';
import {
    RATE_WINDOW_DAYS,
    GetTodayLocalDayIndex,
    GetSkillDayIndexes,
    ComputeStreaks,
    ComputeRate,
    ComputeDailyMinutes,
    GetNiceMaxMinutes,
    DayIndexToDate,
    GetHistogramDays,
    ComputeSkillFrequency
} from '../skillFrequency';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 */

jest.mock('Utils/Time', () => ({
    ...jest.requireActual('Utils/Time'),
    GetTimeZone: () => 2
}));

const DAY_TIME = 24 * 60 * 60;

/** Activities are stamped with a UTC+2 timezone (Paris in summer) */
const TIMEZONE = 2;

/** Local day index of 2025-08-30 */
const DAY = 20330;

let nextID = 1;

/**
 * Build a saved activity starting at a local hour of a local day
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration In minutes
 * @param {number} [skillID]
 * @param {number} [timezone]
 * @returns {ActivitySaved}
 */
const at = (dayIndex, hourLocal, duration, skillID = 1, timezone = TIMEZONE) => {
    const startTime = dayIndex * DAY_TIME + hourLocal * 3600 - timezone * 3600;
    return {
        ID: nextID++,
        skillID,
        startTime,
        duration,
        comment: '',
        timezone,
        addedType: 'normal',
        addedTime: startTime + 60,
        friends: [],
        notifyBefore: null
    };
};

/** @param {number[]} list */
const days = (list) => new Set(list);

describe('[Data] skillFrequency', () => {
    describe('GetSkillDayIndexes', () => {
        it('should count a day once whatever the number of activities', () => {
            const set = GetSkillDayIndexes([at(DAY, 8, 30), at(DAY, 20, 30)], DAY);
            expect([...set]).toEqual([DAY]);
        });

        it('should ignore future days', () => {
            const set = GetSkillDayIndexes([at(DAY, 8, 30), at(DAY + 1, 8, 30), at(DAY + 2, 8, 30)], DAY);
            expect([...set]).toEqual([DAY]);
        });

        it('should use the local day of each activity, not the UTC day', () => {
            // 21:30Z and 22:30Z are the same UTC day, but two local days in UTC+2
            const set = GetSkillDayIndexes([at(DAY - 1, 23.5, 30), at(DAY, 0.5, 30)], DAY);
            expect([...set].sort()).toEqual([DAY - 1, DAY]);

            // 22:00 local in UTC-5 is 03:00Z the next day: still the same local day
            const west = GetSkillDayIndexes([at(DAY, 22, 30, 1, -5)], DAY);
            expect([...west]).toEqual([DAY]);
        });
    });

    describe('ComputeStreaks', () => {
        it('should count consecutive days ending today', () => {
            expect(ComputeStreaks(days([DAY - 2, DAY - 1, DAY]), DAY)).toEqual({ current: 3, best: 3 });
        });

        it('should not break the streak when today is not done yet', () => {
            expect(ComputeStreaks(days([DAY - 2, DAY - 1]), DAY)).toEqual({ current: 2, best: 2 });
        });

        it('should reset the current streak after a gap and keep the best one', () => {
            expect(ComputeStreaks(days([DAY - 5, DAY - 4, DAY - 3, DAY]), DAY)).toEqual({ current: 1, best: 3 });
        });

        it('should handle a single day', () => {
            expect(ComputeStreaks(days([DAY]), DAY)).toEqual({ current: 1, best: 1 });
            expect(ComputeStreaks(days([DAY - 2]), DAY)).toEqual({ current: 0, best: 1 });
        });

        it('should return zeros without any day', () => {
            expect(ComputeStreaks(days([]), DAY)).toEqual({ current: 0, best: 0 });
        });

        it('should ignore future days', () => {
            expect(ComputeStreaks(days([DAY, DAY + 1, DAY + 2]), DAY)).toEqual({ current: 1, best: 1 });
        });
    });

    describe('ComputeRate', () => {
        it('should use a fixed window of 30 days ending today', () => {
            const set = days([DAY, DAY - 1, DAY - 40]);
            expect(ComputeRate(set, DAY, RATE_WINDOW_DAYS)).toEqual({ activeDays: 2, totalDays: 30, rate: 2 / 30 });
        });

        it('should keep the full window for a young skill', () => {
            expect(ComputeRate(days([DAY, DAY - 1]), DAY, 30)).toEqual({ activeDays: 2, totalDays: 30, rate: 2 / 30 });
        });

        it('should count since the first activity without window', () => {
            const set = days([DAY, DAY - 1, DAY - 40]);
            expect(ComputeRate(set, DAY, null)).toEqual({ activeDays: 3, totalDays: 41, rate: 3 / 41 });
        });

        it('should return zeros without any day', () => {
            expect(ComputeRate(days([]), DAY, null)).toEqual({ activeDays: 0, totalDays: 0, rate: 0 });
            expect(ComputeRate(days([]), DAY, 30)).toEqual({ activeDays: 0, totalDays: 30, rate: 0 });
        });

        it('should ignore future days', () => {
            expect(ComputeRate(days([DAY, DAY + 1]), DAY, 30)).toEqual({ activeDays: 1, totalDays: 30, rate: 1 / 30 });
        });
    });

    describe('ComputeDailyMinutes', () => {
        it('should sum the minutes of each local day and ignore future days', () => {
            const minutes = ComputeDailyMinutes(
                [at(DAY - 1, 8, 30), at(DAY, 8, 45), at(DAY, 20, 15), at(DAY + 1, 8, 60)],
                DAY
            );
            expect([...minutes.entries()]).toEqual([
                [DAY - 1, 30],
                [DAY, 60]
            ]);
        });
    });

    describe('GetNiceMaxMinutes', () => {
        it('should round up to a nice scale value', () => {
            const cases = [
                [0, 30],
                [5, 30],
                [30, 30],
                [31, 60],
                [61, 120],
                [121, 240],
                [241, 360],
                [361, 480],
                [481, 720],
                [721, 960],
                [1440, 1440]
            ];
            for (const [input, expected] of cases) {
                expect(GetNiceMaxMinutes(input)).toBe(expected);
            }
        });
    });

    describe('Histogram days', () => {
        it('should convert a local day index to a calendar date', () => {
            expect(DayIndexToDate(DAY)).toEqual({ day: 30, month: 7, year: 2025 });
        });

        it('should fill the missing days and stop at the first activity', () => {
            const minutes = new Map([
                [DAY - 5, 30],
                [DAY, 60]
            ]);
            const histogram = GetHistogramDays(minutes, Math.max(DAY - 5, DAY - 59), DAY);

            expect(histogram).toHaveLength(6);
            expect(histogram[0]).toMatchObject({ dayIndex: DAY - 5, minutes: 30, showMonth: true });
            expect(histogram[1]).toMatchObject({ dayIndex: DAY - 4, minutes: 0, showMonth: false });
            expect(histogram[5]).toMatchObject({ dayIndex: DAY, minutes: 60, day: 30 });
        });

        it('should flag the first day of each month', () => {
            const histogram = GetHistogramDays(new Map(), DAY - 5, DAY + 5);
            const firstOfSeptember = histogram.find((day) => day.dayIndex === DAY + 2);
            expect(firstOfSeptember).toMatchObject({ day: 1, month: 8, year: 2025, showMonth: true });
        });
    });

    describe('ComputeSkillFrequency', () => {
        it('should compose streaks, rate and daily minutes', () => {
            const activities = [at(DAY - 3, 8, 30), at(DAY - 1, 8, 30), at(DAY, 8, 30), at(DAY + 1, 8, 30)];
            const frequency = ComputeSkillFrequency(activities, DAY, null);

            expect(frequency).toMatchObject({
                todayIndex: DAY,
                firstDayIndex: DAY - 3,
                currentStreak: 2,
                bestStreak: 2,
                activeDays: 3,
                totalDays: 4,
                rate: 3 / 4
            });
            expect(frequency.dailyMinutes.get(DAY + 1)).toBeUndefined();
        });

        it('should have no first day without any past activity', () => {
            expect(ComputeSkillFrequency([at(DAY + 1, 8, 30)], DAY, 30)).toMatchObject({
                firstDayIndex: null,
                currentStreak: 0,
                bestStreak: 0,
                rate: 0
            });
        });
    });

    describe('Activities.GetSkillFrequency', () => {
        /** @type {Activities} */
        let activities;

        beforeEach(() => {
            // 10:00 local (UTC+2) on DAY
            jest.setSystemTime(new Date((DAY * DAY_TIME + 10 * 3600 - TIMEZONE * 3600) * 1000));

            const user = /** @type {any} */ ({ interface: { console: { AddLog: jest.fn(() => 1) } } });
            activities = new Activities(user);
            user.activities = activities;
        });

        it('should compute today from the device timezone', () => {
            expect(GetTodayLocalDayIndex()).toBe(DAY);
        });

        it('should only use the activities of the skill, with the 30 days window by default', () => {
            activities.Load({ activities: [at(DAY - 1, 8, 30, 1), at(DAY, 8, 30, 1), at(DAY, 9, 30, 2)] });

            const frequency = activities.GetSkillFrequency(1);
            expect(frequency).toMatchObject({ todayIndex: DAY, currentStreak: 2, activeDays: 2, totalDays: 30 });
            expect([...frequency.dailyMinutes.values()]).toEqual([30, 30]);

            expect(activities.GetSkillFrequency(2, null)).toMatchObject({ currentStreak: 1, totalDays: 1 });
        });
    });
});

import { TimeIsFree } from 'Data/User/Activities/utils';
import { MIN_TIME_MINUTES, TIME_STEP_MINUTES, RoundActivityTime, GetActivitySlot } from '../ActivityTime';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 */

const STEP = TIME_STEP_MINUTES * 60;

/** Some day at 00:00 (a multiple of the step, like every midnight) */
const DAY = 20330 * 24 * 60 * 60;

/**
 * Instant of the reference day
 * @param {number} h
 * @param {number} m
 * @param {number} [s]
 * @returns {number} Time in seconds
 */
const at = (h, m, s = 0) => DAY + h * 3600 + m * 60 + s;

/**
 * Activity as it is saved: start and duration already on the grid
 * @param {number} startTime
 * @param {number} duration In minutes
 * @returns {Activity}
 */
const saved = (startTime, duration) => ({
    skillID: 1,
    startTime,
    duration,
    comment: '',
    timezone: 0,
    addedType: 'start-now',
    addedTime: startTime + 1,
    friends: [],
    notifyBefore: null
});

/**
 * Activity saved by the timer stopped at `stopTime`
 * @param {number} startTime Raw start
 * @param {number} stopTime Raw stop
 * @returns {Activity}
 */
const stoppedAt = (startTime, stopTime) => {
    const slot = GetActivitySlot(startTime, stopTime);
    return saved(slot.startTime, slot.duration);
};

/**
 * Whether "GO" pressed at `goTime` is accepted, as StartActivityNow checks it
 * @param {number} goTime Raw instant
 * @param {Activity[]} activities
 * @returns {boolean}
 */
const canStartAt = (goTime, activities) => TimeIsFree(RoundActivityTime(goTime), MIN_TIME_MINUTES, activities);

describe('[Utils] ActivityTime', () => {
    describe('RoundActivityTime', () => {
        it('should snap to the nearest step, ties going down', () => {
            expect(RoundActivityTime(at(17, 37, 29))).toBe(at(17, 35));
            expect(RoundActivityTime(at(17, 37, 30))).toBe(at(17, 35));
            expect(RoundActivityTime(at(17, 37, 31))).toBe(at(17, 40));
            expect(RoundActivityTime(at(17, 38))).toBe(at(17, 40));
            expect(RoundActivityTime(at(17, 40))).toBe(at(17, 40));
        });

        it('should never decrease over time', () => {
            // The invariant behind the whole slot logic: an instant after a stop can not snap before it
            let previous = RoundActivityTime(at(17, 30));
            for (let time = at(17, 30) + 1; time <= at(17, 40); time++) {
                const current = RoundActivityTime(time);
                expect(current).toBeGreaterThanOrEqual(previous);
                previous = current;
            }
        });
    });

    describe('GetActivitySlot', () => {
        it('should give a start on the grid and a duration multiple of the step', () => {
            expect(GetActivitySlot(at(17, 1, 12), at(17, 38, 20))).toEqual({ startTime: at(17, 0), duration: 40 });
            expect(GetActivitySlot(at(17, 3), at(17, 42, 29))).toEqual({ startTime: at(17, 5), duration: 35 });
        });

        it('should give an empty slot when both instants fall in the same cell', () => {
            expect(GetActivitySlot(at(17, 38), at(17, 41))).toEqual({ startTime: at(17, 40), duration: 0 });
            expect(GetActivitySlot(at(17, 40), at(17, 40))).toEqual({ startTime: at(17, 40), duration: 0 });
        });
    });

    describe('starting right after a stop', () => {
        it('should accept a GO at 17:38:30 after a stop at 17:38:20 (saved until 17:40)', () => {
            const previous = stoppedAt(at(17, 0), at(17, 38, 20));
            expect(previous).toMatchObject({ startTime: at(17, 0), duration: 40 });

            expect(canStartAt(at(17, 38, 30), [previous])).toBe(true);
        });

        it('should accept a GO one second after the worst stop instant', () => {
            // 17:37:31 is the earliest instant saved as 17:40
            const previous = stoppedAt(at(17, 0), at(17, 37, 31));
            expect(canStartAt(at(17, 37, 32), [previous])).toBe(true);
        });

        it('should accept a GO at any instant within a step after any stop', () => {
            for (let stop = at(17, 30); stop < at(17, 35); stop++) {
                const previous = stoppedAt(at(17, 0), stop);
                for (let go = stop; go <= stop + STEP; go += 7) {
                    expect(canStartAt(go, [previous])).toBe(true);
                }
            }
        });

        it('should not let the timer stop itself before its slot exists', () => {
            // Started at 17:38 the slot begins at 17:40: it stays empty until 17:42:31, so the timer's
            // free-slot check has nothing to test yet and can not complete the activity in a loop
            const start = at(17, 38);
            for (let now = start; now <= at(17, 42, 30); now++) {
                expect(GetActivitySlot(start, now).duration).toBe(0);
            }
            expect(GetActivitySlot(start, at(17, 42, 31)).duration).toBe(MIN_TIME_MINUTES);
        });
    });

    describe('refusing a busy slot', () => {
        it('should refuse a GO inside a running activity', () => {
            const running = saved(at(17, 0), 60);
            expect(canStartAt(at(17, 38, 30), [running])).toBe(false);
            expect(canStartAt(at(17, 36), [running])).toBe(false);
        });

        it('should accept a GO when the next activity leaves the shortest slot free', () => {
            const planned = saved(at(17, 45), 60);
            expect(canStartAt(at(17, 38, 30), [planned])).toBe(true);
        });

        it('should refuse a GO when the next activity starts before the shortest slot ends', () => {
            const planned = saved(at(17, 40), 60);
            expect(canStartAt(at(17, 38, 30), [planned])).toBe(false);
        });
    });
});

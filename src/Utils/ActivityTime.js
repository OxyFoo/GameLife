import { RoundTimeTo } from 'Utils/Time';

/** Activities live on a 5 minutes grid: every start, end and duration is a multiple of it */
const TIME_STEP_MINUTES = 5;
const MIN_TIME_MINUTES = 1 * TIME_STEP_MINUTES; // 5m
const MAX_TIME_MINUTES = 72 * TIME_STEP_MINUTES; // 6h

/**
 * Snap an instant on the grid of the saved activities. Every slot check must go through it:
 * an activity stopped at 17:38 is saved until 17:40, so a new one started at 17:38 has to be
 * checked (and saved) at 17:40 too, otherwise its slot reads as busy while it is free.
 * @param {number} time Time in seconds (unix timestamp, UTC)
 * @returns {number} Time in seconds, snapped to the nearest step
 */
function RoundActivityTime(time) {
    return RoundTimeTo(TIME_STEP_MINUTES, time, 'near');
}

/**
 * Slot an activity running from `startTime` to `endTime` occupies once saved.
 * `RoundActivityTime` never decreases, so the slot of an activity started after another one was
 * stopped always begins at or after the end of that one: slots may touch, never overlap.
 * @param {number} startTime Time in seconds (unix timestamp, UTC)
 * @param {number} endTime Time in seconds (unix timestamp, UTC)
 * @returns {{ startTime: number, duration: number }} Start in seconds, duration in minutes (0 if too short)
 */
function GetActivitySlot(startTime, endTime) {
    const start = RoundActivityTime(startTime);
    const end = RoundActivityTime(endTime);
    return { startTime: start, duration: (end - start) / 60 };
}

export { TIME_STEP_MINUTES, MIN_TIME_MINUTES, MAX_TIME_MINUTES, RoundActivityTime, GetActivitySlot };

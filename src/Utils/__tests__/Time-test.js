import { DAY_TIME, GetWeekIndex, GetWeekEndTime } from '../Time';
import { FormatDurationShort } from '../Date';

/**
 * Unix timestamp (seconds) of a UTC date
 * @param {number} year
 * @param {number} month 1-12
 * @param {number} day
 * @param {number} [hour]
 * @param {number} [minute]
 */
const utc = (year, month, day, hour = 0, minute = 0) => Date.UTC(year, month - 1, day, hour, minute) / 1000;

describe('[Utils] Time', () => {
    describe('GetWeekIndex / GetWeekEndTime', () => {
        // 2026-09-07 is a Monday (checked with getUTCDay in the first test)
        const mondayUTC = utc(2026, 9, 7);

        it('should rely on a Monday', () => {
            expect(new Date(mondayUTC * 1000).getUTCDay()).toBe(1);
        });

        it('should start the week on Monday 00:00 UTC in timezone 0', () => {
            expect(GetWeekIndex(mondayUTC - 60, 0)).toBe(GetWeekIndex(mondayUTC, 0) - 1);
            expect(GetWeekIndex(mondayUTC, 0)).toBe(GetWeekIndex(mondayUTC + 6 * DAY_TIME + 86399, 0));
            expect(GetWeekEndTime(GetWeekIndex(mondayUTC - 60, 0), 0)).toBe(mondayUTC);
        });

        it('should start the week on the local Monday 00:00 in a positive timezone', () => {
            // Monday 00:00 in Paris (UTC+2) is Sunday 22:00 UTC
            const mondayParis = utc(2026, 9, 6, 22, 0);
            expect(GetWeekIndex(mondayParis - 60, 2)).toBe(GetWeekIndex(mondayParis, 2) - 1);
            expect(GetWeekEndTime(GetWeekIndex(mondayParis - 60, 2), 2)).toBe(mondayParis);
            // Still Sunday in UTC
            expect(GetWeekIndex(mondayParis, 0)).toBe(GetWeekIndex(mondayParis, 2) - 1);
        });

        it('should start the week on the local Monday 00:00 in a negative timezone', () => {
            // Monday 00:00 in New York (UTC-5) is Monday 05:00 UTC
            const mondayNY = utc(2026, 9, 7, 5, 0);
            expect(GetWeekIndex(mondayNY - 60, -5)).toBe(GetWeekIndex(mondayNY, -5) - 1);
            expect(GetWeekEndTime(GetWeekIndex(mondayNY - 60, -5), -5)).toBe(mondayNY);
        });

        it('should place the epoch Thursday in week 0, starting Monday 1969-12-29', () => {
            expect(GetWeekIndex(0, 0)).toBe(0);
            expect(GetWeekEndTime(0, 0)).toBe(utc(1970, 1, 5));
        });
    });

    describe('FormatDurationShort', () => {
        it('should show days and hours', () => {
            expect(FormatDurationShort(3 * DAY_TIME + 4 * 3600 + 30 * 60)).toBe('3 j 4 h');
        });

        it('should omit empty parts', () => {
            expect(FormatDurationShort(3 * DAY_TIME)).toBe('3 j');
            expect(FormatDurationShort(2 * 3600)).toBe('2 h');
        });

        it('should show hours and minutes, or minutes only', () => {
            expect(FormatDurationShort(5 * 3600 + 12 * 60 + 59)).toBe('5 h 12 m');
            expect(FormatDurationShort(45 * 60)).toBe('45 m');
        });

        it('should floor to the minute and clamp negatives to zero', () => {
            expect(FormatDurationShort(59)).toBe('0 m');
            expect(FormatDurationShort(-500)).toBe('0 m');
        });
    });
});

import dataManager from 'Managers/DataManager';
import Activities from '../index';
import { GetLocalDayIndex } from '../utils';
import DynamicVar from 'Utils/DynamicVar';
import { GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 */

const DAY_TIME = 24 * 60 * 60;

/** Activities are stamped with a UTC+2 timezone (Paris in summer) */
const TIMEZONE = 2;

/** Local day index of 2025-08-30: in the past of the pinned clock below, so activities are granted */
const DAY = 20330;

/**
 * Candidates (additions, editions) are stamped with the device timezone and the current time, so
 * the clock is pinned: the tests then hold whatever the real date and timezone are.
 * Reference: local noon of a day well after the first settled one.
 */
const DEVICE_TZ = Math.round(GetTimeZone());
const TODAY = DAY + 40;
const YESTERDAY = TODAY - 1;
const NOW = TODAY * DAY_TIME + 12 * 3600 - DEVICE_TZ * 3600;

const SKILL_XP = 1;
const SKILL_NO_XP = 2;

/** Only the fields read by Activities/Skills are meaningful here */
const SKILLS = /** @type {any} */ ([
    { ID: SKILL_XP, Enabled: true, Name: { fr: 'Sport', en: 'Sport' }, XP: 100, CategoryID: 1 },
    { ID: SKILL_NO_XP, Enabled: true, Name: { fr: 'Repos', en: 'Rest' }, XP: 0, CategoryID: 1 }
]);

let nextID = 1;

/**
 * Build a saved activity starting at a local hour of a local day (timezone UTC+2),
 * added one minute after its start (so within the 48h limit)
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration In minutes
 * @param {number} [skillID]
 * @returns {ActivitySaved}
 */
const at = (dayIndex, hourLocal, duration, skillID = SKILL_XP) => {
    const startTime = dayIndex * DAY_TIME + hourLocal * 3600 - TIMEZONE * 3600;
    return {
        ID: nextID++,
        skillID,
        startTime,
        duration,
        comment: '',
        timezone: TIMEZONE,
        addedType: 'normal',
        addedTime: startTime + 60,
        friends: [],
        notifyBefore: null
    };
};

/**
 * Saved activity on a local day of the device timezone, added one minute after its start
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration
 * @param {number} [skillID]
 * @returns {ActivitySaved}
 */
const savedAt = (dayIndex, hourLocal, duration, skillID = SKILL_XP) => {
    const startTime = dayIndex * DAY_TIME + hourLocal * 3600 - DEVICE_TZ * 3600;
    return { ...at(dayIndex, hourLocal, duration, skillID), startTime, timezone: DEVICE_TZ, addedTime: startTime + 60 };
};

/**
 * Activity being previewed in the add activity screen: not saved yet, `addedTime` is 0
 * (see AddActivity/back.js); stamped by the preview with the device timezone and now
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration
 * @param {number} [skillID]
 * @returns {Activity}
 */
const candidate = (dayIndex, hourLocal, duration, skillID = SKILL_XP) => {
    const { ID: _ID, ...activity } = savedAt(dayIndex, hourLocal, duration, skillID);
    return { ...activity, addedTime: 0 };
};

describe('[Data] Activities', () => {
    /** @type {Activities} */
    let activities;

    /** @type {any} */
    let user;

    beforeAll(() => {
        dataManager.skills.Load({ skills: SKILLS, skillIcons: [], skillCategories: [] });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.setSystemTime(new Date(NOW * 1000));

        user = {
            interface: { console: { AddLog: jest.fn(() => 1) } },
            informations: { ox: new DynamicVar(0), oxFreeSlotUntil: null },
            SaveLocal: jest.fn()
        };
        activities = new Activities(user);
        user.activities = activities;
    });

    /** @param {ActivitySaved[]} saved */
    const load = (saved) => activities.Load({ activities: saved });

    describe('GetUseful (12h/day limit)', () => {
        it('should keep activities up to exactly 12h a day', () => {
            const saved = [at(DAY, 8, 600), at(DAY, 18.5, 120)];
            load(saved);

            expect(activities.GetUseful()).toEqual(saved);
        });

        it('should drop the activity crossing 12h and every following one of the day', () => {
            const kept = at(DAY, 8, 600);
            const crossing = at(DAY, 18, 180);
            const wouldFitAlone = at(DAY, 22, 30);
            load([kept, crossing, wouldFitAlone]);

            expect(activities.GetUseful()).toEqual([kept]);
        });

        // Regression: the budget was reset on UTC days (00:00 UTC = 02:00 in Paris), not local days
        it('should reset the budget at local midnight, not at UTC midnight', () => {
            const evening = at(DAY, 8, 700);
            const afterLocalMidnight = at(DAY + 1, 0.5, 60);
            load([evening, afterLocalMidnight]);

            // Same UTC day (06:00Z and 22:30Z), but different local days
            expect(Math.floor(evening.startTime / DAY_TIME)).toBe(Math.floor(afterLocalMidnight.startTime / DAY_TIME));
            expect(GetLocalDayIndex(evening)).toBe(DAY);
            expect(GetLocalDayIndex(afterLocalMidnight)).toBe(DAY + 1);

            expect(activities.GetUseful()).toEqual([evening, afterLocalMidnight]);
        });

        it('should not consume the budget with skills without XP', () => {
            const saved = [at(DAY, 8, 720), at(DAY, 21, 60, SKILL_NO_XP)];
            load(saved);

            expect(activities.GetUseful()).toEqual(saved);
        });

        it('should ignore activities added more than 48h after their start', () => {
            const late = at(DAY, 8, 60);
            late.addedTime = late.startTime + 49 * 3600;
            load([late]);

            expect(activities.GetExperienceStatus(late)).toBe('beforeLimit');
            expect(activities.GetUseful()).toEqual([]);
        });
    });

    describe('GetOxReward', () => {
        it('should grant 1 ox per minute', () => {
            load([]);

            expect(activities.GetOxReward(candidate(YESTERDAY, 10, 60))).toBe(60);
            expect(activities.GetOxReward(candidate(YESTERDAY, 10, 5))).toBe(5);
        });

        it('should grant nothing for skills without XP', () => {
            load([]);

            expect(activities.GetOxReward(candidate(YESTERDAY, 10, 60, SKILL_NO_XP))).toBe(0);
        });

        it('should grant nothing once the 12h limit of the local day is reached', () => {
            load([savedAt(YESTERDAY, 8, 700)]);

            expect(activities.GetOxReward(candidate(YESTERDAY, 20, 20))).toBe(20);
            expect(activities.GetOxReward(candidate(YESTERDAY, 20, 60))).toBe(0);
            // Next local day: new budget
            expect(activities.GetOxReward(candidate(TODAY, 0, 60))).toBe(60);
        });

        it('should apply the limit chronologically and preview the net loss of the day', () => {
            load([savedAt(YESTERDAY, 12, 700)]);

            // The candidate is earlier in the day: it consumes the budget first and pushes the
            // 700-minute activity out of it (the day loses 640)
            expect(activities.GetOxReward(candidate(YESTERDAY, 8, 60))).toBe(60 - 700);
        });

        it('should preview an edition as the signed difference with the original', () => {
            const original = savedAt(YESTERDAY, 8, 700);
            load([original]);

            // Shortening the original: the day loses 600
            expect(activities.GetOxReward({ ...original, duration: 100 }, original)).toBe(-600);
            expect(activities.GetOxReward(candidate(YESTERDAY, 8, 100), original)).toBe(-600);
            // Adding a second activity at the same time: the original fills the budget first
            expect(activities.GetOxReward(candidate(YESTERDAY, 8, 100))).toBe(0);
        });

        it('should lose everything when a big edit re-stamps an activity older than 48h', () => {
            // Three days back: the re-stamped version is past the 48h limit
            const old = savedAt(YESTERDAY - 2, 8, 700);
            load([old]);

            expect(activities.GetOxReward({ ...old, duration: 600 }, old)).toBe(-700);
        });

        it('should grant nothing when added more than 48h after the start', () => {
            load([]);

            // The preview stamps the addition with now, like Add() does: three days back is
            // beyond the 48h limit
            expect(activities.GetOxReward(candidate(YESTERDAY - 2, 8, 60))).toBe(0);
        });
    });

    describe('ox quotes (deletions and editions)', () => {
        it('should quote the first deletion at base price and the next one at x1.5', () => {
            const a = at(DAY, 8, 100);
            const b = at(DAY + 1, 8, 200);
            load([a, b]);

            expect(activities.GetDeleteOxQuote(a)).toEqual({
                key: `id:${a.ID}`,
                delta: -100,
                cost: 100,
                penalty: 0,
                free: true,
                total: 100
            });

            expect(activities.Remove(a)).toBe('removed');
            expect(activities.oxFreeKey).toBe(`id:${a.ID}`);
            expect(activities.oxQuotedDelta).toBe(-100);

            // The slot is taken by the first confirmed deletion, even by a smaller one
            expect(activities.GetDeleteOxQuote(b)).toEqual({
                key: `id:${b.ID}`,
                delta: -200,
                cost: 200,
                penalty: 100,
                free: false,
                total: 300
            });
            expect(activities.Remove(b)).toBe('removed');
            expect(activities.oxQuotedDelta).toBe(-400);
        });

        it('should quote at x1.5 when the weekly slot was used (server value)', () => {
            const a = at(DAY, 8, 100);
            load([a]);
            user.informations.oxFreeSlotUntil = Math.floor(Date.now() / 1000) + 3600;

            expect(activities.GetDeleteOxQuote(a).total).toBe(150);
            expect(activities.IsOxSlotAvailable()).toBe(false);
        });

        it('should quote an edition as a signed difference, gains never costing', () => {
            const a = savedAt(YESTERDAY, 8, 300);
            load([a]);

            const longer = activities.GetEditOxQuote(a, { ...a, duration: 400 });
            expect([longer.delta, longer.cost, longer.total]).toEqual([100, 0, 0]);

            const shorter = activities.GetEditOxQuote(a, { ...a, duration: 200 });
            expect([shorter.delta, shorter.cost, shorter.free, shorter.total]).toEqual([-100, 100, true, 100]);
        });

        it('should never charge a pending addition (not synced yet)', () => {
            load([]);
            const { activity } = activities.Add(candidate(YESTERDAY, 8, 60));
            expect(activity).not.toBeNull();
            if (activity === null) return;

            const remove = activities.GetDeleteOxQuote(activity);
            expect([remove.key, remove.total]).toEqual([null, 0]);

            const shorten = activities.GetEditOxQuote(activity, { ...activity, duration: 30 });
            expect(shorten.cost).toBe(0);
        });

        it('should block costly operations only while the balance is negative', () => {
            const a = at(DAY, 8, 100);
            load([a]);

            user.informations.ox.Set(-1);
            expect(activities.IsOxOperationBlocked(activities.GetDeleteOxQuote(a))).toBe(true);
            expect(
                activities.IsOxOperationBlocked({ key: null, delta: 0, cost: 0, penalty: 0, free: false, total: 0 })
            ).toBe(false);

            user.informations.ox.Set(0);
            expect(activities.IsOxOperationBlocked(activities.GetDeleteOxQuote(a))).toBe(false);
        });

        it('should restore the activity and forget the quote when the pending operations are discarded', () => {
            const a = at(DAY, 8, 100);
            load([a]);

            activities.Remove(a);
            expect(activities.Get().length).toBe(0);

            activities.DiscardPendingOxOperations();
            expect(activities.Get().length).toBe(1);
            expect(activities.oxQuotedDelta).toBeNull();
            expect(activities.oxFreeKey).toBeNull();
        });
    });
});

import dataManager from 'Managers/DataManager';
import Activities from '../index';
import { GetLocalDayIndex } from '../utils';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 */

const DAY_TIME = 24 * 60 * 60;

/** Activities are stamped with a UTC+2 timezone (Paris in summer) */
const TIMEZONE = 2;

/** Local day index of 2025-08-30: in the past, so activities are granted */
const DAY = 20330;

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
 * Activity being previewed in the add activity screen: not saved yet, `addedTime` is 0
 * (see AddActivity/back.js)
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration
 * @param {number} [skillID]
 * @returns {Activity}
 */
const candidate = (dayIndex, hourLocal, duration, skillID = SKILL_XP) => {
    const { ID: _ID, ...activity } = at(dayIndex, hourLocal, duration, skillID);
    return { ...activity, addedTime: 0 };
};

describe('[Data] Activities', () => {
    /** @type {Activities} */
    let activities;

    beforeAll(() => {
        dataManager.skills.Load({ skills: SKILLS, skillIcons: [], skillCategories: [] });
    });

    beforeEach(() => {
        jest.clearAllMocks();

        const user = /** @type {any} */ ({ interface: { console: { AddLog: jest.fn(() => 1) } } });
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

            expect(activities.GetOxReward(candidate(DAY, 10, 60))).toBe(60);
            expect(activities.GetOxReward(candidate(DAY, 10, 5))).toBe(5);
        });

        it('should grant nothing for skills without XP', () => {
            load([]);

            expect(activities.GetOxReward(candidate(DAY, 10, 60, SKILL_NO_XP))).toBe(0);
        });

        it('should grant nothing once the 12h limit of the local day is reached', () => {
            load([at(DAY, 8, 700)]);

            expect(activities.GetOxReward(candidate(DAY, 20, 20))).toBe(20);
            expect(activities.GetOxReward(candidate(DAY, 20, 60))).toBe(0);
            // Next local day: new budget
            expect(activities.GetOxReward(candidate(DAY + 1, 0.5, 60))).toBe(60);
        });

        it('should apply the limit chronologically', () => {
            load([at(DAY, 12, 700)]);

            // The candidate is earlier in the day: it consumes the budget first
            expect(activities.GetOxReward(candidate(DAY, 8, 60))).toBe(60);
        });

        it('should exclude the edited activity from the day budget', () => {
            const original = at(DAY, 8, 700);
            load([original]);

            // Same object edited in place (same addedTime)
            expect(activities.GetOxReward({ ...original, duration: 100 })).toBe(100);
            // New object replacing the original
            expect(activities.GetOxReward(candidate(DAY, 8, 100), original)).toBe(100);
            // Without exclusion, the original would fill the budget
            expect(activities.GetOxReward(candidate(DAY, 8, 100))).toBe(0);
        });

        it('should grant nothing when added more than 48h after the start', () => {
            load([]);

            const late = candidate(DAY, 8, 60);
            late.addedTime = late.startTime + 49 * 3600;

            expect(activities.GetOxReward(late)).toBe(0);
        });
    });
});

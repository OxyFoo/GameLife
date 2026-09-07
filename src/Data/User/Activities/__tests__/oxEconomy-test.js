import {
    AdBonusOx,
    DAY_TIME,
    DueOxForDay,
    GetLocalDayIndex,
    MarginalOxOfActivity,
    PenaltyFor,
    SimulateBatch
} from '../oxEconomy';

/**
 * @typedef {import('../oxEconomy').OxActivity} OxActivity
 * @typedef {import('../oxEconomy').OxBatchInput} OxBatchInput
 */

/* Scenario table shared with the server test suite (GameLife-Server/src/Services/GameLife/__tests__/OxEconomy.test.ts) */

const TIMEZONE = 2;
const START_DAY = 20000;
const DAY = START_DAY + 5;
const NOW = (START_DAY + 20) * DAY_TIME;
const SKILL_XP = 1;
const SKILL_NO_XP = 2;

/** @param {number} skillID */
const xpOfSkill = (skillID) => (skillID === SKILL_NO_XP ? 0 : 100);

let nextID = 1;

/**
 * Saved activity at a local hour of a local day (UTC+2), added one minute after its start
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration
 * @param {number} [skillID]
 * @returns {OxActivity}
 */
const at = (dayIndex, hourLocal, duration, skillID = SKILL_XP) => {
    const startTime = dayIndex * DAY_TIME + hourLocal * 3600 - TIMEZONE * 3600;
    return { id: nextID++, skillID, startTime, duration, timezone: TIMEZONE, addedTime: startTime + 60 };
};

/**
 * Not saved yet
 * @param {number} dayIndex
 * @param {number} hourLocal
 * @param {number} duration
 * @param {number} [skillID]
 * @returns {OxActivity}
 */
const pending = (dayIndex, hourLocal, duration, skillID = SKILL_XP) => ({
    ...at(dayIndex, hourLocal, duration, skillID),
    id: null
});

/**
 * @param {Partial<OxBatchInput>} partial
 * @returns {OxBatchInput}
 */
const batch = (partial) => ({
    state: [],
    additions: [],
    editions: [],
    deletions: [],
    now: NOW,
    slotAvailable: true,
    legacy: false,
    xpOfSkill,
    startDay: START_DAY,
    ...partial
});

/**
 * ID of an activity built by `at` (always saved, so never null)
 * @param {OxActivity} activity
 * @returns {number}
 */
const idOf = (activity) => /** @type {number} */ (activity.id);

describe('[Data] oxEconomy', () => {
    describe('GetLocalDayIndex', () => {
        it('should use the rounded timezone (tinyint column)', () => {
            const a = at(DAY, 23.75, 30);
            expect(GetLocalDayIndex({ ...a, timezone: 5.5 })).toBe(GetLocalDayIndex({ ...a, timezone: 6 }));
        });
    });

    describe('DueOxForDay', () => {
        it('should keep activities up to exactly 12h', () => {
            expect(DueOxForDay([at(DAY, 8, 600), at(DAY, 18.5, 120)], NOW, xpOfSkill)).toBe(720);
        });
        it('should drop the overflowing activity and every following one', () => {
            expect(DueOxForDay([at(DAY, 8, 600), at(DAY, 18, 180), at(DAY, 22, 30)], NOW, xpOfSkill)).toBe(600);
        });
        it('should ignore skills without XP for the budget and the due', () => {
            expect(DueOxForDay([at(DAY, 8, 720), at(DAY, 21, 60, SKILL_NO_XP)], NOW, xpOfSkill)).toBe(720);
        });
        it('should ignore future activities and late additions', () => {
            const late = at(DAY, 8, 60);
            late.addedTime = late.startTime + 49 * 3600;
            const future = at(START_DAY + 25, 8, 60);
            expect(DueOxForDay([late, future], NOW, xpOfSkill)).toBe(0);
        });
    });

    describe('MarginalOxOfActivity', () => {
        it('is the duration when the day is far from the budget', () => {
            const a = at(DAY, 8, 60);
            const b = at(DAY, 12, 90);
            expect(MarginalOxOfActivity([a, b], idOf(a), NOW, xpOfSkill)).toBe(60);
        });

        it('is 0 for a skill without XP', () => {
            const a = at(DAY, 8, 60, SKILL_NO_XP);
            const b = at(DAY, 12, 90);
            expect(MarginalOxOfActivity([a, b], idOf(a), NOW, xpOfSkill)).toBe(0);
        });

        it('is 0 for an activity that has not started yet', () => {
            const future = at(DAY + 30, 8, 60);
            expect(MarginalOxOfActivity([future], idOf(future), NOW, xpOfSkill)).toBe(0);
        });

        it('is 0 for an activity added more than 48h after its start', () => {
            const late = at(DAY, 8, 60);
            late.addedTime = late.startTime + 49 * 3600;
            expect(MarginalOxOfActivity([late], idOf(late), NOW, xpOfSkill)).toBe(0);
        });

        it('is 0 for the activity that overflows the 12h budget', () => {
            const full = at(DAY, 6, 720);
            const overflow = at(DAY, 20, 60);
            expect(MarginalOxOfActivity([full, overflow], idOf(overflow), NOW, xpOfSkill)).toBe(0);
        });

        it('is below its duration when removing it lets a later activity fit back in', () => {
            // 700 + 60 -> the 60 overflows (760 > 720). Without the 700, the 60 fits: due 60.
            // The morning activity is thus worth 700 - 60 = 640, not its 700 minutes.
            const morning = at(DAY, 6, 700);
            const evening = at(DAY, 20, 60);
            expect(DueOxForDay([morning, evening], NOW, xpOfSkill)).toBe(700);
            expect(MarginalOxOfActivity([morning, evening], idOf(morning), NOW, xpOfSkill)).toBe(640);
        });

        it('is 0 when the ID is absent from the day', () => {
            const a = at(DAY, 8, 60);
            expect(MarginalOxOfActivity([a], 999999, NOW, xpOfSkill)).toBe(0);
        });

        it('never lets the marginals of a day exceed its due', () => {
            const rows = [at(DAY, 6, 300), at(DAY, 12, 300), at(DAY, 18, 300), at(DAY, 22, 60)];
            const due = DueOxForDay(rows, NOW, xpOfSkill);
            const sum = rows.reduce((total, r) => total + MarginalOxOfActivity(rows, idOf(r), NOW, xpOfSkill), 0);
            expect(sum).toBeLessThanOrEqual(due);
        });
    });

    describe('AdBonusOx', () => {
        it('is half of what the activity brought: the activity pays 1.5x', () => {
            expect(AdBonusOx(30)).toBe(15);
            expect(AdBonusOx(600)).toBe(300);
        });

        it('rounds a half ox up, like PenaltyFor does on the other side', () => {
            expect(AdBonusOx(25)).toBe(13);
        });

        it('is 0 when the activity brought nothing', () => {
            expect(AdBonusOx(0)).toBe(0);
        });

        it('is never negative', () => {
            expect(AdBonusOx(-10)).toBe(0);
        });
    });

    describe('PenaltyFor', () => {
        it('should add 50% rounded up', () => {
            expect(PenaltyFor(600)).toBe(300);
            expect(PenaltyFor(5)).toBe(3);
            expect(PenaltyFor(0)).toBe(0);
        });
    });

    describe('SimulateBatch', () => {
        it('S1 simple deletion at base price', () => {
            const a = at(DAY, 8, 600);
            const r = SimulateBatch(batch({ state: [a], deletions: [a] }));
            expect(r.ops[0]).toEqual({
                kind: 'delete',
                key: `id:${a.id}`,
                delta: -600,
                cost: 600,
                penalty: 0,
                free: true
            });
            expect(r.ledgerByDay.get(DAY)).toBe(-600);
            expect(r.totalDelta).toBe(-600);
            expect(r.slotConsumed).toBe(true);
        });

        it('S2 deletion letting a later activity re-enter the budget (net loss)', () => {
            const a = at(DAY, 8, 600);
            const b = at(DAY, 12, 200);
            const r = SimulateBatch(batch({ state: [a, b], deletions: [a] }));
            expect(r.ops[0].delta).toBe(-400);
            expect(r.ops[0].cost).toBe(400);
            expect(r.ledgerByDay.get(DAY)).toBe(-400);
        });

        it('S3 shortening costs the removed minutes', () => {
            const a = at(DAY, 8, 600);
            const r = SimulateBatch(batch({ state: [a], editions: [{ prev: a, next: { ...a, duration: 300 } }] }));
            expect(r.ops[0].delta).toBe(-300);
            expect(r.ops[0].cost).toBe(300);
            expect(r.ops[0].free).toBe(true);
        });

        it('S4 lengthening credits, is not costly and does not take the slot', () => {
            const a = at(DAY, 8, 300);
            const r = SimulateBatch(batch({ state: [a], editions: [{ prev: a, next: { ...a, duration: 600 } }] }));
            expect(r.ops[0].delta).toBe(300);
            expect(r.ops[0].cost).toBe(0);
            expect(r.ops[0].free).toBe(false);
            expect(r.slotConsumed).toBe(false);
            expect(r.totalDelta).toBe(300);
        });

        it('S5 moving to another day is a zero net', () => {
            const a = at(DAY, 8, 600);
            const moved = { ...a, startTime: a.startTime + DAY_TIME };
            const r = SimulateBatch(batch({ state: [a], editions: [{ prev: a, next: moved }] }));
            expect(r.ops[0].delta).toBe(0);
            expect(r.ledgerByDay.get(DAY)).toBe(-600);
            expect(r.ledgerByDay.get(DAY + 1)).toBe(600);
            expect(r.totalDelta).toBe(0);
        });

        it('S6 an edit re-stamped more than 48h after the start loses everything', () => {
            const a = at(DAY, 8, 600);
            const r = SimulateBatch(
                batch({ state: [a], editions: [{ prev: a, next: { ...a, duration: 650, addedTime: NOW } }] })
            );
            expect(r.ops[0].delta).toBe(-600);
            expect(r.ops[0].cost).toBe(600);
        });

        it('S7 an addition can push a later activity out of the budget (negative addition, no penalty)', () => {
            const x = at(DAY, 8, 360);
            const y = at(DAY, 14, 300);
            const n = pending(DAY, 6, 90);
            const r = SimulateBatch(batch({ state: [x, y], additions: [n], slotAvailable: false }));
            expect(r.ops[0].kind).toBe('add');
            expect(r.ops[0].delta).toBe(-210);
            expect(r.ops[0].cost).toBe(210);
            expect(r.ops[0].penalty).toBe(0);
            expect(r.totalCost).toBe(0);
            expect(r.additionsLoss).toBe(210);
            expect(r.totalDelta).toBe(-210);
        });

        it('S8 canonical order and largest cost takes the slot, whatever the input order', () => {
            const a = at(DAY, 10, 600);
            const c = at(DAY + 1, 20, 100);
            const d = at(DAY + 2, 20, 80);
            const edits = [
                { prev: c, next: { ...c, duration: 50 } },
                { prev: d, next: { ...d, duration: 40 } }
            ];
            /** @param {number} order */
            const run = (order) => {
                const r = SimulateBatch(
                    batch({
                        state: [a, c, d],
                        editions: order === 0 ? edits : [...edits].reverse(),
                        deletions: [a]
                    })
                );
                const del = r.ops.find((o) => o.kind === 'delete');
                return [r.totalPenalty, r.totalDelta, del?.free];
            };
            // The deletion (600) is the largest cost: it is free, both edits are penalised
            expect(run(0)).toEqual([25 + 20, -690 - 45, true]);
            expect(run(1)).toEqual(run(0));
        });

        it('S9 slot already used: every costly operation is penalised', () => {
            const a = at(DAY, 10, 600);
            const c = at(DAY + 1, 20, 100);
            const r = SimulateBatch(
                batch({
                    state: [a, c],
                    editions: [{ prev: c, next: { ...c, duration: 50 } }],
                    deletions: [a],
                    slotAvailable: false
                })
            );
            expect(r.totalPenalty).toBe(300 + 25);
            expect(r.totalDelta).toBe(-650 - 325);
            expect(r.slotConsumed).toBe(false);
        });

        it('S10 penalty rounds up', () => {
            const a = at(DAY, 10, 5);
            const r = SimulateBatch(batch({ state: [a], deletions: [a], slotAvailable: false }));
            expect(r.ops[0].penalty).toBe(3);
        });

        it('S11 legacy: credits only, deletions are clamped, no penalty, no slot', () => {
            const a = at(DAY, 10, 600);
            const n = pending(DAY + 1, 8, 100);
            const r = SimulateBatch(batch({ state: [a], deletions: [a], additions: [n], legacy: true }));
            expect(r.ledgerByDay.get(DAY)).toBe(0);
            expect(r.ledgerByDay.get(DAY + 1)).toBe(100);
            expect(r.totalPenalty).toBe(0);
            expect(r.totalDelta).toBe(100);
            expect(r.slotConsumed).toBe(false);
        });

        it('S12 days before the start day (tests only) are ignored', () => {
            const old = at(START_DAY - 1, 10, 600);
            const r = SimulateBatch(batch({ state: [old], deletions: [old] }));
            expect(r.ops[0].delta).toBe(0);
            expect(r.ops[0].cost).toBe(0);
            expect(r.ops[0].free).toBe(false);
            expect(r.ledgerByDay.size).toBe(0);
        });

        it('S13 a future activity costs nothing', () => {
            const f = at(START_DAY + 25, 10, 600);
            const r = SimulateBatch(batch({ state: [f], deletions: [f] }));
            expect(r.ops[0].cost).toBe(0);
            expect(r.slotConsumed).toBe(false);
        });

        it('S15 the operation confirmed first at base price keeps the slot (freeKey), whatever its size', () => {
            const a = at(DAY, 10, 600);
            const c = at(DAY + 1, 20, 100);
            const r = SimulateBatch(
                batch({
                    state: [a, c],
                    editions: [{ prev: c, next: { ...c, duration: 50 } }],
                    deletions: [a],
                    freeKey: `id:${c.id}`
                })
            );
            const edit = r.ops.find((o) => o.kind === 'edit');
            const del = r.ops.find((o) => o.kind === 'delete');
            expect(edit?.free).toBe(true);
            expect(del?.free).toBe(false);
            expect(del?.penalty).toBe(300);
            expect(r.totalDelta).toBe(-650 - 300);
        });

        it('S16 an invalid freeKey falls back to the largest cost', () => {
            const a = at(DAY, 10, 600);
            const c = at(DAY + 1, 20, 100);
            const r = SimulateBatch(
                batch({
                    state: [a, c],
                    editions: [{ prev: c, next: { ...c, duration: 50 } }],
                    deletions: [a],
                    freeKey: 'id:999'
                })
            );
            expect(r.ops.find((o) => o.kind === 'delete')?.free).toBe(true);
            expect(r.totalPenalty).toBe(25);
        });

        it('S14 deleting an unknown or already deleted ID is a no-op', () => {
            const a = at(DAY, 10, 600);
            const r = SimulateBatch(batch({ state: [], deletions: [a, a] }));
            expect(r.totalDelta).toBe(0);
            expect(r.totalCost).toBe(0);
        });
    });
});

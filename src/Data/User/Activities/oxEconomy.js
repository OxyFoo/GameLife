/**
 * Pure rules of the activity ox economy — no I/O, deterministic.
 *
 * Mirror of the server module (GameLife-Server/src/Services/GameLife/OxEconomy.ts): both must
 * stay identical so that the price shown before an operation equals the amount the server
 * applies. The server is authoritative; the app only previews.
 *
 * - An activity grants 1 ox per minute iff it grants XP: skill with XP, added at most 48h after
 *   its start, already started, and within the 12h all-or-nothing chronological budget of its
 *   local day.
 * - Deleting or editing an activity settles the ox difference. The first costly operation of the
 *   week (Monday 00:00 UTC) is at base price, every following one costs 50% more (rounded up).
 * - Additions never take a penalty nor the weekly slot, but their signed net is applied (an early
 *   activity can push a later one out of the 12h budget).
 */

const DAY_TIME = 24 * 60 * 60;
const MAX_HOUR_PER_DAY = 12;
const MAX_MINUTES_PER_DAY = MAX_HOUR_PER_DAY * 60;
const HOURS_BEFORE_LIMIT = 48;
const OX_PER_MINUTE = 1;

/**
 * @typedef {object} OxActivity
 * @property {number | null} id Database ID, null for an activity not saved yet
 * @property {number} skillID
 * @property {number} startTime Unix timestamp in seconds
 * @property {number} duration Minutes
 * @property {number} timezone Hours (rounded before use: the database column is a tinyint)
 * @property {number} addedTime Unix timestamp in seconds
 *
 * @typedef {'add' | 'edit' | 'delete'} OxOpKind
 *
 * @typedef {object} OxEdition
 * @property {OxActivity} prev
 * @property {OxActivity} next
 *
 * @typedef {object} OxBatchInput
 * @property {OxActivity[]} state Activities as the server holds them before the batch
 * @property {OxActivity[]} additions
 * @property {OxEdition[]} editions
 * @property {OxActivity[]} deletions
 * @property {number} now Unix timestamp in seconds (a preview may push it forward so that a planned activity counts)
 * @property {boolean} slotAvailable Whether the weekly base-price slot is still available
 * @property {boolean} legacy Old app: credits only, no penalty, no slot
 * @property {string | null} [freeKey] Costly edition/deletion the user confirmed at base price (first confirmed while the slot was available); takes the slot when costly, otherwise the largest cost does
 * @property {(skillID: number) => number} xpOfSkill
 * @property {number} [startDay] First local day taken into account (tests only; every day counts by default)
 *
 * @typedef {object} OxOpResult
 * @property {OxOpKind} kind
 * @property {string} key
 * @property {number} delta Signed ox change of the operation (before penalty)
 * @property {number} cost max(0, -delta)
 * @property {number} penalty x0.5 of the cost when the weekly slot is not available for this operation
 * @property {boolean} free This operation took the weekly base-price slot
 *
 * @typedef {object} OxBatchResult
 * @property {OxOpResult[]} ops
 * @property {Map<number, number>} ledgerByDay Signed ox change per local day (legacy: clamped to >= 0)
 * @property {Map<number, number>} dueAfterByDay Ox due per touched local day after the batch
 * @property {number} totalCost Sum of the costs of the editions and deletions (negative-balance guard); additions are never blocked
 * @property {number} additionsLoss Sum of the losses caused by additions (an early activity pushing a later one out of the 12h budget)
 * @property {number} totalPenalty
 * @property {number} totalDelta Change to apply to the balance: sum of ledgerByDay minus totalPenalty
 * @property {boolean} slotConsumed A costly edition/deletion took the weekly slot in this batch
 */

/**
 * Local day index (days since epoch) in the activity's own timezone
 * @param {Pick<OxActivity, 'startTime' | 'timezone'>} activity
 * @returns {number}
 */
function GetLocalDayIndex(activity) {
    return Math.floor((activity.startTime + Math.round(activity.timezone) * 3600) / DAY_TIME);
}

/**
 * Added at most 48h after its start, and already started
 * @param {Pick<OxActivity, 'startTime' | 'addedTime'>} activity
 * @param {number} now
 * @returns {boolean}
 */
function DoesGrantXP(activity, now) {
    const deltaHours = (activity.addedTime - activity.startTime) / 3600;
    return deltaHours <= HOURS_BEFORE_LIMIT && activity.startTime <= now;
}

/**
 * Ox due for one local day: 1 ox per minute of XP-granting activities, 12h budget consumed by
 * skills with XP, chronological and all-or-nothing (the activity that overflows and every
 * following one of the day grant nothing).
 * @param {OxActivity[]} rows Activities of that day, any order
 * @param {number} now
 * @param {(skillID: number) => number} xpOfSkill
 * @returns {number}
 */
function DueOxForDay(rows, now, xpOfSkill) {
    const sorted = [...rows].sort((a, b) => a.startTime - b.startTime || a.addedTime - b.addedTime);

    let minutesRemain = MAX_MINUTES_PER_DAY;
    let due = 0;

    for (const activity of sorted) {
        if (!DoesGrantXP(activity, now)) {
            continue;
        }
        if (xpOfSkill(activity.skillID) <= 0) {
            continue;
        }

        minutesRemain -= activity.duration;
        if (minutesRemain < 0) {
            continue;
        }

        due += activity.duration * OX_PER_MINUTE;
    }

    return due;
}

/**
 * Extra cost of a costly operation beyond the weekly slot: +50%, rounded up
 * @param {number} cost
 * @returns {number}
 */
function PenaltyFor(cost) {
    return Math.ceil(cost / 2);
}

/**
 * Identity of an activity inside a batch: its ID when saved, its (start, added) stamp otherwise
 * @param {OxActivity} activity
 * @returns {string}
 */
function KeyOf(activity) {
    return activity.id !== null ? `id:${activity.id}` : `add:${activity.startTime}:${activity.addedTime}`;
}

/**
 * Simulate a batch of additions, editions and deletions and attribute to every operation its
 * signed ox change, its cost and its penalty. Pure: nothing is written.
 *
 * Canonical order (independent of the order the user performed them): additions sorted by
 * (startTime, addedTime), then editions sorted by ID, then deletions sorted by ID.
 * The weekly slot goes to the costly edition/deletion designated by `freeKey` (the first one the
 * user confirmed at base price), or to the largest cost when no valid key is given (ties: first).
 * @param {OxBatchInput} input
 * @returns {OxBatchResult}
 */
function SimulateBatch(input) {
    const { now, xpOfSkill, legacy } = input;
    const startDay = input.startDay ?? 0;

    /** @type {Map<string, OxActivity>} Working state, keyed by activity identity */
    const working = new Map();
    for (const activity of input.state) {
        working.set(KeyOf(activity), activity);
    }

    /** @param {number} day */
    const dueOf = (day) => {
        /** @type {OxActivity[]} */
        const rows = [];
        for (const activity of working.values()) {
            if (GetLocalDayIndex(activity) === day) {
                rows.push(activity);
            }
        }
        return DueOxForDay(rows, now, xpOfSkill);
    };

    /** @typedef {{ kind: OxOpKind, key: string, prev: OxActivity | null, next: OxActivity | null }} Op */

    /** @type {Op[]} */
    const ops = [
        ...[...input.additions]
            .sort((a, b) => a.startTime - b.startTime || a.addedTime - b.addedTime)
            .map((next) => /** @type {Op} */ ({ kind: 'add', key: KeyOf(next), prev: null, next })),
        ...[...input.editions]
            .sort((a, b) => (a.prev.id ?? 0) - (b.prev.id ?? 0))
            .map(
                (e) =>
                    /** @type {Op} */ ({
                        kind: 'edit',
                        key: KeyOf(e.prev),
                        prev: e.prev,
                        next: { ...e.next, id: e.prev.id }
                    })
            ),
        ...[...input.deletions]
            .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
            .map((prev) => /** @type {Op} */ ({ kind: 'delete', key: KeyOf(prev), prev, next: null }))
    ];

    /** @param {Op} op */
    const daysOf = (op) => {
        /** @type {Set<number>} */
        const days = new Set();
        if (op.prev !== null) days.add(GetLocalDayIndex(op.prev));
        if (op.next !== null) days.add(GetLocalDayIndex(op.next));
        return [...days].filter((day) => day >= startDay);
    };

    /** @type {Map<number, number>} Due of every touched day before the batch */
    const dueAtStart = new Map();
    for (const op of ops) {
        for (const day of daysOf(op)) {
            if (!dueAtStart.has(day)) {
                dueAtStart.set(day, dueOf(day));
            }
        }
    }

    /** @type {OxOpResult[]} */
    const results = [];

    for (const op of ops) {
        const days = daysOf(op);
        const before = days.reduce((sum, day) => sum + dueOf(day), 0);

        if (op.kind === 'add' && op.next !== null) {
            working.set(op.key, op.next);
        } else if (op.kind === 'edit' && op.next !== null) {
            working.delete(op.key);
            working.set(op.key, op.next);
        } else if (op.kind === 'delete') {
            working.delete(op.key);
        }

        const after = days.reduce((sum, day) => sum + dueOf(day), 0);
        const delta = after - before;

        results.push({ kind: op.kind, key: op.key, delta, cost: Math.max(0, -delta), penalty: 0, free: false });
    }

    // Weekly slot and penalties (editions and deletions only)
    let slotConsumed = false;
    if (!legacy) {
        const costly = results.filter((r) => r.kind !== 'add' && r.cost > 0);
        if (input.slotAvailable && costly.length > 0) {
            let best = costly.find((r) => r.key === input.freeKey) ?? null;
            if (best === null) {
                best = costly[0];
                for (const r of costly) {
                    if (r.cost > best.cost) best = r;
                }
            }
            best.free = true;
            slotConsumed = true;
        }
        for (const r of costly) {
            if (!r.free) {
                r.penalty = PenaltyFor(r.cost);
            }
        }
    }

    // Ledger per day: due after the batch minus due before (legacy: never negative)
    /** @type {Map<number, number>} */
    const ledgerByDay = new Map();
    /** @type {Map<number, number>} */
    const dueAfterByDay = new Map();
    for (const [day, due0] of dueAtStart) {
        const dueAfter = dueOf(day);
        const delta = dueAfter - due0;
        dueAfterByDay.set(day, dueAfter);
        ledgerByDay.set(day, legacy ? Math.max(0, delta) : delta);
    }

    let totalCost = 0;
    let additionsLoss = 0;
    let totalPenalty = 0;
    for (const r of results) {
        if (r.kind === 'add') {
            additionsLoss += r.cost;
        } else {
            totalCost += r.cost;
        }
        totalPenalty += r.penalty;
    }
    let ledgerSum = 0;
    for (const delta of ledgerByDay.values()) {
        ledgerSum += delta;
    }

    return {
        ops: results,
        ledgerByDay,
        dueAfterByDay,
        totalCost,
        additionsLoss,
        totalPenalty,
        totalDelta: ledgerSum - totalPenalty,
        slotConsumed
    };
}

export {
    DAY_TIME,
    MAX_HOUR_PER_DAY,
    MAX_MINUTES_PER_DAY,
    HOURS_BEFORE_LIMIT,
    OX_PER_MINUTE,
    GetLocalDayIndex,
    DoesGrantXP,
    DueOxForDay,
    PenaltyFor,
    KeyOf,
    SimulateBatch
};

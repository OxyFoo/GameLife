import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import {
    GetActivityIndex,
    GetMondayTimestamp,
    GetMonthStartTimestamp,
    GetYearStartTimestamp,
    TimeIsFree
} from './utils';
import { ComputeSkillFrequency, GetTodayLocalDayIndex, RATE_WINDOW_DAYS } from './skillFrequency';
import DynamicVar from 'Utils/DynamicVar';
import {
    KeyOf,
    MAX_HOUR_PER_DAY,
    MAX_MINUTES_PER_DAY,
    OX_PER_MINUTE,
    SimulateBatch,
    UsefulActivities
} from '@oxyfoo/gamelife-types/Rules/OxEconomy';
import { Round, SortByKey } from 'Utils/Functions';
import { DAY_TIME, GetDate, GetGlobalTime, GetLocalTime, GetMidnightTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').Skill} Skill
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').CurrentActivity} CurrentActivity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').SaveObject_Activities} SaveObject_Activities
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').LeaderboardPeriodType} LeaderboardPeriodType
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').LeaderboardUpdateData} LeaderboardUpdateData
 * @typedef {import('./skillFrequency').SkillFrequency} SkillFrequency
 * @typedef {import('@oxyfoo/gamelife-types/Rules/OxEconomy').OxActivity} OxActivity
 * @typedef {import('@oxyfoo/gamelife-types/Rules/OxEconomy').OxOpResult} OxOpResult
 * @typedef {import('@oxyfoo/gamelife-types/Rules/OxEconomy').OxBatchResult} OxBatchResult
 *
 * @typedef {{ kind: 'add', next: Activity } | { kind: 'edit', prev: Activity, next: Activity } | { kind: 'delete', prev: Activity }} OxCandidate
 *
 * @typedef {object} OxQuote
 * @property {string | null} key Identity of the operation in the batch (`id:<ID>`), null when it never reaches the server
 * @property {number} delta Signed ox change of the operation (before penalty)
 * @property {number} cost max(0, -delta)
 * @property {number} penalty Extra 50% when the weekly base-price slot is not available for it
 * @property {boolean} free This operation takes the weekly base-price slot
 * @property {number} total cost + penalty
 *
 * @typedef {'ox-negative' | 'ox-quote-changed' | null} SaveOnlineError
 *
 * @typedef {'grant' | 'isNotPast' | 'beforeLimit'} ActivityStatus
 * @typedef {'added' | 'notFree' | 'tooEarly'} AddStatus
 * @typedef {'edited' | 'needConfirmation' | 'notFree' | 'notExist' | 'tooEarly'} EditStatus
 * @typedef {'removed' | 'notExist'} RemoveStatus
 */

const HOURS_BEFORE_LIMIT = 48;

/** @type {Activity} */
const DEFAULT_ACTIVITY = {
    skillID: 0,
    startTime: 0,
    duration: 0,
    comment: '',
    timezone: 0,
    addedType: 'normal',
    addedTime: 0,
    friends: [],
    notifyBefore: null
};

/** @extends {IUserData<SaveObject_Activities>} */
class Activities extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('activities');

        this.#user = user;
    }

    /** @type {ActivitySaved[]} */
    #SAVED_activities = [];

    /** @type {ActivitySaved[]} */
    #UNSAVED_editions = [];

    /** @type {Activity[]} */
    #UNSAVED_activities = [];

    /** @type {number[]} */
    #UNSAVED_deletions = [];

    /** @type {number} Unix timestamp in seconds */
    #token = 0;

    /**
     * Server activities the local overlap check could not place (created from two devices
     * offline): hidden from the UI but still counted in the ox preview, as the server counts them
     * @type {ActivitySaved[]}
     */
    #SERVER_hidden = [];

    /**
     * Why the last SaveOnline was refused by the server, for the UI (null after a success)
     * @type {SaveOnlineError}
     */
    lastSaveOnlineError = null;

    /**
     * Operations (`id:<ID>`) the last refused save gave up on, so that a caller can tell whether
     * its own deletion or edition was cancelled or went through
     * @type {string[]}
     */
    lastDiscardedOxKeys = [];

    /**
     * Batch total (penalties included) the user confirmed for the pending costly operations,
     * frozen at confirmation and sent to the server, which refuses with 'ox-quote-changed' when it
     * would apply another amount. Null when no costly operation is pending.
     * @type {number | null}
     */
    oxQuotedDelta = null;

    /**
     * Pending edition/deletion (`id:<ID>`) quoted at base price: the first costly operation
     * confirmed while the weekly slot was available keeps it, whatever comes after.
     * @type {string | null}
     */
    oxFreeKey = null;

    /**
     * @description Contain all activities, updated when adding, editing or removing
     * @type {DynamicVar<(Activity | ActivitySaved)[]>}
     */
    allActivities = new DynamicVar(/** @type {(Activity | ActivitySaved)[]} */ ([]));

    /** @type {DynamicVar<CurrentActivity | null>} */
    currentActivity = new DynamicVar(/** @type {CurrentActivity | null} */ (null));

    #cache_get = {
        id: '',
        /** @type {(Activity | ActivitySaved)[]} */
        activities: []
    };

    #cache_get_useful = {
        id: '',
        /** @type {Activity[]} */
        activities: []
    };

    Clear = () => {
        this.#SAVED_activities = [];
        this.#SERVER_hidden = [];
        this.#UNSAVED_activities = [];
        this.#UNSAVED_editions = [];
        this.#UNSAVED_deletions = [];
        this.lastSaveOnlineError = null;
        this.lastDiscardedOxKeys = [];
        this.oxQuotedDelta = null;
        this.oxFreeKey = null;
        this.currentActivity.Set(null);
        this.allActivities.Set([]);
        this.#token = 0;
    };

    /**
     * Return all activities (save and unsaved) sorted by start time (ascending)
     * @param {boolean} [forceRefresh=false]
     * @returns {(Activity | ActivitySaved)[]}
     */
    Get = (forceRefresh = false) => {
        // Generate cache ID
        const id = [
            this.#SAVED_activities.length,
            this.#UNSAVED_editions.length,
            this.#UNSAVED_activities.length,
            this.#UNSAVED_deletions.length
        ].join('-');

        // If cache is not up to date, update it
        if (id !== this.#cache_get.id || forceRefresh) {
            // Get saved activities
            const savedActivities = [...this.#SAVED_activities];

            // Apply unsaved editions
            for (const editActivity of this.#UNSAVED_editions) {
                const index = savedActivities.findIndex((activity) => activity.ID === editActivity.ID);
                if (index !== -1) {
                    savedActivities[index] = editActivity;
                }
            }

            // Apply unsaved deletions
            for (const activityID of this.#UNSAVED_deletions) {
                const index = savedActivities.findIndex((activity) => activity.ID === activityID);
                if (index !== -1) {
                    savedActivities.splice(index, 1);
                }
            }

            // Apply unsaved new activities
            /** @type {(Activity | ActivitySaved)[]} */
            const newActivities = [...savedActivities, ...this.#UNSAVED_activities];

            // Update cache
            this.#cache_get.id = id;
            this.#cache_get.activities = SortByKey(newActivities, 'startTime');
        }

        // Return cache
        return this.#cache_get.activities;
    };

    /**
     * Server row of an activity, found by its start time (unique per account: the database has a
     * UNIQUE key on (AccountID, StartTime)). Null while it has not been saved online.
     *
     * `Add()` returns the object pushed into the pending list, which `#purge()` later replaces by
     * the server one: that reference never carries an ID, this is how the caller gets it.
     *
     * @param {number} startTime
     * @returns {ActivitySaved | null}
     */
    GetSavedByStartTime = (startTime) =>
        this.#SAVED_activities.find((activity) => activity.startTime === startTime) ?? null;

    /**
     * Return the list of activities for the skill
     * @param {number} skillID Skill ID
     * @returns {Activity[]} List of activities
     */
    GetBySkillID(skillID) {
        return this.Get().filter((activity) => activity.skillID === skillID);
    }

    /**
     * Frequency of a skill (streaks, rate, minutes per local day), computed from its activities.
     * Future activities are ignored, nothing is persisted.
     * @param {number} skillID
     * @param {number | null} [windowDays] Rate window in days (today included), null = since the first activity
     * @returns {SkillFrequency}
     */
    GetSkillFrequency(skillID, windowDays = RATE_WINDOW_DAYS) {
        return ComputeSkillFrequency(this.GetBySkillID(skillID), GetTodayLocalDayIndex(), windowDays);
    }

    /** @param {Partial<SaveObject_Activities>} data */
    Load = (data) => {
        if (typeof data.activities !== 'undefined') this.#SAVED_activities = data.activities;
        if (typeof data.editions !== 'undefined') this.#UNSAVED_editions = data.editions;
        if (typeof data.additions !== 'undefined') this.#UNSAVED_activities = data.additions;
        if (typeof data.deletions !== 'undefined') this.#UNSAVED_deletions = data.deletions;
        if (typeof data.current !== 'undefined') this.currentActivity.Set(data.current);
        if (typeof data.token !== 'undefined') this.#token = data.token;
        if (typeof data.oxQuotedDelta !== 'undefined') this.oxQuotedDelta = data.oxQuotedDelta;
        if (typeof data.oxFreeKey !== 'undefined') this.oxFreeKey = data.oxFreeKey;
        this.#user.interface.console?.AddLog('info', `[Activities] ${this.#SAVED_activities.length} activities loaded`);
        this.allActivities.Set(this.Get(true));
    };

    /** @returns {SaveObject_Activities} */
    Save = () => {
        return {
            activities: this.#SAVED_activities,
            editions: this.#UNSAVED_editions,
            additions: this.#UNSAVED_activities,
            deletions: this.#UNSAVED_deletions,
            current: this.currentActivity.Get(),
            token: this.#token,
            oxQuotedDelta: this.oxQuotedDelta,
            oxFreeKey: this.oxFreeKey
        };
    };

    LoadOnline = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'get-activities',
            token: this.#token
        });

        // Check if failed
        if (
            response === 'timeout' ||
            response === 'interrupted' ||
            response === 'not-sent' ||
            response.status !== 'get-activities' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('error', '[Activities] Failed to load activities');
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        // Add activities
        this.#SAVED_activities = [];
        this.#SERVER_hidden = [];
        for (let i = 0; i < response.result.activities.length; i++) {
            const serverActivity = response.result.activities[i];
            const { status } = this.Add(serverActivity, true);
            if (status !== 'added') {
                // Kept on the server (a deletion now costs ox, it must come from the user) and
                // still counted in the ox preview, hidden from the UI
                this.#SERVER_hidden.push(serverActivity);
                this.#user.interface.console?.AddLog(
                    'error',
                    `[Activities] Failed to load activity ${serverActivity.ID} (${status})`
                );
            }
        }

        // A pending addition already saved by a previous attempt (lost response) is now loaded
        this.#UNSAVED_activities = this.#UNSAVED_activities.filter(
            (pending) =>
                !this.#SAVED_activities.some(
                    (saved) =>
                        saved.skillID === pending.skillID &&
                        saved.startTime === pending.startTime &&
                        saved.addedTime === pending.addedTime
                )
        );

        // Update last update
        this.#token = response.result.token;

        // Update and print message
        this.allActivities.Set(this.Get(true));
        this.#user.interface.console?.AddLog('info', `[Activities] ${this.#SAVED_activities.length} activities loaded`);
        return true;
    };

    /**
     * @param {number} [attempt] Remaining automatic retries after a 'not-up-to-date'
     * @param {number} [quoteAttempt] Remaining times the user may be asked to confirm a new price
     * @returns {Promise<boolean>}
     */
    SaveOnline = async (attempt = 1, quoteAttempt = 1) => {
        if (!this.#isUnsaved()) {
            return true;
        }

        const unsaved = this.#getUnsaved();
        const experience = this.#user.experience.experience.Get();

        // Get all activities (including unsaved) for leaderboard calculation
        const allActivities = this.Get(true);
        const leaderboardUpdates = this.#calculateLeaderboardUpdates(allActivities);

        this.lastSaveOnlineError = null;
        this.lastDiscardedOxKeys = [];

        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'save-activities',
            activitiesToAdd: unsaved.add,
            activitiesToEdit: unsaved.edit,
            activitiesToDelete: unsaved.delete,
            xp: Round(experience.xpInfo.totalXP, 2),
            stats: this.#user.experience.GetStatsNumber(),
            token: this.#token,
            leaderboardUpdates,
            oxRules: 2,
            oxExpectedDelta: this.oxQuotedDelta ?? undefined,
            oxFreeKey: this.oxFreeKey ?? undefined
        });

        // Check if failed
        if (
            response === 'timeout' ||
            response === 'interrupted' ||
            response === 'not-sent' ||
            response.status !== 'save-activities' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('error', '[Activities] Failed to save activities');
            return false;
        }

        // Fresh balance and weekly slot, sent with every refusal
        if (typeof response.ox === 'number') {
            this.#user.informations.ox.Set(response.ox);
        }
        if (typeof response.oxFreeSlotUntil !== 'undefined') {
            this.#user.informations.oxFreeSlotUntil = response.oxFreeSlotUntil;
        }

        if (response.result === 'wrong-activities') {
            this.#user.interface.console?.AddLog('error', '[Activities] Failed to save activities (wrong activities)');
            this.Clear();
            await this.LoadOnline();
            return false;
        }

        // Balance is negative: the costly operations are refused (and dropped), the rest is saved
        if (response.result === 'ox-negative') {
            this.#user.interface.console?.AddLog('error', '[Activities] Save refused, the ox balance is negative');
            const dropped = this.#discardPendingOxOperations(true);
            const langNegative = langManager.curr['activity'];
            await this.#showOxPopup(
                'ok',
                langNegative['alert-ox-negative-title'],
                langNegative['alert-ox-negative-message']
            );
            if (dropped && this.#isUnsaved()) {
                await this.SaveOnline(0);
            }
            this.lastSaveOnlineError = 'ox-negative';
            this.#user.SaveLocal();
            return false;
        }

        // The amount changed since the user confirmed (slot used elsewhere, other device): ask again
        if (response.result === 'ox-quote-changed') {
            const quoted = response.oxDelta ?? 0;
            this.#user.interface.console?.AddLog('warn', `[Activities] Save refused, the ox price changed (${quoted})`);

            if (quoteAttempt <= 0) {
                // The price keeps moving under us: give up rather than loop on the popup
                this.#discardPendingOxOperations(false);
                this.lastSaveOnlineError = 'ox-quote-changed';
                this.#user.SaveLocal();
                return false;
            }

            // Nothing is charged any more (the operations became free): no need to ask
            let accepted = quoted >= 0;
            if (!accepted) {
                const langQuote = langManager.curr['activity'];
                accepted = await this.#showOxPopup(
                    'yesno',
                    langQuote['alert-ox-quote-title'],
                    langQuote['alert-ox-quote-message-cost'].replace('{}', Math.abs(quoted).toString())
                );
            }

            if (accepted) {
                this.oxQuotedDelta = quoted;
                this.#user.SaveLocal();
                return this.SaveOnline(attempt, quoteAttempt - 1);
            }

            this.#discardPendingOxOperations(false);
            this.lastSaveOnlineError = 'ox-quote-changed';
            this.#user.SaveLocal();
            return false;
        }

        // Check if failed or need to reload
        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.#user.interface.console?.AddLog(
                    'error',
                    '[Activities] Failed to save activities (not up to date), no more attempts'
                );
                return false;
            }

            this.#user.interface.console?.AddLog(
                'error',
                '[Activities] Failed to save activities (wrong last update), retrying'
            );
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1, quoteAttempt);
        }

        // Update last update if success
        if (typeof response.result.token !== 'undefined') {
            this.#token = response.result.token;
        }

        // Update ox first: the Statistics KPI listens to allActivities
        if (typeof response.result.ox === 'number') {
            this.#user.informations.ox.Set(response.result.ox);
            this.#user.informations.oxFreeSlotUntil = response.result.oxFreeSlotUntil ?? null;
            if (response.result.oxDelta !== 0) {
                const sign = response.result.oxDelta > 0 ? '+' : '';
                this.#user.interface.console?.AddLog(
                    'info',
                    `[Activities] ox ${sign}${response.result.oxDelta} (penalty ${response.result.oxPenalty})`
                );
            }
        }
        this.oxQuotedDelta = null;
        this.oxFreeKey = null;

        // Raid: the server total and progress win over the local preview
        if (typeof response.result.raid !== 'undefined') {
            this.#user.raids.ApplySaveResult(response.result.raid);
        }

        // Update and print message
        this.#purge(response.result.newActivities);
        this.allActivities.Set(this.Get());
        this.#user.interface.console?.AddLog('info', `[Activities] ${this.#SAVED_activities.length} activities saved`);

        this.#user.SaveLocal();

        return true;
    };

    #isUnsaved = () => {
        return (
            this.#UNSAVED_activities.length > 0 ||
            this.#UNSAVED_editions.length > 0 ||
            this.#UNSAVED_deletions.length > 0
        );
    };

    /** @returns {{ add: Activity[], edit: ActivitySaved[], delete: number[] }} List of unsaved activities */
    #getUnsaved = () => {
        return {
            add: this.#UNSAVED_activities,
            edit: this.#UNSAVED_editions,
            delete: this.#UNSAVED_deletions
        };
    };

    /** @param {ActivitySaved[]} newActivities */
    #purge = (newActivities) => {
        // Apply unsaved editions
        for (const editActivity of this.#UNSAVED_editions) {
            const index = this.#SAVED_activities.findIndex((activity) => activity.ID === editActivity.ID);
            if (index !== -1) {
                this.#SAVED_activities[index] = editActivity;
            }
        }

        // Apply unsaved deletions
        for (const activityID of this.#UNSAVED_deletions) {
            const index = this.#SAVED_activities.findIndex((activity) => activity.ID === activityID);
            if (index !== -1) {
                this.#SAVED_activities.splice(index, 1);
            }
        }

        // Apply new activities (an activity echoed by a retry may already be loaded)
        for (const newActivity of newActivities) {
            const index = this.#SAVED_activities.findIndex((activity) => activity.ID === newActivity.ID);
            if (index === -1) {
                this.#SAVED_activities.push(newActivity);
            } else {
                this.#SAVED_activities[index] = newActivity;
            }
        }

        // Clear unsaved
        this.#UNSAVED_activities = [];
        this.#UNSAVED_editions = [];
        this.#UNSAVED_deletions = [];
    };

    RefreshActivities = () => {
        this.allActivities.Set(this.Get());
    };

    /**
     * @param {number} time Time in seconds (unix timestamp, UTC)
     * @param {number} duration Duration in minutes
     * @param {Activity[]} [activities]
     * @param {Activity[]} [exceptActivities] Activities to exclude from check
     * @returns {boolean} True if time is free
     */
    TimeIsFree(time, duration, activities = this.Get(), exceptActivities = []) {
        return TimeIsFree(time, duration, activities, exceptActivities);
    }

    /**
     * @description Activities that granted xp: the shared rule of the ox module, so that the app and
     * the server agree on what counts (skill with xp, added within 48h, inside the 12h chronological
     * all-or-nothing budget of its local day)
     * @param {boolean} [forceRefresh=false]
     * @returns {Activity[]}
     */
    GetUseful = (forceRefresh = false) => {
        const id = `${this.#SAVED_activities.length}-${this.#UNSAVED_activities.length}-${this.#UNSAVED_editions.length}-${this.#UNSAVED_deletions.length}`;
        if (id === this.#cache_get_useful.id && !forceRefresh) {
            return this.#cache_get_useful.activities;
        }

        const activities = this.#user.activities.Get();
        const useful = UsefulActivities(activities.map(this.#toOx), GetLocalTime(), this.#xpOfSkill);
        const usefulActivities = activities.filter((activity) => useful.has(KeyOf(this.#toOx(activity))));

        this.#cache_get_useful.id = id;
        this.#cache_get_useful.activities = usefulActivities;

        return usefulActivities;
    };

    /** @param {number} skillID */
    #xpOfSkill = (skillID) => dataManager.skills.GetByID(skillID)?.XP ?? 0;

    /**
     * @param {Activity} activity
     * @returns {OxActivity}
     */
    #toOx = (activity) => {
        const saved = /** @type {Partial<ActivitySaved>} */ (activity);
        return {
            id: typeof saved.ID === 'number' ? saved.ID : null,
            skillID: activity.skillID,
            startTime: activity.startTime,
            duration: activity.duration,
            timezone: activity.timezone,
            addedTime: activity.addedTime
        };
    };

    /**
     * Version of `newActivity` that Edit() stores: a change of skill, start or duration is
     * re-stamped with the current timezone and time (the 48h rule applies to the edit), any other
     * change keeps the original stamps.
     * @param {Activity} activity
     * @param {Activity} newActivity
     * @returns {Activity}
     */
    StampEdition = (activity, newActivity) => {
        const bigEdit =
            newActivity.skillID !== activity.skillID ||
            newActivity.startTime !== activity.startTime ||
            newActivity.duration !== activity.duration;
        return bigEdit
            ? { ...newActivity, timezone: Math.round(GetTimeZone()), addedTime: GetLocalTime() }
            : newActivity;
    };

    /**
     * The pending buckets as the batch the next SaveOnline will send, plus an optional candidate
     * operation, resolved against the server snapshot like the server does.
     * @param {OxCandidate | null} candidate
     * @returns {{ additions: OxActivity[], editions: { prev: OxActivity, next: OxActivity }[], deletions: OxActivity[], candidateKey: string | null }}
     */
    #buildOxBatch = (candidate) => {
        const savedByID = new Map(this.#SAVED_activities.map((activity) => [activity.ID, activity]));

        /** @type {Map<string, OxActivity>} */
        const additions = new Map();
        /** @type {Map<number, { prev: OxActivity, next: OxActivity }>} */
        const editions = new Map();
        /** @type {Map<number, OxActivity>} */
        const deletions = new Map();

        for (const activity of this.#UNSAVED_activities) {
            const added = this.#toOx(activity);
            additions.set(KeyOf(added), added);
        }
        for (const activity of this.#UNSAVED_editions) {
            const original = savedByID.get(activity.ID);
            if (typeof original !== 'undefined') {
                editions.set(activity.ID, { prev: this.#toOx(original), next: this.#toOx(activity) });
            }
        }
        for (const ID of this.#UNSAVED_deletions) {
            const original = savedByID.get(ID);
            if (typeof original !== 'undefined') {
                editions.delete(ID);
                deletions.set(ID, this.#toOx(original));
            }
        }

        /** @type {string | null} */
        let candidateKey = null;

        if (candidate !== null && candidate.kind === 'add') {
            // Stamped like Add() will
            const next = {
                ...this.#toOx(candidate.next),
                id: null,
                timezone: Math.round(GetTimeZone()),
                addedTime: GetLocalTime()
            };
            additions.set(KeyOf(next), next);
            candidateKey = KeyOf(next);
        } else if (candidate !== null && candidate.kind === 'edit') {
            const prev = this.#toOx(candidate.prev);
            const stamped = this.#toOx(this.StampEdition(candidate.prev, candidate.next));
            if (prev.id === null) {
                // Editing a pending addition: the addition itself changes, nothing to charge
                additions.delete(KeyOf(prev));
                const next = { ...stamped, id: null };
                additions.set(KeyOf(next), next);
            } else {
                const original = savedByID.get(prev.id);
                if (typeof original !== 'undefined') {
                    editions.set(prev.id, { prev: this.#toOx(original), next: { ...stamped, id: prev.id } });
                    candidateKey = `id:${prev.id}`;
                }
            }
        } else if (candidate !== null && candidate.kind === 'delete') {
            const prev = this.#toOx(candidate.prev);
            if (prev.id === null) {
                // Never synced: nothing was granted, nothing to charge
                additions.delete(KeyOf(prev));
            } else {
                const original = savedByID.get(prev.id);
                if (typeof original !== 'undefined') {
                    editions.delete(prev.id);
                    deletions.set(prev.id, this.#toOx(original));
                    candidateKey = `id:${prev.id}`;
                }
            }
        }

        return {
            additions: [...additions.values()],
            editions: [...editions.values()],
            deletions: [...deletions.values()],
            candidateKey
        };
    };

    /** @returns {boolean} Whether the weekly base-price slot is available (server value) */
    IsOxSlotAvailable = () => {
        const until = this.#user.informations.oxFreeSlotUntil;
        return until === null || until <= GetLocalTime();
    };

    /**
     * Simulate the next save (pending buckets + candidate) with the same rules as the server.
     * The server stays authoritative: this is a preview.
     * @param {OxCandidate | null} [candidate]
     * @param {number} [now] Time the rules are evaluated at; a preview of a planned activity pushes
     * it to the end of that activity so it counts, as it will once the activity is done
     * @returns {{ op: OxOpResult | null, result: OxBatchResult, projectedOx: number }}
     */
    SimulateOx = (candidate = null, now = GetLocalTime()) => {
        const { additions, editions, deletions, candidateKey } = this.#buildOxBatch(candidate);

        const result = SimulateBatch({
            state: [...this.#SAVED_activities, ...this.#SERVER_hidden].map(this.#toOx),
            additions,
            editions,
            deletions,
            now,
            slotAvailable: this.IsOxSlotAvailable(),
            legacy: false,
            freeKey: this.oxFreeKey,
            xpOfSkill: (skillID) => dataManager.skills.GetByID(skillID)?.XP ?? 0
        });

        const op = candidateKey === null ? null : (result.ops.find((o) => o.key === candidateKey) ?? null);
        return { op, result, projectedOx: this.#user.informations.ox.Get() + result.totalDelta };
    };

    /**
     * @param {OxCandidate} candidate
     * @param {boolean} [asIfDone] Evaluate at the end of the activity instead of now, to preview
     * what a planned activity will bring once done. Never used for a price: what is charged is
     * what the server computes at the moment of the save.
     * @returns {OxQuote}
     */
    GetOxQuote = (candidate, asIfDone = false) => {
        let now = GetLocalTime();
        if (asIfDone) {
            const target = candidate.kind === 'delete' ? candidate.prev : candidate.next;
            now = Math.max(now, target.startTime + target.duration * 60);
        }

        const { op } = this.SimulateOx(candidate, now);
        const cost = op?.cost ?? 0;
        const penalty = op?.penalty ?? 0;
        return {
            key: op?.key ?? null,
            delta: op?.delta ?? 0,
            cost,
            penalty,
            free: op?.free ?? false,
            total: cost + penalty
        };
    };

    /**
     * Signed ox change of adding `activity`, or of editing `replacedActivity` into `activity`
     * (1 ox per minute with the same rules as XP; can be negative when the activity pushes another
     * one out of the 12h daily budget). Informative preview, evaluated as if the activity were
     * already done, so a planned activity shows what it will bring.
     * @param {Activity} activity
     * @param {Activity | null} [replacedActivity]
     * @returns {number}
     */
    GetOxReward = (activity, replacedActivity = null) => {
        const candidate =
            replacedActivity === null
                ? /** @type {OxCandidate} */ ({ kind: 'add', next: activity })
                : /** @type {OxCandidate} */ ({ kind: 'edit', prev: replacedActivity, next: activity });
        return this.GetOxQuote(candidate, true).delta;
    };

    /**
     * @param {Activity} activity
     * @returns {OxQuote}
     */
    GetDeleteOxQuote = (activity) => this.GetOxQuote({ kind: 'delete', prev: activity });

    /**
     * @param {Activity} activity
     * @param {Activity} newActivity
     * @returns {OxQuote}
     */
    GetEditOxQuote = (activity, newActivity) => this.GetOxQuote({ kind: 'edit', prev: activity, next: newActivity });

    /**
     * No costly deletion or edition while the balance is negative (same rule as the server;
     * additions are never blocked)
     * @param {OxQuote} quote
     * @returns {boolean}
     */
    IsOxOperationBlocked = (quote) => this.#user.informations.ox.Get() < 0 && quote.cost > 0;

    /**
     * Record the price the user just accepted: the first costly operation confirmed while the
     * weekly slot was available keeps the base price, and the batch total is frozen so that the
     * server asks again instead of applying an amount the user has not seen.
     * @param {OxQuote | null} [quote] Quote of the operation being queued, if any
     */
    #recordOxOperation = (quote = null) => {
        if (
            quote !== null &&
            quote.cost > 0 &&
            quote.key !== null &&
            this.oxFreeKey === null &&
            this.IsOxSlotAvailable()
        ) {
            this.oxFreeKey = quote.key;
        }
        // The whole batch is re-quoted: any change (addition, deletion, edition) moves the total
        const { result } = this.SimulateOx(null);
        this.oxQuotedDelta = result.ops.some((op) => op.kind !== 'add') ? result.totalDelta : null;
    };

    /**
     * Drop the pending editions and deletions (all of them, or only the costly ones), restore the
     * notifications of the restored activities and forget the frozen quote.
     * @param {boolean} costlyOnly
     * @returns {boolean} Whether something was dropped
     */
    #discardPendingOxOperations = (costlyOnly) => {
        /** @type {Set<string> | null} */
        let costlyKeys = null;
        if (costlyOnly) {
            const { result } = this.SimulateOx(null);
            costlyKeys = new Set(result.ops.filter((op) => op.kind !== 'add' && op.cost > 0).map((op) => op.key));
        }

        /** @param {string} key */
        const isKept = (key) => costlyKeys !== null && !costlyKeys.has(key);

        const droppedDeletions = this.#UNSAVED_deletions.filter((ID) => !isKept(`id:${ID}`));
        const droppedEditions = this.#UNSAVED_editions.filter((activity) => !isKept(`id:${activity.ID}`));
        this.#UNSAVED_deletions = this.#UNSAVED_deletions.filter((ID) => isKept(`id:${ID}`));
        this.#UNSAVED_editions = this.#UNSAVED_editions.filter((activity) => isKept(`id:${activity.ID}`));

        this.lastDiscardedOxKeys = [
            ...droppedDeletions.map((ID) => `id:${ID}`),
            ...droppedEditions.map((activity) => `id:${activity.ID}`)
        ];

        // Restore the notification of every activity put back as it is on the server
        for (const ID of droppedDeletions) {
            this.#restoreNotification(ID);
        }
        for (const activity of droppedEditions) {
            this.#restoreNotification(activity.ID);
        }

        this.oxQuotedDelta = null;
        this.oxFreeKey = null;
        this.allActivities.Set(this.Get(true));

        return droppedDeletions.length + droppedEditions.length > 0;
    };

    /** The user declined the new price: forget every pending deletion and edition */
    DiscardPendingOxOperations = () => {
        this.#discardPendingOxOperations(false);
        this.#user.SaveLocal();
    };

    /**
     * Whether the last refused save gave up on this activity's deletion or edition. False means
     * the operation went through (only other pending operations were cancelled).
     * @param {Activity | ActivitySaved} activity
     * @returns {boolean}
     */
    WasOxOperationDiscarded = (activity) => {
        const saved = /** @type {Partial<ActivitySaved>} */ (activity);
        return typeof saved.ID === 'number' && this.lastDiscardedOxKeys.includes(`id:${saved.ID}`);
    };

    /**
     * Put back the notification of an activity whose deletion or edition was cancelled: the
     * pending version's notification is removed, the server version's is re-created
     * @param {number} ID
     */
    #restoreNotification = (ID) => {
        const activity = this.#SAVED_activities.find((saved) => saved.ID === ID);
        if (typeof activity === 'undefined') {
            return;
        }

        const content = this.GetNotificationContent(activity);
        this.#user.notificationsPush?.Remove(content.id);

        if (activity.notifyBefore === null) {
            return;
        }
        const timestamp = GetDate(activity.startTime - activity.notifyBefore * 60).getTime();
        if (timestamp <= Date.now()) {
            return;
        }
        this.#user.notificationsPush?.CreateTrigger(
            'activityNotifications',
            { id: content.id, title: content.title, body: content.body },
            timestamp
        );
    };

    /**
     * @param {'ok' | 'yesno'} type
     * @param {string} title
     * @param {string} message
     * @returns {Promise<boolean>} True when acknowledged ('ok') or accepted ('yes')
     */
    #showOxPopup = (type, title, message) =>
        new Promise((resolve) => {
            const popup = this.#user.interface.popup;
            if (typeof popup === 'undefined' || popup === null) {
                resolve(false);
                return;
            }
            const data = { title, message };
            if (type === 'ok') {
                popup.OpenT({ type: 'ok', data, callback: () => resolve(true) });
            } else {
                popup.OpenT({ type: 'yesno', data, callback: (button) => resolve(button === 'yes') });
            }
        });

    /**
     * @param {number} [number=6]
     * @returns {EnrichedSkill[]}
     */
    GetLastSkills(number = 6) {
        const now = GetGlobalTime();
        const usersActivities = this.#user.activities.Get().filter((activity) => activity.startTime <= now);
        const usersActivitiesID = usersActivities.map((activity) => activity.skillID);

        /** @param {Skill} skill */
        const filter = (skill) => usersActivitiesID.includes(skill.ID);

        /** @param {EnrichedSkill} a @param {EnrichedSkill} b */
        const sortByXP = (a, b) => (a.Experience.totalXP < b.Experience.totalXP ? 1 : -1);

        /** @param {Skill} skill @returns {EnrichedSkill} */
        const getInfos = (skill) => ({
            ...skill,
            FullName: langManager.GetText(skill.Name),
            LogoXML: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            Experience: this.#user.experience.GetSkillExperience(skill)
        });

        /** @type {EnrichedSkill[]} */
        let enrichedSkills = dataManager.skills
            .Get()
            .skills.filter(filter)
            .map(getInfos)
            .sort(sortByXP)
            .slice(0, number);

        return enrichedSkills;
    }

    /**
     * @param {Activity} activity
     * @returns {{ id: string, title: string, body: string }} Notification contents
     */
    GetNotificationContent = (activity) => {
        const lang = langManager.curr['notifications']['activities'];

        const skill = dataManager.skills.GetByID(activity.skillID);
        const skillName = skill !== null ? langManager.GetText(skill.Name) : 'unknown';

        const allMessages = activity.notifyBefore === 0 ? lang['messages-now'] : lang['messages'];
        const messageIndex = Math.floor(Math.random() * allMessages.length);
        const message = allMessages[messageIndex]
            .replace('{skillName}', skillName)
            .replace('{minutes}', activity.notifyBefore?.toString() ?? '???');

        return {
            id: `activity-${activity.skillID}-${activity.startTime}`,
            title: lang['title'],
            body: message
        };
    };

    /**
     * Add activity, return status & Activity if added or edited successfully, null otherwise
     * @template {true | false} T
     * @param {T extends false ? Activity : ActivitySaved} newActivity
     * @param {T} [alreadySaved=false] If false, save activity in UNSAVED_activities
     * @returns {{ status: AddStatus, activity: Activity | null }}
     */
    Add(newActivity, alreadySaved = /** @type {T} */ (false)) {
        // Server rows keep their stamps; the timezone is rounded like the database column
        if (!alreadySaved) {
            newActivity.timezone ||= Math.round(GetTimeZone());
            newActivity.addedTime ||= GetLocalTime();
        }

        // Limit date (< 2020-01-01)
        if (newActivity.startTime < 1577836800) {
            return { status: 'tooEarly', activity: null };
        }

        // Activity is not free: a local addition is checked against the pending additions too
        // (a retry after a failed save must not create a twin), a server row only against the
        // rows already loaded (LoadOnline rebuilds the list, the pending filter comes after)
        const occupied = alreadySaved ? this.#SAVED_activities : this.Get();
        if (!this.TimeIsFree(newActivity.startTime, newActivity.duration, occupied)) {
            return { status: 'notFree', activity: null };
        }

        // Add activity
        if (alreadySaved) {
            const newSavedActivity = /** @type {ActivitySaved} */ (newActivity);
            this.#SAVED_activities.push(newSavedActivity);
        } else {
            this.#UNSAVED_activities.push(newActivity);
            this.#recordOxOperation();
            this.allActivities.Set(this.Get());
        }

        return { status: 'added', activity: newActivity };
    }

    /**
     * Edit activity
     * @param {Activity | ActivitySaved} activity
     * @param {Activity} newActivity
     * @param {boolean} [confirm=false] User confirm edit (if important: can remove experience)
     * @returns {{ status: EditStatus, activity: Activity | null }}
     */
    Edit(activity, newActivity, confirm = false) {
        /** @type {Activity} */
        const editedActivity = this.StampEdition(activity, newActivity);

        // Limit date (< 2020-01-01)
        if (editedActivity.startTime < 1577836800) {
            return { status: 'tooEarly', activity: null };
        }

        // Activity is not free
        if (!this.TimeIsFree(editedActivity.startTime, editedActivity.duration, this.Get(), [activity])) {
            return { status: 'notFree', activity: null };
        }

        const bigEdit = editedActivity !== newActivity;

        // If edit is important and more than 48h after start time, ask for confirmation
        if (
            !confirm &&
            bigEdit &&
            this.GetExperienceStatus(activity) === 'grant' &&
            this.GetExperienceStatus(editedActivity) === 'beforeLimit'
        ) {
            return { status: 'needConfirmation', activity: null };
        }

        const isSavedActivity = Object.keys(activity).includes('ID');

        // Price of the edition as the user saw it, recorded once the edition is queued
        const quote = isSavedActivity ? this.GetEditOxQuote(activity, newActivity) : null;

        // Activity edited is already saved
        if (isSavedActivity) {
            const _activity = /** @type {ActivitySaved} */ (activity);
            const _newActivity = /** @type {ActivitySaved} */ (editedActivity);

            // Activity does not exist
            const indexUnsavedAdd = this.#SAVED_activities.findIndex((act) => act.ID === _activity.ID);
            if (indexUnsavedAdd === -1) {
                return { status: 'notExist', activity: null };
            }

            const indexUnsavedEdition = this.#UNSAVED_editions.findIndex((act) => act.ID === _activity.ID);

            // Activity not edited yet
            if (indexUnsavedEdition === -1) {
                this.#UNSAVED_editions.push(_newActivity);
            }

            // Activity already edited, so edit the edition
            else {
                this.#UNSAVED_editions[indexUnsavedEdition] = _newActivity;
            }
        } else {
            // Activity edited is not saved: it keeps its stamps, they are its identity (pending
            // filter of LoadOnline, deduplication of the server) and the 48h rule is moot for an
            // activity that was just added
            const _activity = /** @type {Activity} */ (activity);
            const _newActivity = /** @type {Activity} */ ({
                ...editedActivity,
                timezone: _activity.timezone,
                addedTime: _activity.addedTime
            });

            const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, _activity);

            // Activity does not exist
            if (indexUnsaved === null) {
                return { status: 'notExist', activity: null };
            }

            // Edit unsaved activity
            this.#UNSAVED_activities[indexUnsaved] = _newActivity;
        }

        if (quote !== null) {
            this.#recordOxOperation(quote);
        }
        this.allActivities.Set(this.Get(true));
        return { status: 'edited', activity: editedActivity };
    }

    /**
     * Remove activity
     * @param {Activity | ActivitySaved} activity
     * @returns {RemoveStatus}
     */
    Remove(activity) {
        const isSavedActivity = Object.keys(activity).includes('ID');

        if (isSavedActivity) {
            const _activity = /** @type {ActivitySaved} */ (activity);
            const indexActivity = this.#SAVED_activities.findIndex((act) => act.ID === _activity.ID);
            if (indexActivity !== -1 && !this.#UNSAVED_deletions.includes(_activity.ID)) {
                const quote = this.GetDeleteOxQuote(_activity);

                // A pending edition of the same activity is pointless once it is deleted, and the
                // server would otherwise simulate two costly operations on it
                const indexEdition = this.#UNSAVED_editions.findIndex((act) => act.ID === _activity.ID);
                if (indexEdition !== -1) {
                    this.#UNSAVED_editions.splice(indexEdition, 1);
                }

                this.#UNSAVED_deletions.push(_activity.ID);
                this.#recordOxOperation(quote);
                this.allActivities.Set(this.Get());
                return 'removed';
            }
        } else {
            const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, activity);
            if (indexUnsaved !== null) {
                this.#UNSAVED_activities.splice(indexUnsaved, 1);
                this.#recordOxOperation();
                this.allActivities.Set(this.Get());
                return 'removed';
            }
        }

        return 'notExist';
    }

    // TODO: Don't take timezone into account here
    /**
     * Get activities in a specific date
     * @param {number} time Time in seconds to define day (auto define of midnights)
     * @param {Activity[]} activities
     * @returns {Activity[]} Activities
     */
    GetByTime(time = GetGlobalTime(), activities = this.Get(), includeOvernightActivities = false) {
        const startTime = GetMidnightTime(time + GetTimeZone() * 3600);
        const endTime = startTime + 86400;

        if (includeOvernightActivities) {
            return activities.filter(
                (activity) => activity.startTime + activity.duration * 60 > startTime && activity.startTime < endTime
            );
        }
        return activities.filter((activity) => activity.startTime >= startTime && activity.startTime < endTime);
    }

    /**
     * Get activities in a specific day
     * @param {string} day Ex: '2021-01-01'
     * @param {Activity[]} activities
     * @returns {Activity[]} Activities
     */
    GetByDay(day, activities = this.Get()) {
        const todayTime = GetLocalTime(new Date(day + 'T00:00:00'));
        const midnightTime = todayTime + DAY_TIME;
        return activities.filter((activity) => activity.startTime >= todayTime && activity.startTime < midnightTime);
    }

    /**
     * @param {Activity} activity
     * @returns {boolean} True if activity is in the past (and added before 48h ago)
     */
    DoesGrantXP = (activity) => {
        return this.GetExperienceStatus(activity) === 'grant';
    };

    /**
     * @param {Activity} activity
     * @returns {ActivityStatus}
     */
    GetExperienceStatus(activity) {
        const { startTime, addedTime } = activity;
        const deltaHours = (addedTime - startTime) / 3600;
        const addedBeforeLimit = deltaHours > HOURS_BEFORE_LIMIT;
        const isPast = startTime <= GetLocalTime();

        if (addedBeforeLimit) {
            return 'beforeLimit';
        }
        if (!isPast) {
            return 'isNotPast';
        }
        return 'grant';
    }

    /**
     * Calculate leaderboard updates for current periods only (current week, month, year)
     * Uses the same XP calculation logic as Experience class (12h/day limit, friend bonus)
     * @param {Activity[]} activities - All activities (including unsaved)
     * @returns {LeaderboardUpdateData[]}
     */
    #calculateLeaderboardUpdates = (activities) => {
        const now = GetGlobalTime();

        // Get user's total XP (all time)
        const totalUserXP = Round(this.#user.experience.experience.Get().xpInfo.totalXP, 2);

        // Calculate period boundaries (timestamps)
        const weekStart = GetMondayTimestamp(now);
        const weekEnd = weekStart + 7 * DAY_TIME;
        const monthStart = GetMonthStartTimestamp(now);
        const monthEnd = GetMonthStartTimestamp(monthStart + 32 * DAY_TIME);
        const yearStart = GetYearStartTimestamp(now);
        const yearEnd = GetYearStartTimestamp(yearStart + 366 * DAY_TIME);

        // Filter activities by period using simple timestamp comparison
        const weeklyActivities = activities.filter((a) => a.startTime >= weekStart && a.startTime < weekEnd);
        const monthlyActivities = activities.filter((a) => a.startTime >= monthStart && a.startTime < monthEnd);
        const yearlyActivities = activities.filter((a) => a.startTime >= yearStart && a.startTime < yearEnd);

        /** @type {LeaderboardUpdateData[]} */
        const updates = [];

        if (weeklyActivities.length > 0) {
            updates.push({
                periodType: 'weekly',
                periodStart: weekStart,
                xp: Round(this.#user.experience.CalculateTotalXP(weeklyActivities).totalXP, 2),
                activities: weeklyActivities.length,
                time: weeklyActivities.reduce((sum, a) => sum + a.duration, 0),
                totalUserXP
            });
        }

        if (monthlyActivities.length > 0) {
            updates.push({
                periodType: 'monthly',
                periodStart: monthStart,
                xp: Round(this.#user.experience.CalculateTotalXP(monthlyActivities).totalXP, 2),
                activities: monthlyActivities.length,
                time: monthlyActivities.reduce((sum, a) => sum + a.duration, 0),
                totalUserXP
            });
        }

        if (yearlyActivities.length > 0) {
            updates.push({
                periodType: 'yearly',
                periodStart: yearStart,
                xp: Round(this.#user.experience.CalculateTotalXP(yearlyActivities).totalXP, 2),
                activities: yearlyActivities.length,
                time: yearlyActivities.reduce((sum, a) => sum + a.duration, 0),
                totalUserXP
            });
        }

        return updates;
    };
}

export { DEFAULT_ACTIVITY, MAX_HOUR_PER_DAY, MAX_MINUTES_PER_DAY, OX_PER_MINUTE };
export default Activities;

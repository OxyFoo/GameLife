import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from 'Types/Interface/IUserData';
import { GetActivityIndex, TimeIsFree } from './utils';
import DynamicVar from 'Utils/DynamicVar';
import { SortByKey } from 'Utils/Functions';
import { GetGlobalTime, GetLocalTime, GetMidnightTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Types/Data/App/Skills').Skill} Skill
 * @typedef {import('Types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 * @typedef {import('Types/Features/UserOnline').CurrentActivity} CurrentActivity
 * @typedef {import('Types/Data/User/Activities').Activity} Activity
 * @typedef {import('Types/Data/User/Activities').ActivityUnsaved} ActivityUnsaved
 * @typedef {import('Types/Data/User/Activities').SaveObject_Activities} SaveObject_Activities
 *
 * @typedef {'grant' | 'isNotPast' | 'beforeLimit'} ActivityStatus
 * @typedef {'added' | 'notFree' | 'tooEarly' | 'alreadyExist'} AddStatus
 * @typedef {'edited' | 'needConfirmation' | 'notFree' | 'notExist' | 'tooEarly'} EditStatus
 * @typedef {'removed' | 'notExist'} RemoveStatus
 */

const MAX_HOUR_PER_DAY = 12;
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
    friends: []
};

/** @extends {IUserData<SaveObject_Activities>} */
class Activities extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('activities');

        this.user = user;
    }

    /** @type {Activity[]} */
    #activities = [];

    /** @type {Activity[]} */
    #UNSAVED_activities = [];

    /** @type {Activity[]} */
    #UNSAVED_deletions = [];

    /** @type {number} Unix timestamp in seconds */
    token = 0;

    /**
     * @description Contain all activities, updated when adding, editing or removing
     * @type {DynamicVar<Activity[]>}
     */
    // eslint-disable-next-line prettier/prettier
    allActivities = new DynamicVar(/** @type {Activity[]} */ ([]));

    /** @type {DynamicVar<CurrentActivity | null>} */
    // eslint-disable-next-line prettier/prettier
    currentActivity = new DynamicVar(/** @type {CurrentActivity | null} */ (null));

    #cache_get = {
        id: '',
        /** @type {Activity[]} */
        activities: []
    };

    #cache_get_useful = {
        id: '',
        /** @type {Activity[]} */
        activities: []
    };

    Clear = () => {
        this.#activities = [];
        this.#UNSAVED_activities = [];
        this.#UNSAVED_deletions = [];
        this.currentActivity.Set(null);
        this.allActivities.Set([]);
    };

    /**
     * Return all activities (save and unsaved) sorted by start time (ascending)
     * @returns {Activity[]}
     */
    Get = () => {
        const id = `${this.#activities.length}-${this.#UNSAVED_activities.length}`;
        if (id !== this.#cache_get.id) {
            const activities = [...this.#activities, ...this.#UNSAVED_activities].filter(
                (activity) => GetActivityIndex(this.#UNSAVED_deletions, activity) === null
            );
            this.#cache_get.id = id;
            this.#cache_get.activities = SortByKey(activities, 'startTime');
        }
        return this.#cache_get.activities;
    };

    /**
     * Return the list of activities for the skill
     * @param {number} skillID Skill ID
     * @returns {Activity[]} List of activities
     */
    GetBySkillID(skillID) {
        return this.Get().filter((activity) => activity.skillID === skillID);
    }

    /** @param {Partial<SaveObject_Activities>} data */
    Load = (data) => {
        if (typeof data.activities !== 'undefined') this.#activities = data.activities;
        if (typeof data.unsaved !== 'undefined') this.#UNSAVED_activities = data.unsaved;
        if (typeof data.deletions !== 'undefined') this.#UNSAVED_deletions = data.deletions;
        if (typeof data.current !== 'undefined') this.currentActivity.Set(data.current);
        if (typeof data.token !== 'undefined') this.token = data.token;
        this.allActivities.Set(this.Get());
    };

    /** @returns {SaveObject_Activities} */
    Save = () => {
        return {
            activities: this.#activities,
            unsaved: this.#UNSAVED_activities,
            deletions: this.#UNSAVED_deletions,
            current: this.currentActivity.Get(),
            token: this.token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'get-activities',
            token: this.token
        });

        // Check if failed
        if (
            response === 'timeout' ||
            response === 'interrupted' ||
            response === 'not-sent' ||
            response.status !== 'get-activities' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', '[Activities] Failed to load activities');
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        // Add activities
        this.#activities = [];
        for (let i = 0; i < response.result.activities.length; i++) {
            this.Add(response.result.activities[i], true);
        }

        // Update last update
        this.token = response.result.token;

        // Update and print message
        this.allActivities.Set(this.Get());
        this.user.interface.console?.AddLog('info', `[Activities] ${this.#activities.length} activities loaded`);
        return true;
    };

    SaveOnline = async () => {
        if (!this.isUnsaved()) {
            return true;
        }

        const unsaved = this.getUnsaved();
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-activities',
            activities: unsaved,
            token: this.token
        });

        // Check if failed
        if (
            response === 'timeout' ||
            response === 'interrupted' ||
            response === 'not-sent' ||
            response.status !== 'save-activities'
        ) {
            this.user.interface.console?.AddLog('error', '[Activities] Failed to save activities');
            return false;
        }

        // Check if failed or need to reload
        if (response.result !== 'ok') {
            if (response.result === 'wrong-last-update') {
                this.user.interface.console?.AddLog(
                    'error',
                    '[Activities] Failed to save activities (wrong last update), reloading'
                );
                await this.LoadOnline();
                return false;
            }

            this.user.interface.console?.AddLog('error', '[Activities] Failed to save activities');
            return false;
        }

        // Update last update if success
        if (typeof response.token !== 'undefined') {
            this.token = response.token;
        }

        // Update and print message
        this.purge();
        this.allActivities.Set(this.Get());
        this.user.interface.console?.AddLog('info', `[Activities] ${this.#activities.length} activities saved`);

        return true;
    };

    /** @private */
    isUnsaved = () => {
        return this.#UNSAVED_activities.length > 0 || this.#UNSAVED_deletions.length > 0;
    };

    /**
     * @private
     * @returns {ActivityUnsaved[]} List of unsaved activities
     */
    getUnsaved = () => {
        /** @type {ActivityUnsaved[]} */
        let unsaved = [];

        for (let a in this.#UNSAVED_activities) {
            const activity = this.#UNSAVED_activities[a];
            unsaved.push({ type: 'add', ...activity });
        }

        for (let a in this.#UNSAVED_deletions) {
            const activity = this.#UNSAVED_deletions[a];
            unsaved.push({ type: 'rem', ...activity });
        }

        return unsaved;
    };

    /** @private */
    purge = () => {
        this.#activities.push(...this.#UNSAVED_activities);
        this.#UNSAVED_activities = [];

        // Apply deletions
        for (let i = this.#UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = GetActivityIndex(this.#activities, this.#UNSAVED_deletions[i]);
            if (index !== null) {
                this.#activities.splice(index, 1);
            }
        }

        // Reset temp deletions
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
     * @description Get activities that have brought xp
     * @returns {Activity[]}
     */
    GetUseful = () => {
        const id = `${this.#activities.length}-${this.#UNSAVED_activities.length}`;
        if (id === this.#cache_get_useful.id) {
            return this.#cache_get_useful.activities;
        }

        const activities = this.user.activities.Get().filter(this.DoesGrantXP);

        let lastMidnight = 0;
        let hoursRemain = MAX_HOUR_PER_DAY;
        let usefulActivities = [];
        for (let i in activities) {
            const activity = activities[i];

            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) continue;

            const midnight = GetMidnightTime(activity.startTime);
            const durationHour = activity.duration / 60;

            if (lastMidnight !== midnight) {
                lastMidnight = midnight;
                hoursRemain = MAX_HOUR_PER_DAY;
            }

            // Limit
            if (skill.XP > 0) hoursRemain -= durationHour;
            if (hoursRemain < 0) continue;

            usefulActivities.push(activity);
        }

        this.#cache_get_useful.id = id;
        this.#cache_get_useful.activities = usefulActivities;

        return usefulActivities;
    };

    /**
     * @param {number} [number=6]
     * @returns {EnrichedSkill[]}
     */
    GetLastSkills(number = 6) {
        const now = GetGlobalTime();
        const usersActivities = this.user.activities.Get().filter((activity) => activity.startTime <= now);
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
            Experience: this.user.experience.GetSkillExperience(skill)
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
     * Add activity, return status & Activity if added or edited successfully, null otherwise
     * @param {Activity} newActivity Auto define timezone & addedTime if 0
     * @param {boolean} [alreadySaved=false] If false, save activity in UNSAVED_activities
     * @returns {{ status: AddStatus, activity: Activity | null }}
     */
    Add(newActivity, alreadySaved = false) {
        newActivity.timezone ||= GetTimeZone();
        newActivity.addedTime ||= GetLocalTime(undefined, 3);

        // Limit date (< 2020-01-01)
        if (newActivity.startTime < 1577836800) {
            return { status: 'tooEarly', activity: null };
        }

        // Check if not exists
        const indexActivity = GetActivityIndex(this.#activities, newActivity);
        const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, newActivity);

        // Activity already exists
        if (indexActivity !== null || indexUnsaved !== null) {
            return { status: 'alreadyExist', activity: null };
        }

        // Activity is not free
        if (!this.TimeIsFree(newActivity.startTime, newActivity.duration, this.#activities)) {
            return { status: 'notFree', activity: null };
        }

        // Remove from deletions if exists
        const indexDeletion = GetActivityIndex(this.#UNSAVED_deletions, newActivity);
        if (indexDeletion !== null) {
            this.#UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Add activity
        if (alreadySaved) {
            this.#activities.push(newActivity);
        } else {
            this.#UNSAVED_activities.push(newActivity);
            this.allActivities.Set(this.Get());
        }

        return { status: 'added', activity: newActivity };
    }

    // TODO: Finish edit activity
    /**
     * Edit activity
     * @param {Activity} activity
     * @param {Activity} newActivity
     * @param {boolean} [confirm=false] User confirm edit (important, can remove experience)
     * @returns {{ status: EditStatus, activity: Activity | null }}
     */
    Edit(activity, newActivity, confirm = false) {
        // Limit date (< 2020-01-01)
        if (newActivity.startTime < 1577836800) {
            return { status: 'tooEarly', activity: null };
        }

        const indexActivity = GetActivityIndex(this.#activities, activity);
        const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, newActivity);

        // Activity does not exist
        if (indexActivity === null && indexUnsaved === null) {
            return { status: 'notExist', activity: null };
        }

        // Activity is not free
        if (!this.TimeIsFree(newActivity.startTime, newActivity.duration, this.Get(), [activity])) {
            return { status: 'notFree', activity: null };
        }

        // If edit is important and more than 48h after start time, add to deletions
        // const tempNewActivity = { ...newActivity };
        // if (
        //     newActivity.skillID !== activity.skillID ||
        //     newActivity.startTime !== activity.startTime ||
        //     newActivity.duration !== activity.duration
        // ) {
        //     tempNewActivity.addedTime = GetLocalTime(undefined, 3);
        //     tempNewActivity.timezone = GetTimeZone();
        //     if (
        //         !confirm &&
        //         this.GetExperienceStatus(activity) === 'grant' &&
        //         this.GetExperienceStatus(tempNewActivity) === 'beforeLimit'
        //     ) {
        //         return { status: 'needConfirmation', activity: null };
        //     }
        // }

        // Remove old activity and add new one
        // this.Remove(activity);
        // this.#UNSAVED_activities.push(tempNewActivity);
        // this.allActivities.Set(this.Get());

        // If edit is important and more than 48h after start time, ask for confirmation
        const tempNewActivity = { ...newActivity };
        if (
            !confirm &&
            (newActivity.skillID !== activity.skillID ||
                newActivity.startTime !== activity.startTime ||
                newActivity.duration !== activity.duration) &&
            this.GetExperienceStatus(activity) === 'grant' &&
            this.GetExperienceStatus(tempNewActivity) === 'beforeLimit'
        ) {
            return { status: 'needConfirmation', activity: null };
        }

        // Remove from deletions if exists
        const indexDeletion = GetActivityIndex(this.#UNSAVED_deletions, newActivity);
        if (indexDeletion !== null) {
            this.#UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Remove old activity (add to unsaved deletions) and add new one (add to unsaved activities)
        if (indexActivity !== null) {
            this.#UNSAVED_deletions.push(activity);
        }
        if (indexUnsaved !== null) {
            this.#UNSAVED_activities.splice(indexUnsaved, 1);
        }

        this.#UNSAVED_activities.push(newActivity);
        this.allActivities.Set(this.Get());

        return { status: 'edited', activity: newActivity };
    }

    /**
     * Remove activity
     * @param {Activity} activity
     * @returns {RemoveStatus}
     */
    Remove(activity) {
        let removed = false;

        const indexActivity = GetActivityIndex(this.#activities, activity);
        const indexDeletion = GetActivityIndex(this.#UNSAVED_deletions, activity);

        // Activity in saved activities and not already deleted, add to deletions
        if (indexActivity !== null) {
            if (indexDeletion === null) {
                this.#UNSAVED_deletions.push(activity);
                removed = true;
            }
        }

        // Activity in unsaved activities, remove it
        const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, activity);
        if (indexUnsaved !== null) {
            this.#UNSAVED_activities.splice(indexUnsaved, 1)[0];
            removed = true;
        }

        if (removed) {
            // Update all activities
            this.allActivities.Set(this.Get());
            return 'removed';
        }

        return 'notExist';
    }

    // TODO: Don't take timezone into account here
    /**
     * Get activities in a specific date
     * @param {number} time Time in seconds to define day (auto define of midnights)
     * @param {Activity[]} activities
     * @returns {Activity[]} activities
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
}

export { DEFAULT_ACTIVITY };
export default Activities;

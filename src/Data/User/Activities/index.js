import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import { GetActivityIndex, TimeIsFree } from './utils';
import DynamicVar from 'Utils/DynamicVar';
import { Round, SortByKey } from 'Utils/Functions';
import { DAY_TIME, GetGlobalTime, GetLocalTime, GetMidnightTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').Skill} Skill
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Skills').EnrichedSkill} EnrichedSkill
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').Activity} Activity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').CurrentActivity} CurrentActivity
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').SaveObject_Activities} SaveObject_Activities
 *
 * @typedef {'grant' | 'isNotPast' | 'beforeLimit'} ActivityStatus
 * @typedef {'added' | 'notFree' | 'tooEarly'} AddStatus
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
        this.#UNSAVED_activities = [];
        this.#UNSAVED_deletions = [];
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
     * Return the list of activities for the skill
     * @param {number} skillID Skill ID
     * @returns {Activity[]} List of activities
     */
    GetBySkillID(skillID) {
        return this.Get().filter((activity) => activity.skillID === skillID);
    }

    /** @param {Partial<SaveObject_Activities>} data */
    Load = (data) => {
        if (typeof data.activities !== 'undefined') this.#SAVED_activities = data.activities;
        if (typeof data.editions !== 'undefined') this.#UNSAVED_editions = data.editions;
        if (typeof data.additions !== 'undefined') this.#UNSAVED_activities = data.additions;
        if (typeof data.deletions !== 'undefined') this.#UNSAVED_deletions = data.deletions;
        if (typeof data.current !== 'undefined') this.currentActivity.Set(data.current);
        if (typeof data.token !== 'undefined') this.#token = data.token;
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
            token: this.#token
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
        for (let i = 0; i < response.result.activities.length; i++) {
            const { status } = this.Add(response.result.activities[i], true);
            if (status !== 'added') {
                this.#user.interface.console?.AddLog(
                    'error',
                    `[Activities] Failed to load activity ${response.result.activities[i].ID} (${status})`
                );

                // Not added but remove server side
                if (!this.#UNSAVED_deletions.includes(response.result.activities[i].ID)) {
                    this.#UNSAVED_deletions.push(response.result.activities[i].ID);
                }
            }
        }

        // Update last update
        this.#token = response.result.token;

        // Update and print message
        this.allActivities.Set(this.Get(true));
        this.#user.interface.console?.AddLog('info', `[Activities] ${this.#SAVED_activities.length} activities loaded`);
        return true;
    };

    /** @returns {Promise<boolean>} */
    SaveOnline = async (attempt = 1) => {
        if (!this.#isUnsaved()) {
            return true;
        }

        const unsaved = this.#getUnsaved();
        const experience = this.#user.experience.experience.Get();
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'save-activities',
            activitiesToAdd: unsaved.add,
            activitiesToEdit: unsaved.edit,
            activitiesToDelete: unsaved.delete,
            xp: Round(experience.xpInfo.totalXP, 2),
            stats: this.#user.experience.GetStatsNumber(),
            token: this.#token
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

        if (response.result === 'wrong-activities') {
            this.#user.interface.console?.AddLog('error', '[Activities] Failed to save activities (wrong activities)');
            this.Clear();
            await this.LoadOnline();
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
            return this.SaveOnline(attempt - 1);
        }

        // Update last update if success
        if (typeof response.result.token !== 'undefined') {
            this.#token = response.result.token;
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

        // Apply new activities
        this.#SAVED_activities.push(...newActivities);

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
     * @description Get activities that have brought xp
     * @param {boolean} [forceRefresh=false]
     * @returns {Activity[]}
     */
    GetUseful = (forceRefresh = false) => {
        const id = `${this.#SAVED_activities.length}-${this.#UNSAVED_activities.length}-${this.#UNSAVED_editions.length}-${this.#UNSAVED_deletions.length}`;
        if (id === this.#cache_get_useful.id && !forceRefresh) {
            return this.#cache_get_useful.activities;
        }

        const activities = this.#user.activities.Get().filter(this.DoesGrantXP);

        let lastMidnight = 0;
        let hoursRemain = MAX_HOUR_PER_DAY;
        let usefulActivities = [];
        for (let i in activities) {
            const activity = activities[i];

            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) {
                continue;
            }

            const midnight = GetMidnightTime(activity.startTime);
            const durationHour = activity.duration / 60;

            if (lastMidnight !== midnight) {
                lastMidnight = midnight;
                hoursRemain = MAX_HOUR_PER_DAY;
            }

            // Limit
            if (skill.XP > 0) hoursRemain -= durationHour;
            if (hoursRemain < 0) {
                continue;
            }

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
        newActivity.timezone ||= GetTimeZone();
        newActivity.addedTime ||= GetLocalTime();

        // Limit date (< 2020-01-01)
        if (newActivity.startTime < 1577836800) {
            return { status: 'tooEarly', activity: null };
        }

        // Activity is not free
        if (!this.TimeIsFree(newActivity.startTime, newActivity.duration, this.#SAVED_activities)) {
            return { status: 'notFree', activity: null };
        }

        // Add activity
        if (alreadySaved) {
            const newSavedActivity = /** @type {ActivitySaved} */ (newActivity);
            this.#SAVED_activities.push(newSavedActivity);
        } else {
            this.#UNSAVED_activities.push(newActivity);
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
        const editedActivity = {
            ...newActivity,
            timezone: GetTimeZone(),
            addedTime: GetLocalTime()
        };

        // Limit date (< 2020-01-01)
        if (editedActivity.startTime < 1577836800) {
            return { status: 'tooEarly', activity: null };
        }

        // Activity is not free
        if (!this.TimeIsFree(editedActivity.startTime, editedActivity.duration, this.Get(), [activity])) {
            return { status: 'notFree', activity: null };
        }

        const bigEdit =
            editedActivity.skillID !== activity.skillID ||
            editedActivity.startTime !== activity.startTime ||
            editedActivity.duration !== activity.duration;

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

        // Activity edited is already saved
        if (isSavedActivity) {
            const _activity = /** @type {ActivitySaved} */ (activity);
            const _newActivity = /** @type {ActivitySaved} */ (bigEdit ? editedActivity : newActivity);

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
            // Activity edited is not saved
            const _activity = /** @type {Activity} */ (activity);
            const _newActivity = /** @type {Activity} */ (bigEdit ? editedActivity : newActivity);

            const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, _activity);

            // Activity does not exist
            if (indexUnsaved === null) {
                return { status: 'notExist', activity: null };
            }

            // Edit unsaved activity
            this.#UNSAVED_activities[indexUnsaved] = _newActivity;
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
                this.#UNSAVED_deletions.push(_activity.ID);
                this.allActivities.Set(this.Get());
                return 'removed';
            }
        } else {
            const indexUnsaved = GetActivityIndex(this.#UNSAVED_activities, activity);
            if (indexUnsaved !== null) {
                this.#UNSAVED_activities.splice(indexUnsaved, 1);
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
}

export { DEFAULT_ACTIVITY };
export default Activities;

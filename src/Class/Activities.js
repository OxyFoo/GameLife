import dataManager from 'Managers/DataManager';

import DynamicVar from 'Utils/DynamicVar';
import { SortByKey } from 'Utils/Functions';
import { GetMidnightTime, GetTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 * 
 * @typedef {'added'|'edited'|'notFree'|'tooEarly'|'alreadyExist'} AddStatus
 * 
 * @typedef {object} CurrentActivity
 * @property {number} skillID Skill ID
 * @property {number} startTime Start time of activity, unix timestamp (UTC)
 * @property {number} localTime Precise time when user started the activity
 *                              unix timestamp (local UTC)
 */

const MAX_HOUR_PER_DAY = 12;

class Activity {
    /** @type {number} Skill ID */
    skillID = 0;

    /** @type {number} Start time in seconds, unix timestamp (UTC) */
    startTime = 0;

    /** @type {number} Duration in minutes */
    duration = 0;

    /** @type {number} Timezone offset in hours */
    timezone = 0;

    comment = '';
    startNow = false;
}

class Activities {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        /**
         * @type {Array<Activity>}
         */
        this.activities = [];

        /**
         * @type {Array<Activity>}
         */
        this.UNSAVED_activities = [];

        /**
         * @type {Array<Activity>}
         */
        this.UNSAVED_deletions = [];

        /**
         * @description Contain all activities, updated when adding, editing or removing
         */
        this.allActivities = new DynamicVar([]);

        /**
         * @type {CurrentActivity|null}
         */
        this.currentActivity = null;

        /**
         * @type {{[name: string]: function}}
         */
        this.callbacks = {};
    }

    Clear() {
        this.activities = [];
        this.UNSAVED_activities = [];
        this.UNSAVED_deletions = [];
        this.currentActivity = null;
        this.allActivities.Set([]);
    }
    Load(activities) {
        const contains = (key) => activities.hasOwnProperty(key);
        if (contains('activities')) this.activities = activities['activities'];
        if (contains('unsaved'))    this.UNSAVED_activities = activities['unsaved'];
        if (contains('deletions'))  this.UNSAVED_deletions = activities['deletions'];
        if (contains('current'))    this.currentActivity = activities['current'];
        this.allActivities.Set(this.Get());
    }
    LoadOnline(activities) {
        if (typeof(activities) !== 'object') return;
        this.activities = [];
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            if (activity.length !== 6) continue;
            this.Add(activity[0], activity[1], activity[2], activity[3], activity[4], !!activity[5], true);
        }
        this.allActivities.Set(this.Get());
        const length = this.activities.length;
        this.user.interface.console.AddLog('info', `${length} activities loaded`);
    }
    Save() {
        const activities = {
            activities: this.activities,
            unsaved: this.UNSAVED_activities,
            deletions: this.UNSAVED_deletions,
            current: this.currentActivity
        };
        return activities;
    }
    /**
     * Return all activities (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Activity>}
     */
    Get() {
        let activities = [ ...this.activities, ...this.UNSAVED_activities ];
        return SortByKey(activities, 'startTime');
    }

    IsUnsaved = () => {
        return this.UNSAVED_activities.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_activities) {
            const activity = this.UNSAVED_activities[a];
            unsaved.push([
                'add',
                activity.skillID,
                activity.startTime,
                activity.duration,
                activity.comment,
                activity.timezone,
                activity.startNow
            ]);
        }
        for (let a in this.UNSAVED_deletions) {
            const activity = this.UNSAVED_deletions[a];
            unsaved.push([
                'rem',
                activity.skillID,
                activity.startTime,
                activity.duration,
                '',
                activity.timezone,
                activity.startNow
            ]);
        }
        return unsaved;
    }
    Purge = () => {
        this.activities.push(...this.UNSAVED_activities);
        this.UNSAVED_activities = [];

        for (let i = this.UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = this.getIndex(this.activities, this.UNSAVED_deletions[i]);
            if (index !== null) {
                this.activities.splice(index, 1);
            }
        }
        this.UNSAVED_deletions = [];
    }

    /**
     * @description Get activities that have brought xp
     * @returns {Array<Activity>}
     */
    GetUseful() {
        const now = GetTime();
        const activities = this.user.activities.Get().filter(a => a.startTime <= now);

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

        return usefulActivities;
    }

    /**
     * @param {number} [number=6]
     * @returns {Array<EnrichedSkill>}
     */
    GetLastSkills(number = 6) {
        const now = GetTime();
        const usersActivities = this.user.activities.Get().filter(activity => activity.startTime <= now);
        const usersActivitiesID = usersActivities.map(activity => activity.skillID);

        /** @param {Skill} skill */
        const filter = skill => usersActivitiesID.includes(skill.ID);

        /** @param {EnrichedSkill} a @param {EnrichedSkill} b */
        const sortByXP = (a, b) => a.Experience.totalXP < b.Experience.totalXP ? 1 : -1;

        /** @param {Skill} skill @returns {EnrichedSkill} */
        const getInfos = skill => ({
            ...skill,
            FullName: dataManager.GetText(skill.Name),
            LogoXML: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            Experience: this.user.experience.GetSkillExperience(skill.ID)
        });

        /** @type {EnrichedSkill[]} */
        let enrichedSkills = dataManager.skills
            .Get()
            .filter(filter)
            .map(getInfos)
            .sort(sortByXP)
            .slice(0, number);

        return enrichedSkills;
    }

    /** @returns {boolean} True if an activity was removed */
    RemoveDeletedSkillsActivities() {
        let activities = [ ...this.activities, ...this.UNSAVED_activities ];
        let deletions = [];
        for (let a in activities) {
            let activity = activities[a];
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) deletions.push(activity);
        }

        let removed = false;
        deletions.map((activity) => {
            const state = this.Remove(activity);
            removed ||= state === 'removed';
        });
        return removed;
    }

    /**
     * Add activity
     * @param {number} skillID Skill ID
     * @param {number} startTime Unix timestamp in seconds
     * @param {number} duration in minutes
     * @param {string} comment Optional comment
     * @param {number} [timezone] Optional timezone, if null, use local timezone
     * @param {boolean} [startNow=false] If true, activity is "start now"
     * @param {boolean} [alreadySaved=false] If false, save activity in UNSAVED_activities
     * @returns {AddStatus}
     */
    Add(skillID, startTime, duration, comment = '', timezone = null, startNow = false, alreadySaved = false) {
        const newActivity = new Activity();
        newActivity.skillID = skillID;
        newActivity.startTime = startTime;
        newActivity.duration = duration;
        newActivity.comment = comment;
        newActivity.timezone = timezone ?? GetTimeZone();
        newActivity.startNow = startNow;

        // Limit date (< 2020-01-01)
        if (startTime < 1577836800) {
            return 'tooEarly';
        }

        // Check if not exist
        const indexActivity = this.getIndex(this.activities, newActivity);
        const indexUnsaved = this.getIndex(this.UNSAVED_activities, newActivity);
        const indexDeletion = this.getIndex(this.UNSAVED_deletions, newActivity);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Activity not exist, add it
        if (indexActivity === null && indexUnsaved === null) {
            if (!this.TimeIsFree(startTime, duration)) {
                return 'notFree';
            }
            if (alreadySaved) {
                this.activities.push(newActivity);
            } else {
                this.UNSAVED_activities.push(newActivity);
                this.allActivities.Set(this.Get());
            }
            return 'added';
        }

        // Activity exist, update it
        else {
            let activity = indexActivity !== null ? this.activities[indexActivity] : this.UNSAVED_activities[indexUnsaved];
            if (activity.comment !== comment) {
                if (indexActivity !== null) this.activities.splice(indexActivity, 1);
                if (indexUnsaved  !== null) this.UNSAVED_activities.splice(indexUnsaved, 1);

                this.UNSAVED_activities.push(newActivity);
                this.allActivities.Set(this.Get());
                return 'edited';
            }
        }

        return 'alreadyExist';
    }

    /**
     * Remove activity
     * @param {Activity} activity
     * @returns {'removed'|'notExist'}
     */
    Remove(activity) {
        const indexActivity = this.getIndex(this.activities, activity);
        const indexUnsaved = this.getIndex(this.UNSAVED_activities, activity);
        const indexDeletion = this.getIndex(this.UNSAVED_deletions, activity);
        let deleted = null;

        if (indexActivity !== null) {
            deleted = this.activities.splice(indexActivity, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }
        if (indexUnsaved !== null) {
            deleted = this.UNSAVED_activities.splice(indexUnsaved, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }

        if (deleted !== null) {
            this.allActivities.Set(this.Get());
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * @param {Array<Activity>} arr
     * @param {Activity} activity
     * @returns {number|null} Index of activity or null if not found
     */
    getIndex(arr, activity) {
        for (let i = 0; i < arr.length; i++) {
            const equals = this.areEquals(arr[i], activity);
            if (equals) return i;
        }
        return null;
    }

    /**
     * Compare two activities
     * @param {Activity} activity1
     * @param {Activity} activity2
     * @returns {boolean}
     */
    areEquals(activity1, activity2) {
        const sameSkillID = activity1.skillID === activity2.skillID;
        const sameStartTime = activity1.startTime === activity2.startTime;
        const sameDuration = activity1.duration === activity2.duration;
        return sameSkillID && sameStartTime && sameDuration;
    }

    /**
     * Get activities in a specific date
     * @param {number} time Time in seconds to define day (auto define of midnights)
     * @returns {Activity[]} activities
     */
    GetByTime(time = GetTime()) {
        const startTime = GetMidnightTime(time + GetTimeZone() * 3600);
        const endTime = startTime + 86400;
        return this.Get().filter(activity => activity.startTime >= startTime && activity.startTime < endTime);
    }

    /**
     * @param {number} time Time in seconds (unix timestamp, UTC)
     * @param {number} duration Duration in minutes
     * @returns {boolean} True if time is free
     */
    TimeIsFree(time, duration) {
        let output = true;
        const startTime = time;
        const endTime = time + duration*60;

        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            const compareStartTime = activity.startTime;
            const compareEndTime = activity.startTime + activity.duration*60;

            const startDuringActivity = startTime >= compareStartTime && startTime < compareEndTime;
            const endDuringActivity = endTime > compareStartTime && endTime <= compareEndTime;
            const aroundActivity = startTime <= compareStartTime && endTime >= compareEndTime;

            if (startDuringActivity || endDuringActivity || aroundActivity) {
                output = false;
                break;
            }
        }
        return output;
    }
}

export { Activity };
export default Activities;
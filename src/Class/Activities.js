import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import DynamicVar from 'Utils/DynamicVar';
import { SortByKey } from 'Utils/Functions';
import { GetMidnightTime, GetTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('Data/Skills').EnrichedSkill} EnrichedSkill
 * @typedef {import('Types/UserOnline').CurrentActivity} CurrentActivity
 * 
 * @typedef {'normal' | 'start-now' | 'zap-gpt'} ActivityAddedType
 * @typedef {'grant' | 'isNotPast' | 'beforeLimit'} ActivityStatus
 * @typedef {'added' | 'edited' | 'notFree' | 'tooEarly' | 'alreadyExist'} AddStatus
 * 
 * @typedef {Activity & { type: 'add' | 'rem' }} ActivityUnsaved
 */

const MAX_HOUR_PER_DAY = 12;
const HOURS_BEFORE_LIMIT = 48;

class Activity {
    /** @type {number} Skill ID */
    skillID = 0;

    /** @type {number} Start time in seconds, unix timestamp (UTC) */
    startTime = 0;

    /** @type {number} Duration in minutes */
    duration = 0;

    /** @type {string} Optional comment */
    comment = '';

    /** @type {number} Timezone offset in hours */
    timezone = 0;

    /** @type {ActivityAddedType} */
    addedType = 'normal';

    /** @type {number} Time when activity was added (unix timestamp, UTC) */
    addedTime = 0;
}

class Activities {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {Array<Activity>} */
    activities = [];

    /** @type {Array<Activity>} */
    UNSAVED_activities = [];

    /** @type {Array<Activity>} */
    UNSAVED_deletions = [];

    /**
     * @description Contain all activities, updated when adding, editing or removing
     * @type {DynamicVar<Array<Activity>>}
     */
    allActivities = new DynamicVar([]);

    /** @type {DynamicVar<CurrentActivity | null>} */
    currentActivity = new DynamicVar(null);

    /** @type {{[name: string]: function}} */
    callbacks = {};

    Clear() {
        this.activities = [];
        this.UNSAVED_activities = [];
        this.UNSAVED_deletions = [];
        this.currentActivity.Set(null);
        this.allActivities.Set([]);
    }
    Load(activities) {
        const contains = (key) => activities.hasOwnProperty(key);
        if (contains('activities')) this.activities = activities['activities'];
        if (contains('unsaved'))    this.UNSAVED_activities = activities['unsaved'];
        if (contains('deletions'))  this.UNSAVED_deletions = activities['deletions'];
        if (contains('current'))    this.currentActivity.Set(activities['current']);
        this.allActivities.Set(this.Get());
    }
    LoadOnline(activities) {
        if (typeof(activities) !== 'object') return;
        this.activities = [];
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];

            // Check if all keys are present
            const keys = Object.keys(activity);
            const keysActivity = Object.keys(new Activity());
            if (!keys.every(key => keysActivity.includes(key))) {
                continue;
            }

            this.Add({
                skillID: activity['skillID'],
                startTime: activity['startTime'],
                duration: activity['duration'],
                comment: activity['comment'],
                timezone: activity['timezone'],
                addedType: activity['addedType'],
                addedTime: activity['addedTime']
            }, true);
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
            current: this.currentActivity.Get()
        };
        return activities;
    }

    cache_get = {
        id: '',
        /** @type {Array<Activity>} */
        activities: []
    };

    /**
     * Return all activities (save and unsaved) sorted by start time (ascending)
     * @returns {Array<Activity>}
     */
    Get() {
        const id = `${this.activities.length}-${this.UNSAVED_activities.length}`;
        if (id !== this.cache_get.id) {
            const activities = [
                ...this.activities,
                ...this.UNSAVED_activities
            ];
            this.cache_get.id = id;
            this.cache_get.activities = SortByKey(activities, 'startTime');
        }
        return this.cache_get.activities;
    }

    /**
     * Return the list of activities for the skill
     * @param {number} skillID Skill ID
     * @returns {Array<Activity>} List of activities
     */
    GetBySkillID(skillID) {
        return this.Get().filter(activity => activity.skillID === skillID);
    }

    IsUnsaved = () => {
        return this.UNSAVED_activities.length || this.UNSAVED_deletions.length;
    }
    /** @returns {Array<ActivityUnsaved>} List of unsaved activities */
    GetUnsaved = () => {
        /** @type {Array<ActivityUnsaved>} */
        let unsaved = [];
        for (let a in this.UNSAVED_activities) {
            const activity = this.UNSAVED_activities[a];
            unsaved.push({
                type: 'add',
                skillID: activity.skillID,
                startTime: activity.startTime,
                duration: activity.duration,
                comment: activity.comment,
                timezone: activity.timezone,
                addedType: activity.addedType,
                addedTime: activity.addedTime
            });
        }
        for (let a in this.UNSAVED_deletions) {
            const activity = this.UNSAVED_deletions[a];
            unsaved.push({
                type: 'rem',
                skillID: activity.skillID,
                startTime: activity.startTime,
                duration: activity.duration,
                comment: '',
                timezone: activity.timezone,
                addedType: activity.addedType,
                addedTime: activity.addedTime
            });
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

    cache_get_useful = {
        id: '',
        /** @type {Array<Activity>} */
        activities: []
    };

    /**
     * @description Get activities that have brought xp
     * @returns {Array<Activity>}
     */
    GetUseful = () => {
        const id = `${this.activities.length}-${this.UNSAVED_activities.length}`;
        if (id === this.cache_get_useful.id) {
            return this.cache_get_useful.activities;
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

        this.cache_get_useful.id = id;
        this.cache_get_useful.activities = usefulActivities;

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
            FullName: langManager.GetText(skill.Name),
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
     * @param {Activity} newActivity Auto define timezone & addedTime if null
     * @param {boolean} [alreadySaved=false] If false, save activity in UNSAVED_activities
     * @returns {AddStatus}
     */
    Add(newActivity, alreadySaved = false) {
        newActivity.timezone ??= GetTimeZone();
        newActivity.addedTime ??= GetTime(undefined, 'local');

        // Limit date (< 2020-01-01)
        if (newActivity.startTime < 1577836800) {
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
            if (!this.TimeIsFree(newActivity.startTime, newActivity.duration)) {
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
            if (activity.comment !== newActivity.comment) {
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
     * @returns {'removed' | 'notExist'}
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
     * @returns {number | null} Index of activity or null if not found
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
     * TODO: Don't take timezone into account here
     * Get activities in a specific date
     * @param {number} time Time in seconds to define day (auto define of midnights)
     * @param {Activity[]} activities
     * @returns {Activity[]} activities
     */
    GetByTime(time = GetTime(), activities = this.Get()) {
        const startTime = GetMidnightTime(time + GetTimeZone() * 3600);
        const endTime = startTime + 86400;
        return activities.filter(activity => activity.startTime >= startTime && activity.startTime < endTime);
    }

    /**
     * @param {Activity} activity
     * @returns {boolean} True if activity is in the past (and added before 48h ago)
     */
    DoesGrantXP = (activity) => {
        return this.GetExperienceStatus(activity) === 'grant';
    }

    /**
     * @param {Activity} activity
     * @returns {ActivityStatus}
     */
    GetExperienceStatus(activity) {
        const { startTime, addedTime } = activity;
        const deltaHours = (addedTime - startTime) / 3600;
        const addedBeforeLimit = deltaHours > HOURS_BEFORE_LIMIT;
        const isPast = startTime <= GetTime(undefined, 'local');

        if (addedBeforeLimit)
            return 'beforeLimit';
        if (!isPast)
            return 'isNotPast';
        return 'grant';
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

        const activities = this.Get();
        for (let a = 0; a < activities.length; a++) {
            const activity = activities[a];
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

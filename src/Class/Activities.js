import dataManager from '../Managers/DataManager';

import { GetMidnightTime, GetTime } from "../Utils/Time";
import { SortByKey } from '../Utils/Functions';

const MaxHourPerDay = 12;

class Activity {
    skillID = 0;
    startTime = 0;
    duration = 0;
    comment = null;
}

class Activities {
    constructor(user) {
        /**
         * @typedef {import('../Managers/UserManager').default} UserManager
         * @type {UserManager}
         */
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
         * @type {?Array<Number, Number>} [skillID, startTime]
         */
        this.currentActivity = null;

        /**
         * @type {{[name: String]: function}}
         */
        this.callbacks = {};
    }

    Clear() {
        this.activities = [];
        this.UNSAVED_activities = [];
        this.UNSAVED_deletions = [];
        this.currentActivity = null;
    }
    Load(activities) {
        const contains = (key) => activities.hasOwnProperty(key);
        if (contains('activities')) this.activities = activities['activities'];
        if (contains('unsaved'))    this.UNSAVED_activities = activities['unsaved'];
        if (contains('deletions'))  this.UNSAVED_deletions = activities['deletions'];
        if (contains('current'))    this.currentActivity = activities['current'];
    }
    LoadOnline(activities) {
        if (typeof(activities) !== 'object') return;
        this.activities = [];
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            if (activity.length !== 4) continue;
            this.Add(activity[0], activity[1], activity[2], activity[3], true);
        }
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
            unsaved.push([ 'add', activity.skillID, activity.startTime, activity.duration, activity.comment ]);
        }
        for (let a in this.UNSAVED_deletions) {
            const activity = this.UNSAVED_deletions[a];
            unsaved.push([ 'rem', activity.skillID, activity.startTime, activity.duration ]);
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
     * Add a callback, called when an activity is updated (added, removed, modified)
     * TODO - Replace by DynamicVar
     * @param {String} name
     * @param {Function} callback
     * @returns {Boolean} true if the callback was added
     */
    AddCallback = (name, callback) => {
        if  (typeof(name) !== 'string') return false;
        if  (typeof(callback) !== 'function') return false;
        if  (this.callbacks.hasOwnProperty(name)) return false;
        this.callbacks[name] = callback;
        return true;
    }
    /**
     * Remove a callback by name
     * @param {String} name
     * @returns {Boolean} true if the callback was removed
     */
    RemoveCallback = (name) => {
        if (typeof(name) !== 'string') return false;
        if (!this.callbacks.hasOwnProperty(name)) return false;
        delete this.callbacks[name];
        return true;
    }
    update = async () => {
        await this.user.RefreshStats();
        const names = Object.keys(this.callbacks);
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            this.callbacks[name]();
        }
    }

    /**
     * @description Get activities that have brought xp
     * @returns {Array<Activity>}
     */
    GetUseful() {
        const now = GetTime();
        const activities = this.user.activities.Get().filter(a => a.startTime <= now);

        let lastMidnight = 0;
        let hoursRemain = MaxHourPerDay;
        let usefulActivities = [];
        for (let i in activities) {
            const activity = activities[i];
            const midnight = GetMidnightTime(activity.startTime);
            const skill = dataManager.skills.GetByID(activity.skillID);
            const durationHour = activity.duration / 60;

            if (lastMidnight !== midnight) {
                lastMidnight = midnight;
                hoursRemain = MaxHourPerDay;
            }

            // Limit
            if (skill.XP > 0) hoursRemain -= durationHour;
            if (hoursRemain < 0) continue;

            usefulActivities.push(activity);
        }

        return usefulActivities;
    }

    GetLasts(number = 6) {
        const now = GetTime();
        const usersActivities = this.user.activities.Get().filter(activity => activity.startTime <= now);
        const usersActivitiesID = usersActivities.map(activity => activity.skillID);
    
        const filter = skill => usersActivitiesID.includes(skill.ID);
        const compare = (a, b) => a['experience']['lastTime'] < b['experience']['lastTime'] ? -1 : 1;
        const getInfos = skill => ({
            ...skill,
            Name: dataManager.GetText(skill.Name),
            Logo: dataManager.skills.GetXmlByLogoID(skill.LogoID),
            experience: this.user.experience.GetSkillExperience(skill.ID)
        });
    
        let skills = dataManager.skills.skills.filter(filter);
        skills = skills.map(getInfos).sort(compare);
        return skills.slice(0, number);
    }

    RemoveDeletedSkillsActivities() {
        let activities = [ ...this.activities, ...this.UNSAVED_activities ];
        let deletions = [];
        for (let a in activities) {
            let activity = activities[a];
            const skill = dataManager.skills.GetByID(activity.skillID);
            if (skill === null) deletions.push(activity);
        }
        deletions.map(this.Remove);
    }

    /**
     * Add activity
     * @param {Number} skillID - Skill ID
     * @param {Number} startTime - Unix timestamp in seconds
     * @param {Number} duration - in minutes
     * @param {String} comment - Optional comment
     * @param {Boolean} [alreadySaved=false] - If false, save activity in UNSAVED_activities
     * @returns {'added'|'edited'|'notFree'|'tooEarly'|'alreadyExist'}
     */
    Add(skillID, startTime, duration, comment, alreadySaved = false) {
        const newActivity = new Activity();
        newActivity.skillID = skillID;
        newActivity.startTime = startTime;
        newActivity.duration = duration;
        newActivity.comment = comment;

        // Limit date
        const limitDate = new Date();
        limitDate.setFullYear(2020, 1, 1);
        if (startTime < GetTime(limitDate)) {
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
            if (alreadySaved) this.activities.push(newActivity);
            else      this.UNSAVED_activities.push(newActivity);
            this.update();
            return 'added';
        }
        // Activity exist, update it
        else {
            let activity = indexActivity !== null ? this.activities[indexActivity] : this.UNSAVED_activities[indexUnsaved];
            if (activity.comment !== comment) {
                if (indexActivity !== null) this.activities.splice(indexActivity, 1);
                if (indexUnsaved  !== null) this.UNSAVED_activities.splice(indexUnsaved, 1);

                this.UNSAVED_activities.push(newActivity);
                this.update();
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
            this.update();
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * @param {Array<Activity>} arr
     * @param {Activity} activity
     * @returns {Number?} - Index of activity or null if not found
     */
    getIndex(arr, activity) {
        for (let i in arr) {
            const equals = this.areEquals(arr[i], activity);
            if (equals) return i;
        }
        return null;
    }

    /**
     * Compare two activities
     * @param {Activity} activity1
     * @param {Activity} activity2
     * @returns {Boolean}
     */
    areEquals(activity1, activity2) {
        const sameSkillID = activity1.skillID === activity2.skillID;
        const sameStartTime = activity1.startTime === activity2.startTime;
        const sameDuration = activity1.duration === activity2.duration;
        return sameSkillID && sameStartTime && sameDuration;
    }

    /**
     * Get activities in a specific date
     * @param {Number} time - Time in seconds to define day (auto define of midnights)
     * @returns {Activity[]} activities
     */
    GetByTime(time = GetTime(new Date())) {
        const startTime = GetMidnightTime(time);
        const endTime = startTime + 86400;
        return this.Get().filter(activity => activity.startTime >= startTime && activity.startTime <= endTime);
    }
    ContainActivity(date = new Date(), onlyRelax = false) {
        date.setUTCHours(0, 0, 0, 0);
        const startTime = GetTime(date);
        date.setUTCHours(23, 59, 59, 999);
        const endTime = GetTime(date);

        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            if (activity.startTime >= startTime && activity.startTime <= endTime) {
                if (!onlyRelax) return true;
                if (dataManager.skills.GetByID(activity.skillID).XP === 0) return true;
            }
        }
        return false;
    }

    /**
     * 
     * @param {Number} time Time in seconds
     * @param {Number} duration Duration in minutes
     * @returns {Boolean} True if time is free
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
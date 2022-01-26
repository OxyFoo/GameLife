import dataManager from '../Managers/DataManager';

import { GetMidnightTime, GetTime } from "../Functions/Time";

class Activity {
    skillID = 0;
    startTime = 0;
    duration = 0;
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
         * @type {?Array<Number, Number>} [skillID, startTime]
         */
        this.currentActivity = null;
    }

    Clear() {
        this.activities = [];
        this.UNSAVED_activities = [];
        this.currentActivity = null;
    }
    Load(activities) {
        this.activities = activities['activities'];
        this.UNSAVED_activities = activities['unsaved'];
        this.currentActivity = activities['current'];
    }
    LoadOnline(activities) {
        if (typeof(activities) !== 'object') return;
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];
            this.Add(activity[0], activity[1], activity[2]);
        }
    }
    Save() {
        const activities = {
            activities: this.activities,
            unsaved: this.UNSAVED_activities,
            current: this.currentActivity
        };
        return activities;
    }

    /**
     * @returns {Activity[]} activities
     */
    GetAll() {
        return this.activities;
    }

    /**
     * @param {Activity[]} activities 
     */
    SetAll(activities) {
        this.activities = activities;
    }

    IsUnsaved() {
        return this.UNSAVED_activities.length > 0;
    }
    Purge() {
        this.UNSAVED_activities = [];
    }

    // TODO - Update or remove
    RemoveDeletedSkillsActivities() {
        /*for (let a in this.activities) {
            let activity = this.activities[a];
            let skillID = activity.skillID;
            const skill = dataManager.skills.GetByID(skillID);
            if (skill === null) {
                this.Remove(activity);
                this.RemoveDeletedSkillsActivities();
                break;
            }
        }*/
    }

    Add(skillID, startTime, duration) {
        let output = false;

        const newActivity = new Activity();
        newActivity.skillID = skillID;
        newActivity.startTime = startTime;
        newActivity.duration = duration;

        const limitDate = new Date();
        limitDate.setFullYear(2020, 1, 1);
        if (startTime < GetTime(limitDate)) return false;

        // Check if not exist
        let exists = false;
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];

            const sameSkillID = activity.skillID === newActivity.skillID;
            const sameStartDate = activity.startTime === newActivity.startTime;
            if (sameSkillID && sameStartDate) {
                exists = true;
            }
        }

        if (!exists) {
            if (this.TimeIsFree(startTime, duration)) {
                // Add - Sort by date
                /*const activityDate = new Date(startTime);
                for (let a = 0; a < this.activities.length; a++) {
                    const arrayDate = new Date(this.activities[a].startTime);
                    if (activityDate < arrayDate) {
                        this.activities.splice(a, 0, newActivity);
                        output = true;
                        break;
                    }
                }*/
                //if (!output) {}
                this.activities.push(newActivity);
                this.UNSAVED_activities.push(['add', newActivity.skillID, newActivity.startTime, newActivity.duration ]);
                output = true;

                // TODO - Save (local & online or future)
                this.user.RefreshStats();
            }
        }

        return output;
    }

    Remove(activity) {
        for (let i = 0; i < this.activities.length; i++) {
            if (this.areEquals(this.activities[i], activity)) {
                this.activities.splice(i, 1);
                this.UNSAVED_activities.push(['rem', activity.skillID, activity.startTime, activity.duration ]);
                break;
            }
        }
        // TODO - Save (local & online or future)
        this.user.RefreshStats();
    }

    areEquals(activity1, activity2) {
        const sameSkillID = activity1.skillID === activity2.skillID;
        const sameStartTime = activity1.startTime === activity2.startTime;
        const sameDuration = activity1.duration === activity2.duration;
        return sameSkillID && sameStartTime && sameDuration;
    }

    /**
     * Get activities in a specific date
     * @param {Number} time - Time to define day (auto define of midnights)
     * @returns {Activity[]} activities
     */
    GetByTime(time = GetTime(new Date())) {
        const startTime = GetMidnightTime(time);
        const endTime = startTime + 86400;
        return this.activities.filter(activity => activity.startTime >= startTime && activity.startTime <= endTime);
    }
    ContainActivity(date = new Date(), onlyRelax = false) {
        date.setHours(0, 0, 0, 0);
        const startTime = GetTime(date);
        date.setHours(23, 59, 59, 999);
        const endTime = GetTime(date);

        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            if (activity.startTime >= startTime && activity.startTime <= endTime) {
                if (!onlyRelax) return true;
                if (dataManager.skills.GetByID(activity.skillID).XP === 0) return true;
            }
        }
        return false;

        //const condNormalActivity = (activity) => activity.startTime >= startTime && activity.startTime <= endTime;
        //const condRelaxActivity = (activity) => activity.startTime >= startTime && activity.startTime <= endTime && this.activities[0]. === 0;
        //const find = this.activities.find(activity => );
        //return !IsUndefined(find);
    }

    GetFirstTime() {
        let time = null;
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            if (time === null || activity.startTime < time) {
                time = activity.startTime;
            }
        }
        return time;
    }
    GetTimeFromFirst() {
        const initTime = this.GetFirstTime();
        if (initTime === null) return null;

        const initDate = new Date(initTime * 1000);
        const now = new Date();
        const diff = GetTime(now) - GetTime(initDate);
        return diff;
    }
    GetTotalDuration() {
        let totalDuration = 0;
        for (let a in this.activities) {
            const activity = this.activities[a];
            totalDuration += activity.duration;
        }
        return totalDuration;
    }

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
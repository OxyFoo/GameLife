import { UserManager } from "../Managers/UserManager";
import { isUndefined } from "../Functions/Functions";
import { GetTime } from "../Functions/Time";

import dataManager from "../Managers/DataManager";

class Activity {
    skillID = 0;
    startTime = 0;
    duration = 0;
}

class Activities {
    constructor(user) {
        /**
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
         * @type {?Array<Number, Number>}
         * [skillID, startTime]
         */
        this.currentActivity = null;
    }

    /**
     * @returns {Activity[]} activities
     */
    getAll() {
        return this.activities;
    }

    /**
     * @param {Activity[]} activities 
     */
    setAll(activities) {
        this.activities = activities;
    }

    isUnsaved() {
        return this.UNSAVED_activities.length > 0;
    }
    Purge() {
        this.UNSAVED_activities = [];
    }

    // TODO - Update or remove
    removeDeletedSkillsActivities() {
        /*for (let a in this.activities) {
            let activity = this.activities[a];
            let skillID = activity.skillID;
            const skill = dataManager.skills.getByID(skillID);
            if (skill === null) {
                this.Remove(activity);
                this.removeDeletedSkillsActivities();
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
            if (this.timeIsFree(startTime, duration)) {
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
                this.user.refreshStats();
            }
        }
        return output;
    }

    Remove(activity) {
        for (let i = 0; i < this.activities.length; i++) {
            if (this.AreEquals(this.activities[i], activity)) {
                this.activities.splice(i, 1);
                this.UNSAVED_activities.push(['rem', activity.skillID, activity.startTime, activity.duration ]);
                break;
            }
        }
        // TODO - Save (local & online or future)
        this.user.refreshStats();
    }

    AreEquals(activity1, activity2) {
        const sameSkillID = activity1.skillID === activity2.skillID;
        const sameStartTime = activity1.startTime === activity2.startTime;
        const sameDuration = activity1.duration === activity2.duration;
        return sameSkillID && sameStartTime && sameDuration;
    }

    getByDate(date = new Date()) {
        let output = [];
        const currDate = new Date(date);
        for (let i = 0; i < this.activities.length; i++) {
            const activity = this.activities[i];
            const activityDate = new Date(activity.startTime*1000);
            const sameYear = currDate.getFullYear() == activityDate.getFullYear();
            const sameMonth = currDate.getMonth() == activityDate.getMonth();
            const sameDate = currDate.getDate() == activityDate.getDate();
            if (sameYear && sameMonth && sameDate) {
                output.push(activity);
            }
        }
        return output;
    }
    containActivity(date = new Date(), onlyRelax = false) {
        date.setHours(0, 0, 0, 0);
        const startTime = GetTime(date);
        date.setHours(23, 59, 59, 999);
        const endTime = GetTime(date);

        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            if (activity.startTime >= startTime && activity.startTime <= endTime) {
                if (!onlyRelax) return true;
                if (dataManager.skills.getByID(activity.skillID).XP === 0) return true;
            }
        }
        return false;

        //const condNormalActivity = (activity) => activity.startTime >= startTime && activity.startTime <= endTime;
        //const condRelaxActivity = (activity) => activity.startTime >= startTime && activity.startTime <= endTime && this.activities[0]. === 0;
        //const find = this.activities.find(activity => );
        //return !isUndefined(find);
    }
    getFirst() {
        let date = new Date();
        if (this.activities.length) {
            date = new Date(this.activities[0].startTime);
        }
        date.setMinutes(date.getMinutes() - 1);
        return date;
    }
    getTotalDuration() {
        let totalDuration = 0;
        for (let a in this.activities) {
            const activity = this.activities[a];
            totalDuration += activity.duration;
        }
        return totalDuration;
    }

    timeIsFree(time, duration) {
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
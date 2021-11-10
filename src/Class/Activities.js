import { UserManager } from "../Managers/UserManager";
import { isUndefined } from "../Functions/Functions";

class Activity {
    skillID = 0;
    startDate = new Date();
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
        activities = [];
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

    removeDeletedSkillsActivities() {
        for (let a in this.activities) {
            let activity = this.activities[a];
            let skillID = activity.skillID;
            const skill = this.user.skills.getByID(skillID);
            if (typeof(skill) === 'undefined') {
                this.Remove(activity);
                this.removeDeletedSkillsActivities();
                break;
            }
        }
    }

    Add(skillID, startDate, duration, save = true) {
        let output = false;

        const newActivity = {
            skillID: skillID,
            startDate: startDate,
            duration: duration
        }

        const limitDate = new Date();
        limitDate.setFullYear(2021, 8, 29);
        if (startDate < limitDate) return;

        // Check if not exist
        let exists = false;
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            const activity_compare = {
                skillID: activity.skillID,
                startDate: activity.startDate,
                duration: activity.duration
            }
            if (activity_compare == newActivity) {
                exists = true;
            }
        }

        if (!exists) {
            if (this.datetimeIsFree(startDate, duration)) {
                // Add - Sort by date
                const activityDate = new Date(startDate);
                for (let a = 0; a < this.activities.length; a++) {
                    const arrayDate = new Date(this.activities[a].startDate);
                    if (activityDate < arrayDate) {
                        this.activities.splice(a, 0, newActivity);
                        output = true;
                        break;
                    }
                }
                if (!output) {
                    this.activities.push(newActivity);
                    output = true;
                }
                this.user.refreshStats(save);
            }
        }
        return output;
    }

    Remove(activity) {
        for (let i = 0; i < this.activities.length; i++) {
            if (this.activities[i] == activity) {
                this.activities.splice(i, 1);
                break;
            }
        }
        this.user.refreshStats();
    }

    getByDate(date) {
        let output = [];
        const currDate = isUndefined(date) ? new Date() : new Date(date);
        for (let i = 0; i < this.activities.length; i++) {
            const activity = this.activities[i];
            const activityDate = new Date(activity.startDate);
            const sameYear = currDate.getFullYear() == activityDate.getFullYear();
            const sameMonth = currDate.getMonth() == activityDate.getMonth();
            const sameDate = currDate.getDate() == activityDate.getDate();
            if (sameYear && sameMonth && sameDate) {
                output.push(activity);
            }
        }
        return output;
    }
    getFirst() {
        let date = new Date();
        if (this.activities.length) {
            date = new Date(this.activities[0].startDate);
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

    datetimeIsFree(date, duration) {
        const startDate = new Date(date);
        let output = true;
        const endDate = new Date(startDate);
        endDate.setMinutes(startDate.getMinutes() + duration - 1);
        for (let a = 0; a < this.activities.length; a++) {
            const activity = this.activities[a];
            const activityStartDate = new Date(activity.startDate);
            const activityEndDate = new Date(activityStartDate);
            activityEndDate.setMinutes(activityStartDate.getMinutes() + activity.duration - 1);
            const startDuringActivity = startDate > activityStartDate && startDate < activityEndDate;
            const aroundActivity = startDate <= activityStartDate && endDate >= activityEndDate;

            const endDuringActivity = endDate > activityStartDate && endDate < activityEndDate;
            if (startDuringActivity || endDuringActivity || aroundActivity) {
                output = false;
                break;
            }
        }
        return output;
    }
}

export default Activities;
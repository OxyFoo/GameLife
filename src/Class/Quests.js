import { UserManager } from "../Managers/UserManager";
import { IsUndefined } from "../Functions/Functions";

class Quests {
    constructor(user) {
        /**
         * @type {UserManager}
         */
        this.user = user;

        this.daily = [];
        this.todoList = [];
    }

    DailyAlreadyChanged() {
        let output = false;
        for (let d = 0; d < this.daily.length; d++) {
            const daily = this.daily[d];
            const dailyDate = new Date(daily.date);
            const today = new Date();

            const sameYear = today.getFullYear() == dailyDate.getFullYear();
            const sameMonth = today.getMonth() == dailyDate.getMonth();
            const sameDate = today.getDate() == dailyDate.getDate();
            if (sameYear && sameMonth && sameDate) {
                output = true;
                break;
            }
        }
        return output;
    }

    DailyOnChange(skillID1, skillID2) {
        const newDaily = {
            'skills': [ skillID1, skillID2 ],
            'date': new Date()
        }
        this.daily.push(newDaily);
        // TODO - Save user data
        //this.user.saveData();
    }

    DailyGetSkills() {
        if (this.daily.length) return this.daily[this.daily.length - 1];
        else return null;
    }

    DailyTodayCheck() {
        let state1 = 0;
        let state2 = 0;

        const dailyBonusCategory = this.DailyGetBonusCategory();
        if (this.daily.length) {
            const IDs = this.DailyGetSkills().skills;
            const today_activities = this.user.activities.GetByTime();
            for (let ta = 0; ta < today_activities.length; ta++) {
                const activity = today_activities[ta];
                const skillID = activity.skillID;
                const skill = this.user.dataManager.skills.GetByID(skillID);
                const category = skill.Category;
                if (IDs.includes(skillID)) {
                    state1 += activity.duration;
                }
                if (category == dailyBonusCategory) {
                    state2 += activity.duration;
                }
            }
        }

        state1 /= 60;
        state2 /= 15;

        return [ state1, state2 ];
    }

    DailyGetBonusCategory(date) {
        const skillsLength = this.user.dataManager.skills.skills.length;
        const today = IsUndefined(date) ? new Date() : new Date(date);
        const index = (today.getFullYear() * today.getMonth() * today.getDate() * 4) % skillsLength;
        const skill = this.user.dataManager.skills.skills[index];
        const category = skill.Category;
        return category;
    }

    TodoAdd(title, description) {
        let newTodo = {
            complete: false,
            title: title,
            description: description,
            subtasks: []
        }
        this.todoList.push(newTodo);
    }
    TodoEdit(index, complete, title, description) {
        if (index < 0 || index >= this.todoList.length) {
            return;
        }

        if (!IsUndefined(complete)) {
            this.todoList[index].complete = complete;
        }
        if (!IsUndefined(title)) {
            this.todoList[index].title = title;
        }
        if (!IsUndefined(description)) {
            this.todoList[index].description = description;
        }
    }
    TodoToggle(index) {
        if (index < 0 || index >= this.todoList.length) {
            return null;
        }
        this.todoList[index].complete = !this.todoList[index].complete;
        return this.todoList[index].complete;
    }
    TodoRemove(index) {
        if (index < 0 || index >= this.todoList.length) {
            return;
        }
        this.todoList.splice(index, 1);
    }
}

export default Quests;
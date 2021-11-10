import { isUndefined } from "../Functions/Functions";

class Quests {
    constructor(user) {
        this.user = user;
        this.daily = [];
        this.todoList = [];
    }

    dailyAlreadyChanged() {
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

    dailyOnChange(skillID1, skillID2) {
        const newDaily = {
            'skills': [ skillID1, skillID2 ],
            'date': new Date()
        }
        this.daily.push(newDaily);
        this.user.saveData();
    }

    dailyGetSkills() {
        if (this.daily.length) return this.daily[this.daily.length - 1];
        else return null;
    }

    dailyTodayCheck() {
        let state1 = 0;
        let state2 = 0;

        const dailyBonusCategory = this.dailyGetBonusCategory();
        if (this.daily.length) {
            const IDs = this.dailyGetSkills().skills;
            const today_activities = this.user.activities.getByDate();
            for (let ta = 0; ta < today_activities.length; ta++) {
                const activity = today_activities[ta];
                const skillID = activity.skillID;
                const skill = this.user.skills.getByID(skillID);
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

    dailyGetBonusCategory(date) {
        const skillsLength = this.user.skills.getAll().length;
        const today = isUndefined(date) ? new Date() : new Date(date);
        const index = (today.getFullYear() * today.getMonth() * today.getDate() * 4) % skillsLength;
        const skill = this.user.skills.getAll()[index];
        const category = skill.Category;
        return category;
    }

    todoAdd(title, description) {
        let newTodo = {
            complete: false,
            title: title,
            description: description,
            subtasks: []
        }
        this.todoList.push(newTodo);
    }
    todoEdit(index, complete, title, description) {
        if (index < 0 || index >= this.todoList.length) {
            return;
        }

        if (!isUndefined(complete)) {
            this.todoList[index].complete = complete;
        }
        if (!isUndefined(title)) {
            this.todoList[index].title = title;
        }
        if (!isUndefined(description)) {
            this.todoList[index].description = description;
        }
    }
    todoToggle(index) {
        if (index < 0 || index >= this.todoList.length) {
            return null;
        }
        this.todoList[index].complete = !this.todoList[index].complete;
        return this.todoList[index].complete;
    }
    todoRemove(index) {
        if (index < 0 || index >= this.todoList.length) {
            return;
        }
        this.todoList.splice(index, 1);
    }
}

export default Quests;
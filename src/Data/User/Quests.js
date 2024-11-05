import langManager from 'Managers/LangManager';

import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { Sum } from 'Utils/Functions';
import { DAY_TIME, GetDate, GetLocalTime, GetTimeZone } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 *
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
 * @typedef {import('Types/Data/User/Quests').QuestUnsaved} QuestUnsaved
 * @typedef {import('Types/Data/User/Quests').SaveObject_Quests} SaveObject_Quests
 *
 * @typedef {'title-empty' | 'title-exists' | 'skills-empty' | 'schedule-empty'} InputsError
 *
 * @typedef {'past' | 'filling' | 'future' | 'disabled'} DayClockStates
 *
 * @typedef {object} DayType
 * @property {number} day
 * @property {boolean} isToday
 * @property {DayClockStates} state
 * @property {number} progress Value between 0 and 1 (can be over 1 if more than 100%), Only used if state is 'past' or 'filling'
 */

/** @extends {IUserData<SaveObject_Quests>} */
class Quests extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('quests');

        this.user = user;
    }

    MAX_QUESTS = 5;

    /** @type {Quest[]} */
    #SAVED_quests = [];

    /** @type {Quest[]} */
    #UNSAVED_additions = [];

    /** @type {Quest[]} */
    #UNSAVED_deletions = [];

    /** @type {number[]} Sorted quests using created time */
    sort = [];

    /** @type {boolean} True if quests sort is saved */
    SAVED_sort = true;

    /**
     * @description All quests (saved and unsaved)
     * @type {DynamicVar<Quest[]>}
     */
    // eslint-disable-next-line prettier/prettier
    allQuests = new DynamicVar(/** @type {Quest[]} */ ([]));

    /** @type {number} */
    token = 0;

    Clear = () => {
        this.#SAVED_quests = [];
        this.#UNSAVED_additions = [];
        this.#UNSAVED_deletions = [];
        this.sort = [];
        this.SAVED_sort = true;
        this.allQuests.Set([]);
    };

    /**
     * Return all quests (save and unsaved) sorted by start time (ascending)
     * @returns {Quest[]}
     */
    Get = () => {
        let quests = [...this.#SAVED_quests, ...this.#UNSAVED_additions];

        // Add new quests at the top (use created time as index)
        quests.forEach((quest) => {
            if (this.sort.findIndex((created) => quest.created === created) === -1) {
                this.sort.splice(0, 0, quest.created);
                this.SAVED_sort = false;
            }
        });

        // Remove deleted quests from sort
        this.sort = this.sort.filter((created) => {
            const index = quests.findIndex((quest) => quest.created === created);
            if (index !== -1) return true;
            this.SAVED_sort = false;
            return false;
        });

        /** @type {Quest[]} */
        const sortedQuests = [];

        // Sort quests
        this.sort.forEach((created) => {
            const quest = quests.find((q) => q.created === created);
            if (quest) {
                sortedQuests.push(quest);
            }
        });

        return sortedQuests;
    };

    /** @param {Partial<SaveObject_Quests>} data */
    Load = (data) => {
        if (typeof data.quests !== 'undefined') this.#SAVED_quests = data.quests;
        if (typeof data.unsavedAdditions !== 'undefined') this.#UNSAVED_additions = data.unsavedAdditions;
        if (typeof data.unsavedDeletions !== 'undefined') this.#UNSAVED_deletions = data.unsavedDeletions;
        if (typeof data.sort !== 'undefined') this.sort = data.sort;
        if (typeof data.sortIsSaved !== 'undefined') this.SAVED_sort = data.sortIsSaved;
        if (typeof data.token !== 'undefined') this.token = data.token;

        this.allQuests.Set(this.Get());
    };

    /** @returns {SaveObject_Quests} */
    Save = () => {
        return {
            quests: this.#SAVED_quests,
            unsavedAdditions: this.#UNSAVED_additions,
            unsavedDeletions: this.#UNSAVED_deletions,
            sort: this.sort,
            sortIsSaved: this.SAVED_sort,
            token: this.token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-quests', token: this.token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-quests' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('warn', `[Quests] LoadOnline: ${response}`);
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        this.#SAVED_quests = response.result.quests;
        this.sort = response.result.sort;
        this.token = response.result.token;

        this.allQuests.Set(this.Get());
        this.user.interface.console?.AddLog('info', `[Quests] ${response.result.quests.length} quests loaded`);
        return true;
    };

    SaveOnline = async () => {
        if (this.isUnsaved() === false) {
            return true;
        }

        const unsaved = this.getUnsaved();
        if (typeof unsaved.data === 'undefined' || unsaved.data.length <= 0) {
            return true;
        }

        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-quests',
            quests: unsaved.data,
            sort: unsaved.sort,
            token: this.token
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'save-quests' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('warn', `[Quests] SaveOnline: ${response}`);
            return false;
        }

        if (response.result !== 'ok') {
            if (response.result === 'wrong-last-update') {
                this.user.interface.console?.AddLog('warn', `[Quests] SaveOnline: ${response.result}`);
                await this.LoadOnline();
                return false;
            }

            this.user.interface.console?.AddLog('warn', `[Quests] SaveOnline: ${response.result}`);
            return false;
        }

        if (typeof response.token !== 'undefined') {
            this.token = response.token;
        }

        this.purge();
        this.allQuests.Set(this.Get());
        this.user.interface.console?.AddLog('info', `[Quests] ${unsaved.data.length} quests saved`);
        return true;
    };

    /** @private */
    isUnsaved = () => {
        if (this.SAVED_sort === false) {
            return true;
        }
        if (this.#UNSAVED_additions.length || this.#UNSAVED_deletions.length) {
            return true;
        }
        return false;
    };

    /**
     * @private
     * @returns {{ data?: QuestUnsaved[], sort?: number[] }}
     */
    getUnsaved = () => {
        const data = {};

        if (this.#UNSAVED_additions.length || this.#UNSAVED_deletions.length) {
            /** @type {QuestUnsaved[]} */
            let unsaved = [];
            for (let a in this.#UNSAVED_additions) {
                const quest = this.#UNSAVED_additions[a];
                unsaved.push({ type: 'add', ...quest });
            }
            for (let a in this.#UNSAVED_deletions) {
                const quest = this.#UNSAVED_deletions[a];
                unsaved.push({ type: 'rem', ...quest });
            }
            data['data'] = unsaved;
        }

        if (this.SAVED_sort === false) {
            data['sort'] = this.sort;
        }

        return data;
    };

    /** @private */
    purge = () => {
        this.#SAVED_quests.push(...this.#UNSAVED_additions);
        this.#UNSAVED_additions = [];

        for (let i = this.#UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = this.GetIndex(this.#SAVED_quests, this.#UNSAVED_deletions[i]);
            if (index !== null) {
                this.#SAVED_quests.splice(index, 1);
            }
        }
        this.#UNSAVED_deletions = [];
        this.SAVED_sort = true;
    };

    IsMax = () => this.Get().length >= this.MAX_QUESTS;

    /**
     * @param {Quest} quest
     * @returns {InputsError[]} Null if no error
     */
    VerifyInputs = (quest) => {
        /** @type {InputsError[]} */
        const errors = [];

        // Check title
        if (quest.title.trim().length <= 0) {
            errors.push('title-empty');
        }

        // Check if title already exists
        if (this.Get().some((q) => q.title === quest.title.trim() && q.created !== quest.created)) {
            errors.push('title-exists');
        }

        // Check if skills are valid
        if (quest.skills.length <= 0) {
            errors.push('skills-empty');
        }

        // Check if repeat mode is valid
        if ((quest.schedule.type === 'week' || quest.schedule.type === 'month') && quest.schedule.repeat.length <= 0) {
            errors.push('schedule-empty');
        }

        return errors;
    };

    /**
     * @param {Quest} quest
     * @returns {string} Time text
     */
    GetQuestTimeText = (quest) => {
        if (quest === null) return '';

        const totalDuration = Sum(
            this.user.activities
                .GetByTime(GetLocalTime())
                .filter((activity) => quest.skills.includes(activity.skillID))
                .filter((activity) => this.user.activities.GetExperienceStatus(activity) === 'grant')
                .map((activity) => activity.duration)
        );

        const langTimes = langManager.curr['dates']['names'];
        const timeHour = Math.floor(totalDuration / 60);
        const timeMinute = totalDuration % 60;
        const goalHour = Math.floor(quest.schedule.duration / 60);
        const goalMinute = quest.schedule.duration % 60;

        if (goalHour <= 0 && goalMinute <= 0) {
            this.user.interface.console?.AddLog('warn', 'Quests - GetQuestTimeText: time is 0');
            return 'Error';
        }

        // Current time
        let text = '';
        if (timeHour > 0) {
            text += `${timeHour}${langTimes['hours-min']}`;
        }
        if (timeMinute > 0 || timeHour === 0) {
            text += ` ${timeMinute}${langTimes['minutes-min']}`;
        }

        // Goal time
        text += ' / ';
        if (goalHour > 0) {
            text += `${goalHour}${langTimes['hours-min']}`;
        }
        if (goalMinute > 0 || goalHour === 0) {
            text += ` ${goalMinute}${langTimes['minutes-min']}`;
        }

        return text;
    };

    /**
     * Add quest
     * @param {Quest} quest Auto define created time if equal to 0
     * @returns {'added' | 'already-added' | InputsError}
     */
    Add(quest) {
        if (quest.created === 0) {
            quest.created = GetLocalTime();
        }

        const errors = this.VerifyInputs(quest);
        if (errors.length > 0) {
            return errors[0];
        }

        // Check where the quest is
        const indexQuest = this.GetIndex(this.#SAVED_quests, quest);
        const indexUnsaved = this.GetIndex(this.#UNSAVED_additions, quest);
        const indexDeletion = this.GetIndex(this.#UNSAVED_deletions, quest);

        // Quest already exist
        if (indexQuest !== null || indexUnsaved !== null) {
            return 'already-added';
        }

        // Quest was deleted, remove it from deletion list
        if (indexDeletion !== null) {
            this.#UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Quest not exist, add it
        this.#UNSAVED_additions.push(quest);
        this.allQuests.Set(this.Get());
        return 'added';
    }

    /**
     * Add quest
     * @param {Quest} quest
     * @returns {'edited' | 'not-exists' | InputsError}
     */
    Edit(quest) {
        const errors = this.VerifyInputs(quest);
        if (errors.length > 0) {
            return errors[0];
        }

        // Check where the quest is
        const indexQuest = this.GetIndex(this.#SAVED_quests, quest);
        const indexUnsaved = this.GetIndex(this.#UNSAVED_additions, quest);
        const indexDeletion = this.GetIndex(this.#UNSAVED_deletions, quest);

        // Quest not exist
        if (indexQuest === null && indexUnsaved === null) {
            return 'not-exists';
        }

        // Quest was deleted, remove it from deletion list
        if (indexDeletion !== null) {
            this.#UNSAVED_deletions.splice(indexDeletion, 1);
        }

        if (indexQuest !== null) {
            this.#SAVED_quests.splice(indexQuest, 1, quest);
        }
        if (indexUnsaved !== null) {
            this.#UNSAVED_additions.splice(indexUnsaved, 1, quest);
        }

        // Add edited quests as new quest to save
        this.#UNSAVED_additions.push(quest);
        this.allQuests.Set(this.Get());
        return 'edited';
    }

    /**
     * Remove quest
     * @param {Quest} quest
     * @returns {'removed' | 'notExist'}
     */
    Remove(quest) {
        const indexQuest = this.GetIndex(this.#SAVED_quests, quest);
        const indexUnsaved = this.GetIndex(this.#UNSAVED_additions, quest);
        const indexDeletion = this.GetIndex(this.#UNSAVED_deletions, quest);
        let deleted = null;

        if (indexQuest !== null) {
            deleted = this.#SAVED_quests.splice(indexQuest, 1)[0];
            if (indexDeletion === null) {
                this.#UNSAVED_deletions.push(deleted);
            }
        }
        if (indexUnsaved !== null) {
            deleted = this.#UNSAVED_additions.splice(indexUnsaved, 1)[0];
            if (indexDeletion === null) {
                this.#UNSAVED_deletions.push(deleted);
            }
        }

        if (deleted !== null) {
            this.allQuests.Set(this.Get());
            return 'removed';
        }

        return 'notExist';
    }

    /**
     * Change sort order of quests titles
     * @param {Quest} quest
     * @param {number} newIndex
     * @returns {boolean} Success of the operation
     */
    Move(quest, newIndex) {
        if (!this.sort.includes(quest.created)) {
            this.user.interface.console?.AddLog(
                'warn',
                `Quests - move failed: quest not found (${quest.title} ${newIndex})`
            );
            return false;
        }
        if (newIndex < 0 || newIndex > this.sort.length) {
            this.user.interface.console?.AddLog(
                'warn',
                `Quests - move failed: index out of range (${quest.title} ${newIndex})`
            );
            return false;
        }
        const oldIndex = this.sort.indexOf(quest.created);
        if (oldIndex === newIndex) {
            this.user.interface.console?.AddLog(
                'warn',
                `Quests - move failed: same index (${quest.title} ${newIndex})`
            );
            return false;
        }
        this.sort.splice(oldIndex, 1);
        this.sort.splice(newIndex, 0, quest.created);
        this.SAVED_sort = false;
        this.allQuests.Set(this.Get());
        return true;
    }

    /**
     * @param {Quest[]} arr
     * @param {Quest} quest
     * @returns {number | null} Index of quest or null if not found
     */
    GetIndex(arr, quest) {
        const index = arr.findIndex((a) => a.created === quest.created);
        if (index === -1) return null;
        return index;
    }

    /**
     * @param {Quest} quest
     * @param {number} time in seconds
     * @returns {DayType[]} Days of the week
     */
    GetDays(quest, time = GetLocalTime()) {
        if (quest === null) return [];
        const { schedule } = quest;

        if (schedule.type === 'week' || schedule.type === 'month') {
            return this.getDayFromMonthOrWeek(quest, time);
        } else if (schedule.type === 'frequency') {
            if (schedule.frequencyMode === 'month') {
                return this.getDayFromFrequencyByMonth(quest, time);
            } else if (schedule.frequencyMode === 'week') {
                return this.getDayFromFrequencyByWeek(quest, time);
            }
        }

        return [];
    }

    /**
     * @param {Quest} quest
     * @param {number} time in seconds
     * @returns {DayType[]} Days of the week
     * @private
     */
    getDayFromMonthOrWeek(quest, time = GetLocalTime()) {
        const dateNow = GetDate(time);
        const currentDate = dateNow.getDate() - 1;
        const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
        const { skills, schedule } = quest;

        if (schedule.duration === 0) return []; // Avoid division by 0

        /** @type {DayType[]} */
        const days = [];

        for (let i = 0; i < 7; i++) {
            /** @type {DayClockStates} */
            let state = 'filling';
            let progress = 0;
            const isToday = i === currentDayIndex;

            // Disabled if not in repeat
            if (
                (schedule.type === 'week' && !schedule.repeat.includes(i)) ||
                (schedule.type === 'month' && !schedule.repeat.includes((currentDate - currentDayIndex + i + 31) % 31))
            ) {
                state = 'disabled';
            }

            // Filling if in repeat and not completed
            if (state !== 'disabled') {
                const deltaToNewDay = i - currentDayIndex;
                const activitiesNewDay = this.user.activities
                    .GetByTime(time + deltaToNewDay * DAY_TIME)
                    .filter((activity) => skills.includes(activity.skillID))
                    .filter((activity) => this.user.activities.GetExperienceStatus(activity) === 'grant');

                // Past
                if (deltaToNewDay <= 0) {
                    const totalDuration = Sum(activitiesNewDay.map((activity) => activity.duration));
                    progress = totalDuration / schedule.duration;
                    if (deltaToNewDay < 0) {
                        state = 'past';
                    }
                }

                // Future
                else if (deltaToNewDay > 0) {
                    state = 'future';
                }
            }

            days.push({ day: i, isToday, state, progress });
        }

        return days;
    }

    /**
     * @param {Quest} quest
     * @param {number} time in seconds
     * @returns {DayType[]} Days of the week
     * @private
     */
    getDayFromFrequencyByMonth(quest, time = GetLocalTime()) {
        const dateNow = GetDate(time);
        const currentDate = new Date().getDate();
        const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
        const maxDate = currentDate + 7 - currentDayIndex;
        const firstDateWeek = currentDate - currentDayIndex;
        const { skills, schedule } = quest;

        /** @type {DayType[]} */
        const days = [];

        // Avoid division by 0
        if (schedule.type !== 'frequency' || schedule.frequencyMode !== 'month' || schedule.duration === 0) {
            return days;
        }

        const firstDayMonth = new Date();
        firstDayMonth.setDate(1);
        const firstTime = firstDayMonth.setHours(0, 0, 0, 0) / 1000;

        let dayFilled = 0;
        const activities = this.user.activities
            .Get()
            .filter((activity) => activity.startTime + activity.timezone * 3600 >= firstTime)
            .filter((activity) => skills.includes(activity.skillID))
            .filter((activity) => this.user.activities.GetExperienceStatus(activity) === 'grant');

        for (let i = 0; i < maxDate; i++) {
            const day = i - firstDateWeek + 1;

            /** @type {DayType} */
            const newDay = {
                day,
                state: 'disabled',
                isToday: day === currentDayIndex,
                progress: 0
            };

            const deltaToNewDay = day - currentDayIndex;

            const activitiesDay = activities.filter(
                (activity) =>
                    activity.startTime + activity.timezone * 3600 >= firstTime + i * DAY_TIME &&
                    activity.startTime + activity.timezone * 3600 < firstTime + (i + 1) * DAY_TIME
            );

            const totalDuration = Sum(activitiesDay.map((activity) => activity.duration));

            if (dayFilled < schedule.quantity) {
                newDay.state = 'filling';
                newDay.progress = totalDuration / schedule.duration;

                if (deltaToNewDay < 0) {
                    newDay.state = 'past';
                } else if (deltaToNewDay > 0) {
                    newDay.state = 'future';
                }

                if (totalDuration >= schedule.duration) {
                    dayFilled++;
                }
            }

            if (day >= 0) {
                days.push(newDay);
            }
        }

        return days;
    }

    /**
     * @param {Quest} quest
     * @param {number} time in seconds
     * @returns {DayType[]} Days of the week
     * @private
     */
    getDayFromFrequencyByWeek(quest, time = GetLocalTime()) {
        const dateNow = GetDate(time);
        const currentDate = new Date().getDate();
        const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
        const { skills, schedule } = quest;

        /** @type {DayType[]} */
        const days = [];

        // Avoid division by 0
        if (schedule.type !== 'frequency' || schedule.frequencyMode !== 'week' || schedule.duration === 0) {
            return days;
        }

        const firstDayWeek = new Date();
        firstDayWeek.setDate(currentDate - currentDayIndex);
        const firstTime = firstDayWeek.setHours(0, 0, 0, 0) / 1000;

        let dayFilled = 0;
        const activities = this.user.activities
            .Get()
            .filter((activity) => activity.startTime + activity.timezone * 3600 >= firstTime)
            .filter((activity) => skills.includes(activity.skillID))
            .filter((activity) => this.user.activities.GetExperienceStatus(activity) === 'grant');

        for (let i = 0; i < 7; i++) {
            /** @type {DayType} */
            const newDay = {
                day: i,
                state: 'disabled',
                isToday: i === currentDayIndex,
                progress: 0
            };

            const deltaToNewDay = i - currentDayIndex;

            const activitiesDay = activities.filter(
                (activity) =>
                    activity.startTime + activity.timezone * 3600 >= firstTime + i * DAY_TIME &&
                    activity.startTime + activity.timezone * 3600 < firstTime + (i + 1) * DAY_TIME
            );

            const totalDuration = Sum(activitiesDay.map((activity) => activity.duration));

            if (dayFilled < schedule.quantity) {
                newDay.state = 'filling';
                newDay.progress = totalDuration / schedule.duration;

                if (deltaToNewDay < 0) {
                    newDay.state = 'past';
                } else if (deltaToNewDay > 0) {
                    newDay.state = 'future';
                }

                if (totalDuration >= schedule.duration) {
                    dayFilled++;
                }
            }

            days.push(newDay);
        }

        return days;
    }

    /**
     * @param {Quest} quest
     * @returns {number} Streak
     */
    GetStreak(quest) {
        let streak = 0;

        if (quest.schedule.type === 'week' || quest.schedule.type === 'month') {
            streak = this.getStreakFromMonthOrWeek(quest);
        } else if (quest.schedule.type === 'frequency') {
            if (quest.schedule.frequencyMode === 'month') {
                streak = this.getStreakFromFrequencyByMonth(quest);
            } else if (quest.schedule.frequencyMode === 'week') {
                streak = this.getStreakFromFrequencyByWeek(quest);
            }
        }

        if (streak > quest.maximumStreak) {
            const newQuest = Object.assign({}, quest);
            newQuest.maximumStreak = streak;
            this.Edit(newQuest);
            this.user.GlobalSave();
        }

        return streak;
    }

    /**
     * @param {Quest} quest
     * @returns {number} Streak
     */
    getStreakFromMonthOrWeek(quest) {
        let streak = 0;
        const timeNow = GetLocalTime();
        const todayMidnight = timeNow - (timeNow % DAY_TIME) - GetTimeZone() * 60 * 60;

        const allActivitiesTime = this.user.activities
            .Get()
            .filter((activity) => quest.skills.includes(activity.skillID))
            .filter((activity) => this.user.activities.GetExperienceStatus(activity) === 'grant')
            .map((activity) => ({
                localStart: activity.startTime + activity.timezone * 60 * 60,
                duration: activity.duration
            }));

        let n = allActivitiesTime.length;
        let currDuration = 0;
        let lastMidnight = todayMidnight;

        if (allActivitiesTime.length === 0) {
            return 0;
        }

        while (true) {
            // Skip days that are not in repeat
            const day = GetDate(lastMidnight + GetTimeZone() * 60 * 60);
            if (quest.schedule.type === 'week') {
                const dayIndex = (day.getDay() + 7 - 1) % 7;
                if (!quest.schedule.repeat.includes(dayIndex)) {
                    currDuration = 0;
                    lastMidnight -= DAY_TIME;
                    continue;
                }
            } else if (quest.schedule.type === 'month') {
                const dayIndex = day.getDate() - 1;
                if (!quest.schedule.repeat.includes(dayIndex)) {
                    currDuration = 0;
                    lastMidnight -= DAY_TIME;
                    continue;
                }
            }

            // Check if there is no more activities
            if (--n < 0) {
                break;
            }

            // Add duration of activities in the same day
            const activity = allActivitiesTime[n];
            if (activity.localStart > lastMidnight + DAY_TIME) {
                continue;
            }
            const currDay = activity.localStart >= lastMidnight;
            if (currDay) {
                currDuration += activity.duration;
            }

            // Check if streak is broken
            const isToday = lastMidnight === todayMidnight;
            const isComplete = currDuration >= quest.schedule.duration;
            if (!currDay && !isToday && !isComplete) {
                break;
            }

            // Check if streak is continued
            if (isComplete) {
                streak++;
                currDuration = 0;
                lastMidnight -= DAY_TIME;
            }

            // Check if streak is continued even if not complete (only if today)
            else if (isToday) {
                n++;
                currDuration = 0;
                lastMidnight -= DAY_TIME;
            }
        }

        return streak;
    }

    // TODO: Implement this
    /**
     * @param {Quest} quest
     * @returns {number} Streak
     */
    getStreakFromFrequencyByMonth(quest) {
        return -1;
    }

    // TODO: Implement this
    /**
     * @param {Quest} quest
     * @returns {number} Streak
     */
    getStreakFromFrequencyByWeek(quest) {
        return -1;
    }
}

export default Quests;

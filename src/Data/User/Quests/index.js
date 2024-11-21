import langManager from 'Managers/LangManager';

import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { Sum } from 'Utils/Functions';
import { GetLocalTime } from 'Utils/Time';
import { getDayFromFrequencyByMonth, getDayFromFrequencyByWeek, getDayFromMonthOrWeek } from './days';
import { getStreakFromFrequencyByMonth, getStreakFromFrequencyByWeek, getStreakFromMonthOrWeek } from './streaks';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 *
 * @typedef {import('./days').DayType} DayType
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
 * @typedef {import('Types/Data/User/Quests').QuestSaved} QuestSaved
 * @typedef {import('Types/Data/User/Quests').SaveObject_Quests} SaveObject_Quests
 *
 * @typedef {'title-empty' | 'title-exists' | 'skills-empty' | 'schedule-empty'} InputsError
 *
 */

/** @extends {IUserData<SaveObject_Quests>} */
class Quests extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('quests');

        this.user = user;
    }

    MAX_QUESTS = 5;

    /** @type {QuestSaved[]} */
    #SAVED_quests = [];

    /** @type {Quest[]} */
    #UNSAVED_additions = [];

    /** @type {QuestSaved[]} */
    #UNSAVED_editions = [];

    /** @type {number[]} */
    #UNSAVED_deletions = [];

    /** @type {number[]} Sorted quests using created time */
    sort = [];

    /** @type {boolean} True if quests sort is saved */
    #SAVED_sort = true;

    /**
     * @description All quests (saved and unsaved)
     * @type {DynamicVar<Quest[]>}
     */
    // eslint-disable-next-line prettier/prettier
    allQuests = new DynamicVar(/** @type {Quest[]} */ ([]));

    /** @type {number} */
    #token = 0;

    Clear = () => {
        this.#SAVED_quests = [];
        this.#UNSAVED_additions = [];
        this.#UNSAVED_editions = [];
        this.#UNSAVED_deletions = [];
        this.sort = [];
        this.#SAVED_sort = true;
        this.allQuests.Set([]);
        this.#token = 0;
    };

    /**
     * Return all quests (save and unsaved) sorted by start time (ascending)
     * @returns {(Quest | QuestSaved)[]}
     */
    Get = () => {
        // Get all saved quests
        const savedQuests = [...this.#SAVED_quests];

        // Apply unsaved editions
        for (const editQuest of this.#UNSAVED_editions) {
            const index = this.#UNSAVED_editions.findIndex((q) => q.ID === editQuest.ID);
            if (index !== -1) {
                savedQuests[index] = editQuest;
            }
        }

        // Apply unsaved deletions
        for (const questID of this.#UNSAVED_deletions) {
            const index = savedQuests.findIndex((q) => q.ID === questID);
            if (index !== -1) {
                savedQuests.splice(index, 1);
            }
        }

        // Apply unsaved additions
        /** @type {(Quest | QuestSaved)[]} */
        const quests = [...savedQuests, ...this.#UNSAVED_additions];

        return this.GetSort(quests)
            .map((created) => quests.findIndex((q) => q.created === created))
            .filter((index) => index !== -1)
            .map((index) => quests[index]);
    };

    GetSort = (quests = this.Get()) => {
        // Add new quests at the top (use created time as index)
        quests.forEach((quest) => {
            if (this.sort.findIndex((created) => quest.created === created) === -1) {
                this.sort.splice(0, 0, quest.created);
                this.#SAVED_sort = false;
            }
        });

        // Remove deleted quests from sort
        this.sort = this.sort.filter((created) => {
            const index = quests.findIndex((quest) => quest.created === created);
            if (index !== -1) return true;
            this.#SAVED_sort = false;
            return false;
        });

        return this.sort;
    };

    /** @param {Partial<SaveObject_Quests>} data */
    Load = (data) => {
        if (typeof data.quests !== 'undefined') this.#SAVED_quests = data.quests;
        if (typeof data.unsavedAdditions !== 'undefined') this.#UNSAVED_additions = data.unsavedAdditions;
        if (typeof data.unsavedEditions !== 'undefined') this.#UNSAVED_editions = data.unsavedEditions;
        if (typeof data.unsavedDeletions !== 'undefined') this.#UNSAVED_deletions = data.unsavedDeletions;
        if (typeof data.sort !== 'undefined') this.sort = data.sort;
        if (typeof data.sortIsSaved !== 'undefined') this.#SAVED_sort = data.sortIsSaved;
        if (typeof data.token !== 'undefined') this.#token = data.token;

        this.allQuests.Set(this.Get());
    };

    /** @returns {SaveObject_Quests} */
    Save = () => {
        return {
            quests: this.#SAVED_quests,
            unsavedAdditions: this.#UNSAVED_additions,
            unsavedEditions: this.#UNSAVED_editions,
            unsavedDeletions: this.#UNSAVED_deletions,
            sort: this.sort,
            sortIsSaved: this.#SAVED_sort,
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-quests', token: this.#token });

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

        this.sort = response.result.sort;
        this.#SAVED_quests = response.result.quests;
        this.#token = response.result.token;

        this.allQuests.Set(this.Get());
        this.user.interface.console?.AddLog('info', `[Quests] ${response.result.quests.length} quests loaded`);
        return true;
    };

    /** @returns {Promise<boolean>} */
    SaveOnline = async (attempt = 1) => {
        if (this.#isUnsaved() === false) {
            return true;
        }

        const unsaved = this.#getUnsaved();
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-quests',
            questsToAdd: unsaved.quests.add,
            questsToEdit: unsaved.quests.edit,
            questsToDelete: unsaved.quests.delete,
            sort: unsaved.sort,
            token: this.#token
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

        if (response.result === 'wrong-quests') {
            this.user.interface.console?.AddLog('error', `[Quests] SaveOnline: ${response.result}`, unsaved);
            this.Clear();
            await this.LoadOnline();
            return false;
        }

        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.user.interface.console?.AddLog('warn', `[Quests] SaveOnline: "not-up-to-date", no more attempts`);
                return false;
            }

            this.user.interface.console?.AddLog('warn', `[Quests] SaveOnline: "not-up-to-date", retrying...`);
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1);
        }

        this.#purge(response.result.newQuests);
        this.allQuests.Set(this.Get());
        this.#token = response.result.token;

        this.user.interface.console?.AddLog('info', `[Quests] ${response.result.newQuests.length} quests saved`);
        return true;
    };

    #isUnsaved = () => {
        return (
            this.#UNSAVED_additions.length > 0 ||
            this.#UNSAVED_editions.length > 0 ||
            this.#UNSAVED_deletions.length > 0 ||
            this.#SAVED_sort === false
        );
    };

    /** @returns {{ quests: { add: Quest[], edit: QuestSaved[], delete: number[] }, sort: number[] }} */
    #getUnsaved = () => {
        return {
            quests: {
                add: this.#UNSAVED_additions,
                edit: this.#UNSAVED_editions,
                delete: this.#UNSAVED_deletions
            },
            sort: this.sort
        };
    };

    /** @param {QuestSaved[]} newQuests */
    #purge = (newQuests) => {
        // Apply unsaved editions
        for (const editQuest of this.#UNSAVED_editions) {
            const index = this.#SAVED_quests.findIndex((quest) => quest.ID === editQuest.ID);
            if (index !== -1) {
                this.#SAVED_quests[index] = editQuest;
            }
        }

        // Apply unsaved deletions
        for (const questID of this.#UNSAVED_deletions) {
            const index = this.#SAVED_quests.findIndex((quest) => quest.ID === questID);
            if (index !== -1) {
                this.#SAVED_quests.splice(index, 1);
            }
        }

        // Apply new quests
        this.#SAVED_quests.push(...newQuests);

        this.#SAVED_sort = true;
        this.#UNSAVED_additions = [];
        this.#UNSAVED_editions = [];
        this.#UNSAVED_deletions = [];
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

        // Quest already exist
        if ([...this.#SAVED_quests, ...this.#UNSAVED_additions].some((q) => q.created === quest.created)) {
            return 'already-added';
        }

        // Quest not exist, add it
        this.#UNSAVED_additions.push(quest);
        this.allQuests.Set(this.Get());
        return 'added';
    }

    /**
     * Add quest
     * @param {Quest | QuestSaved} oldQuest
     * @param {Quest | QuestSaved} newQuest
     * @returns {'wrong-id' | 'edited' | 'not-exists' | InputsError}
     */
    Edit(oldQuest, newQuest) {
        if (oldQuest.created !== newQuest.created) {
            return 'wrong-id';
        }

        const errors = this.VerifyInputs(newQuest);
        if (errors.length > 0) {
            return errors[0];
        }

        const isSavedQuest = Object.keys(oldQuest).includes('ID');

        if (isSavedQuest) {
            // eslint-disable-next-line prettier/prettier
            const _quest = /** @type {QuestSaved} */ (oldQuest);

            // eslint-disable-next-line prettier/prettier
            const _newQuest = /** @type {QuestSaved} */ (newQuest);

            // eslint-disable-next-line prettier/prettier
            if (!newQuest.hasOwnProperty('ID') || /** @type {QuestSaved} */ (newQuest).ID !== _quest.ID) {
                return 'wrong-id';
            }

            const indexUnsavedQuest = this.#SAVED_quests.findIndex((q) => q.ID === _quest.ID);
            if (indexUnsavedQuest === -1) {
                return 'not-exists';
            }

            const indexUnsavedEdition = this.#UNSAVED_editions.findIndex((q) => q.ID === _quest.ID);

            // Quest not edited yet
            if (indexUnsavedEdition === -1) {
                this.#UNSAVED_editions.push(_newQuest);
            } else {
                this.#UNSAVED_editions[indexUnsavedEdition] = _newQuest;
            }

            this.allQuests.Set(this.Get());
            return 'edited';
        } else {
            const indexUnsavedQuest = this.#UNSAVED_additions.findIndex((q) => q.created === oldQuest.created);
            if (indexUnsavedQuest === -1) {
                return 'not-exists';
            }

            this.#UNSAVED_additions[indexUnsavedQuest] = newQuest;
            this.allQuests.Set(this.Get());
            return 'edited';
        }
    }

    /**
     * Remove quest
     * @param {Quest | QuestSaved} quest
     * @returns {'removed' | 'notExist' | 'already-removed'}
     */
    Remove(quest) {
        const isSavedQuest = Object.keys(quest).includes('ID');

        // Quest already saved
        if (isSavedQuest) {
            // eslint-disable-next-line prettier/prettier
            const _quest = /** @type {QuestSaved} */ (quest);

            const indexUnsavedQuest = this.#SAVED_quests.findIndex((q) => q.ID === _quest.ID);
            if (indexUnsavedQuest === -1) {
                return 'notExist';
            }

            const indexUnsavedDeletion = this.#UNSAVED_deletions.findIndex((q) => q === _quest.ID);

            // Quest already removed
            if (indexUnsavedDeletion !== -1) {
                return 'already-removed';
            }

            this.#UNSAVED_deletions.push(_quest.ID);
            this.allQuests.Set(this.Get());
            return 'removed';
        }

        // Quest not saved
        const indexUnsavedQuest = this.#UNSAVED_additions.findIndex((q) => q.created === quest.created);
        if (indexUnsavedQuest === -1) {
            return 'notExist';
        }

        this.#UNSAVED_additions.splice(indexUnsavedQuest, 1);
        this.allQuests.Set(this.Get());
        return 'removed';
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
        this.#SAVED_sort = false;
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
            return getDayFromMonthOrWeek(this.user.activities, quest, time);
        } else if (schedule.type === 'frequency') {
            if (schedule.frequencyMode === 'month') {
                return getDayFromFrequencyByMonth(this.user.activities, quest, time);
            } else if (schedule.frequencyMode === 'week') {
                return getDayFromFrequencyByWeek(this.user.activities, quest, time);
            }
        }

        return [];
    }

    /**
     * @param {Quest} quest
     * @returns {number} Streak
     */
    GetStreak(quest) {
        let streak = 0;

        if (quest.schedule.type === 'week' || quest.schedule.type === 'month') {
            streak = getStreakFromMonthOrWeek(this.user.activities, quest);
        } else if (quest.schedule.type === 'frequency') {
            if (quest.schedule.frequencyMode === 'month') {
                streak = getStreakFromFrequencyByMonth(quest);
            } else if (quest.schedule.frequencyMode === 'week') {
                streak = getStreakFromFrequencyByWeek(quest);
            }
        }

        if (streak > quest.maximumStreak) {
            const newQuest = Object.assign({}, quest);
            newQuest.maximumStreak = streak;
            this.Edit(quest, newQuest);
            this.user.GlobalSave();
        }

        return streak;
    }
}

export default Quests;

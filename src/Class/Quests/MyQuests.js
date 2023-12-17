import DynamicVar from 'Utils/DynamicVar';
import { Sum } from 'Utils/Functions';
import { DAY_TIME, GetDate, GetTime } from 'Utils/Time';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {'week' | 'month'} RepeatModes
 * @typedef {'title-empty' | 'title-exists' | 'skills-empty' | 'schedule-empty'} InputsError
 * 
 * @typedef {object} Schedule
 * @property {RepeatModes} type
 * @property {Array<number>} repeat
 * @property {number} duration In minutes
 * 
 * @typedef {'normal' | 'full' | 'filling' | 'disabled'} DayClockStates
 * 
 * @typedef {object} DayType
 * @property {number} day
 * @property {boolean} isToday
 * @property {DayClockStates} state
 * @property {number} [fillingValue] Only used if state === 'filling'
 */

class MyQuest {
    /** @type {string} Quest title with max 128 characters */
    title = '';

    /** @type {string} Quest description with max 2048 characters */
    comment = '';

    /** @type {number} Timestamp in seconds */
    created = 0;

    /** @type {Schedule} Null to don't repeat */
    schedule = {
        type: 'week',
        repeat: [],
        duration: 0
    };

    /** @type {Array<number>} Skills ids */
    skills = [];
}

class MyQuests {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {Array<MyQuest>} */
    SAVED_quests = [];

    /** @type {Array<MyQuest>} */
    UNSAVED_additions = [];

    /** @type {Array<MyQuest>} */
    UNSAVED_deletions = [];

    /** @type {Array<number>} Sorted quests using created time */
    questsSort = [];

    /** @type {boolean} True if quests sort is saved */
    SAVED_sort = true;

    /**
     * @description All quests (saved and unsaved)
     * @type {DynamicVar<Array<MyQuest>>}
     */
    allQuests = new DynamicVar([]);

    Clear() {
        this.SAVED_quests = [];
        this.UNSAVED_additions = [];
        this.UNSAVED_deletions = [];
        this.questsSort = [];
        this.SAVED_sort = true;
        this.allQuests.Set([]);
    }
    Load(quests) {
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('quests'))     this.SAVED_quests = quests['quests'];
        if (contains('additions'))  this.UNSAVED_additions = quests['additions'];
        if (contains('deletions'))  this.UNSAVED_deletions = quests['deletions'];
        if (contains('questsSort')) this.questsSort = quests['questsSort'];
        if (contains('sortSaved'))  this.SAVED_sort = quests['sortSaved'];
        this.allQuests.Set(this.Get());
    }
    LoadOnline(quests) {
        if (typeof(quests) !== 'object') return;
        this.SAVED_quests = quests.map(quest => Object.assign(new MyQuest(), quest));
        this.user.interface.console.AddLog('info', `${this.SAVED_quests.length} quests loaded`);
        this.allQuests.Set(this.Get());
    }
    Save() {
        const quests = {
            quests: this.SAVED_quests,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            questsSort: this.questsSort,
            sortSaved: this.SAVED_sort
        };
        return quests;
    }
    /**
     * Return all quests (save and unsaved) sorted by start time (ascending)
     * @returns {Array<MyQuest>}
     */
    Get() {
        let quests = [ ...this.SAVED_quests, ...this.UNSAVED_additions ];

        // Add new quests at the top (use created time as index)
        quests.forEach(quest =>
            this.questsSort.findIndex(created => quest.created === created) === -1 &&
            this.questsSort.splice(0, 0, quest.created)
        );

        // Remove deleted quests from sort
        this.questsSort = this.questsSort.filter(created => 
            quests.findIndex(quest => quest.created === created) !== -1
        );

        return this.questsSort.map(created =>
            quests.find(quest => quest.created === created)
        );
    }

    IsUnsaved = () => {
        return this.UNSAVED_additions.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_additions) {
            const quest = this.UNSAVED_additions[a];
            unsaved.push({ action: 'add', ...quest });
        }
        for (let a in this.UNSAVED_deletions) {
            const quest = this.UNSAVED_deletions[a];
            unsaved.push({ action: 'rem', ...quest });
        }
        return unsaved;
    }
    Purge = () => {
        this.SAVED_quests.push(...this.UNSAVED_additions);
        this.UNSAVED_additions = [];

        for (let i = this.UNSAVED_deletions.length - 1; i >= 0; i--) {
            const index = this.GetIndex(this.SAVED_quests, this.UNSAVED_deletions[i]);
            if (index !== null) {
                this.SAVED_quests.splice(index, 1);
            }
        }
        this.UNSAVED_deletions = [];
        this.SAVED_sort = true;
    }

    /**
     * @param {MyQuest} quest
     * @returns {Array<InputsError>} Null if no error
     */
    VerifyInputs = (quest) => {
        /** @type {Array<InputsError>} */
        const errors = [];

        // Check title
        if (quest.title.trim().length <= 0) {
            errors.push('title-empty');
        }

        // Check if title already exists
        if (this.Get().some(q => q.title === quest.title && q.created !== quest.created)) {
            errors.push('title-exists');
        }

        // Check if skills are valid
        if (quest.skills.length <= 0) {
            errors.push('skills-empty');
        }

        // Check if repeat mode is valid
        if (quest.schedule.repeat.length <= 0) {
            errors.push('schedule-empty');
        }

        return errors;
    }

    /**
     * Add quest
     * @param {MyQuest} quest Auto define created time if null
     * @returns {'added' | 'edited' | InputsError}
     */
    AddOrEdit(quest) {
        quest.created ??= GetTime(undefined, 'local');

        const errors = this.VerifyInputs(quest);
        if (errors.length > 0) {
            return errors[0];
        }

        // Check where the quest is
        const indexQuest = this.GetIndex(this.SAVED_quests, quest);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, quest);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, quest);

        // Quest was deleted, remove it from deletion list
        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Quest already exist
        if (indexQuest !== null || indexUnsaved !== null) {
            if (indexQuest !== null) {
                this.SAVED_quests.splice(indexQuest, 1, quest);
            }
            if (indexUnsaved !== null) {
                this.UNSAVED_additions.splice(indexUnsaved, 1, quest);
            }

            // Add edited quests as new quest to save
            this.UNSAVED_additions.push(quest);
            this.allQuests.Set(this.Get());
            return 'edited';
        }

        // Quest not exist, add it
        this.UNSAVED_additions.push(quest);
        this.allQuests.Set(this.Get());
        return 'added';
    }

    /**
     * Remove quest
     * @param {MyQuest} quest
     * @returns {'removed' | 'notExist'}
     */
    Remove(quest) {
        const indexQuest = this.GetIndex(this.SAVED_quests, quest);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, quest);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, quest);
        let deleted = null;

        if (indexQuest !== null) {
            deleted = this.SAVED_quests.splice(indexQuest, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
            }
        }
        if (indexUnsaved !== null) {
            deleted = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
            if (indexDeletion === null) {
                this.UNSAVED_deletions.push(deleted);
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
     * @param {MyQuest} quest
     * @param {number} newIndex
     * @returns {boolean} Success of the operation
     */
    Move(quest, newIndex) {
        if (!this.questsSort.includes(quest.created)) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: quest not found (${quest.title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.questsSort.length) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: index out of range (${quest.title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.questsSort.indexOf(quest.created);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: same index (${quest.title} ${newIndex})`);
            return false;
        }
        this.questsSort.splice(oldIndex, 1);
        this.questsSort.splice(newIndex, 0, quest.created);
        this.SAVED_sort = false;
        this.allQuests.Set(this.Get());
        return true;
    }

    /**
     * @param {Array<MyQuest>} arr
     * @param {MyQuest} quest
     * @returns {number | null} Index of quest or null if not found
     */
    GetIndex(arr, quest) {
        const index = arr.findIndex(a => a.created === quest.created);
        if (index === -1) return null;
        return index;
    }

    /**
     * @param {MyQuest} quest
     * @param {number} time in seconds
     */
    GetDays(quest, time = GetTime(undefined, 'local')) {
        if (quest === null) return [];

        const dateNow = GetDate(time);
        const currentDate = dateNow.getDate() - 1;
        const currentDayIndex = (dateNow.getDay() - 1 + 7) % 7;
        const { skills, schedule: { type, repeat, duration } } = quest;

        if (duration === 0) return []; // Avoid division by 0

        /** @type {Array<DayType>} */
        const days = [];

        for (let i = 0; i < 7; i++) {
            const isToday = i === currentDayIndex;

            /** @type {DayClockStates} */
            let state = 'normal';
            let fillingValue = 0;

            // Disabled if not in repeat
            if (type === 'week' && !repeat.includes(i)) {
                state = 'disabled';
            } else if (type === 'month' && !repeat.includes((currentDate - currentDayIndex + i + 31) % 31)) {
                state = 'disabled';
            }

            // Filling if in repeat and not completed
            if (state !== 'disabled') {
                const deltaToNewDay = i - currentDayIndex;
                const activitiesNewDay = this.user.activities
                    .GetByTime(time + deltaToNewDay * DAY_TIME)
                    .filter(activity => skills.includes(activity.skillID))
                    .filter(activity => this.user.activities.GetExperienceStatus(activity) === 'grant');

                if (deltaToNewDay <= 0) {
                    const totalDuration = Sum(activitiesNewDay.map(activity => activity.duration));
                    const progress = totalDuration / duration;
                    state = progress >= 1 ? 'full' : 'filling';
                    fillingValue = Math.min(progress, 1) * 100;
                }
                else if (deltaToNewDay > 0) {
                    state = 'normal';
                }
            }

            days.push({ day: i, isToday, state, fillingValue });
        }

        return days;
    }

    /** @param {MyQuest} quest */
    GetStreak(quest) {
        let i = 0;
        let streak = 0;
        const timeNow = GetTime(undefined, 'local');

        while (true) {
            const week = this
                .GetDays(quest, timeNow - i++ * DAY_TIME * 7)
                .filter(day => !['disabled', 'normal', 'filling'].includes(day.state))
                .reverse();

            if (week.length === 0 && i !== 1) {
                return streak;
            }

            for (let i = 0; i < week.length; i++) {
                if (week[i].state !== 'full' && !week[i].isToday) {
                    return streak;
                } else if (week[i].state === 'full') {
                    streak++;
                }
            }
        }
    }
}

export { MyQuest };
export default MyQuests;

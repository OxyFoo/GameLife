import DynamicVar from 'Utils/DynamicVar';
import { Sum } from 'Utils/Functions';
import { DAY_TIME, GetDate, GetLocalTime, GetTimeZone } from 'Utils/Time';

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

    /** @type {number} Maximum consecutive days */
    maximumStreak = 0;
}

class MyQuests {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    MAX_QUESTS = 10;

    /** @type {Array<MyQuest>} */
    SAVED_quests = [];

    /** @type {Array<MyQuest>} */
    UNSAVED_additions = [];

    /** @type {Array<MyQuest>} */
    UNSAVED_deletions = [];

    /** @type {Array<number>} Sorted quests using created time */
    sort = [];

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
        this.sort = [];
        this.SAVED_sort = true;
        this.allQuests.Set([]);
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('quests'))     this.SAVED_quests = data['quests'];
        if (contains('additions'))  this.UNSAVED_additions = data['additions'];
        if (contains('deletions'))  this.UNSAVED_deletions = data['deletions'];
        if (contains('sort'))       this.sort = data['sort'];
        if (contains('sortSaved'))  this.SAVED_sort = data['sortSaved'];
        this.allQuests.Set(this.Get());
    }
    LoadOnline(data) {
        if (typeof(data) !== 'object') return;
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('data')) {
            this.SAVED_quests = data['data'].map(quest => Object.assign(new MyQuest(), quest));
            this.user.interface.console.AddLog('info', `${this.SAVED_quests.length} quests loaded`);
            this.allQuests.Set(this.Get());
        }
        if (contains('sort')) this.sort = data['sort'];
    }
    Save() {
        const quests = {
            quests: this.SAVED_quests,
            additions: this.UNSAVED_additions,
            deletions: this.UNSAVED_deletions,
            sort: this.sort,
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
        quests.forEach(quest => {
            if (this.sort.findIndex(created => quest.created === created) === -1) {
                this.sort.splice(0, 0, quest.created);
                this.SAVED_sort = false;
            }
        });

        // Remove deleted quests from sort
        this.sort = this.sort.filter(created => {
            const index = quests.findIndex(quest => quest.created === created);
            if (index !== -1) return true;
            this.SAVED_sort = false;
            return false;
        });

        return this.sort.map(created =>
            quests.find(quest => quest.created === created)
        );
    }

    IsUnsaved = () => {
        if (this.SAVED_sort === false) {
            return true;
        }
        if (this.UNSAVED_additions.length || this.UNSAVED_deletions.length) {
            return true;
        }
        return false;
    }
    GetUnsaved = () => {
        const data = {};

        if (this.UNSAVED_additions.length || this.UNSAVED_deletions.length) {
            let unsaved = [];
            for (let a in this.UNSAVED_additions) {
                const quest = this.UNSAVED_additions[a];
                unsaved.push({ action: 'add', ...quest });
            }
            for (let a in this.UNSAVED_deletions) {
                const quest = this.UNSAVED_deletions[a];
                unsaved.push({ action: 'rem', ...quest });
            }
            data['data'] = unsaved;
        }

        if (this.SAVED_sort === false) {
            data['sort'] = this.sort;
        }
        return data;
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

    IsMax = () => this.Get().length >= this.MAX_QUESTS;

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
        quest.created ??= GetLocalTime();

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
        if (!this.sort.includes(quest.created)) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: quest not found (${quest.title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.sort.length) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: index out of range (${quest.title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.sort.indexOf(quest.created);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: same index (${quest.title} ${newIndex})`);
            return false;
        }
        this.sort.splice(oldIndex, 1);
        this.sort.splice(newIndex, 0, quest.created);
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
     * @returns {Array<DayType>} Days of the week
     */
    GetDays(quest, time = GetLocalTime()) {
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
        let streak = 0;
        const timeNow = GetLocalTime();
        const todayMidnight = timeNow - timeNow % DAY_TIME - GetTimeZone() * 60 * 60;

        const allActivitiesTime = this.user.activities.Get()
            .filter(activity => quest.skills.includes(activity.skillID))
            .filter(activity => this.user.activities.GetExperienceStatus(activity) === 'grant')
            .map(activity => ({
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

        if (streak > quest.maximumStreak) {
            const newQuest = Object.assign({}, quest);
            newQuest.maximumStreak = streak;
            this.AddOrEdit(newQuest);
            this.user.GlobalSave();
        }
        return streak;
    }
}

export { MyQuest };
export default MyQuests;

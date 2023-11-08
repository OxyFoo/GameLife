import DynamicVar from 'Utils/DynamicVar';
import { GetTime } from 'Utils/Time';
import { MonthDayBetween, WeekDayBetween } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {'none'|'week'|'month'} RepeatModes
 * 
 * @typedef {object} Schedule
 * @property {RepeatModes} Type
 * @property {Array<number>} Repeat
 * 
 * @typedef {object} Skill
 * @property {number} id
 * @property {boolean} isCategory
 * 
 * @typedef {object} Subquest
 * @property {boolean} Checked
 * @property {string} Title
 */

class Quest {
    /** @type {number} Time in seconds or 0 if unchecked */
    Checked = 0;

    /** @type {string} Quest title with max 128 characters */
    Title = '';

    /** @type {string} Quest description with max 2048 characters */
    Description = '';

    /** @type {number} Timestamp in seconds */
    Starttime = 0;

    /** @type {number} Timestamp in seconds, 0 if disabled */
    Deadline = 0;

    /** @type {Schedule} Null to don't repeat */
    Schedule = {
        Type: 'none',
        Repeat: []
    };

    /** @type {Skill|null} */
    Skill = null;

    /** @type {Array<Subquest>} Subquests informations */
    Subquests = [];
}

class Quests {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        /**
         * @type {Array<Quest>}
         */
        this.SAVED_quests = [];

        /**
         * @type {Array<Quest>}
         */
        this.UNSAVED_additions = [];

        /**
         * @type {Array<Quest>}
         */
        this.UNSAVED_deletions = [];

        /**
         * Sorted quests using titles
         * @type {Array<string>}
         */
        this.questsSort = [];

        /**
         * @type {boolean} True if quests sort is saved
         */
        this.SAVED_sort = true;

        /**
         * @description All quests (saved and unsaved)
         * @type {DynamicVar<Array<Quest>>}
         */
        this.allQuests = new DynamicVar([]);

        /**
         * @description Not saved, only to undo last deletion
         * @type {Quest|null}
         */
        this.lastDeletedQuest = null;
    }

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
        if (contains('quests'))      this.SAVED_quests = quests['quests'];
        if (contains('additions'))  this.UNSAVED_additions = quests['additions'];
        if (contains('deletions'))  this.UNSAVED_deletions = quests['deletions'];
        if (contains('questsSort'))  this.questsSort = quests['questsSort'];
        if (contains('sortSaved'))  this.SAVED_sort = quests['sortSaved'];
        this.allQuests.Set(this.Get());
    }
    LoadOnline(quests) {
        if (typeof(quests) !== 'object') return;
        this.SAVED_quests = quests.map(quest => Object.assign(new Quest(), quest));
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
     * @returns {Array<Quest>}
     */
    Get() {
        let quests = [ ...this.SAVED_quests, ...this.UNSAVED_additions ];

        // Add new quests title at the top
        quests.forEach(quest =>
            this.questsSort.findIndex(title => quest.Title === title) === -1 &&
            this.questsSort.splice(0, 0, quest.Title)
        );

        // Remove deleted quests title
        const filter = title => quests.findIndex(quest => quest.Title === title) !== -1;
        this.questsSort = this.questsSort.filter(filter);

        return this.questsSort.map(title => quests.find(quest => quest.Title === title));
    }

    IsUnsaved = () => {
        return this.UNSAVED_additions.length || this.UNSAVED_deletions.length;
    }
    GetUnsaved = () => {
        let unsaved = [];
        for (let a in this.UNSAVED_additions) {
            const quest = this.UNSAVED_additions[a];
            unsaved.push({ Action: 'add', ...quest });
        }
        for (let a in this.UNSAVED_deletions) {
            const quest = this.UNSAVED_deletions[a];
            unsaved.push({ Action: 'rem', ...quest });
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
     * Reset quests which are scheduled to be reset (checked & repeat)
     */
    RefreshScheduleQuests() {
        const quests = this.Get();
        for (let i = 0; i < quests.length; i++) {
            let quest = quests[i];
            if (quest.Checked === 0 || quest.Schedule.Type === 'none') continue;

            let reset = false;
            const now = GetTime();
            if (quest.Schedule.Type === 'week') {
                reset ||= WeekDayBetween(quest.Schedule.Repeat, quest.Checked, now);
            } else if (quest.Schedule.Type === 'month') {
                reset ||= MonthDayBetween(quest.Schedule.Repeat, quest.Checked, now);
            }
            if (reset) {
                this.Remove(quest);
                this.Undo();
            }
        }
    }

    /**
     * Add quest
     * @param {string} title Title of the quest
     * @param {string} description Description of the quest
     * @param {number} deadline Unix timestamp in seconds
     * @param {RepeatModes} repeatMode Repeat mode
     * @param {Array<number>} repeatDays Repeat days
     * @param {Skill|null} skill Skill informations
     * @param {Array<Subquest>} subquests Subquests informations
     * @returns {'added'|'alreadyExist'}
     */
    Add(title, description, deadline, repeatMode, repeatDays, skill, subquests) {
        const newQuest = new Quest();
        newQuest.Checked = 0;
        newQuest.Title = title;
        newQuest.Description = description;
        newQuest.Starttime = GetTime();
        newQuest.Deadline = deadline;
        newQuest.Skill = skill;
        newQuest.Schedule = {
            Type: repeatMode,
            Repeat: repeatDays
        };
        newQuest.Subquests = subquests.filter(st => !!st.Title);

        // Check if repeat mode is valid
        if (repeatMode !== 'none' && repeatDays.length <= 0) {
            repeatMode = 'none';
        }

        // Check if not exist
        const indexQuest = this.GetIndex(this.SAVED_quests, newQuest);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, newQuest);
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, newQuest);

        if (indexDeletion !== null) {
            this.UNSAVED_deletions.splice(indexDeletion, 1);
        }

        // Quest already exist
        if (indexQuest !== null || indexUnsaved !== null) {
            return 'alreadyExist';
        }

        // Quest not exist, add it
        this.UNSAVED_additions.push(newQuest);
        this.allQuests.Set(this.Get());
        return 'added';
    }

    /**
     * Edit quest
     * @param {Quest} oldQuest Quest to edit
     * @param {string} title Title of the quest
     * @param {string} description Description of the quest
     * @param {number} deadline Unix timestamp in seconds (0 = no deadline)
     * @param {RepeatModes} repeatMode Repeat mode
     * @param {Array<number>} repeatDays Repeat days
     * @param {Skill|null} skill Skill informations
     * @param {Array<Subquest>} subquests Subquests informations
     * @returns {'edited'|'notExist'}
     */
    Edit(oldQuest, title, description, deadline, repeatMode, repeatDays, skill, subquests) {
        const rem = this.Remove(oldQuest);
        if (rem === 'notExist') return 'notExist';

        // Check if repeat mode is valid
        if (repeatMode !== 'none' && repeatDays.length <= 0) {
            repeatMode = 'none';
        }

        const add = this.Add(title, description, deadline, repeatMode, repeatDays, skill, subquests);
        this.SAVED_sort = false;
        this.allQuests.Set(this.Get());
        return add === 'added' ? 'edited' : 'notExist';
    }

    /**
     * Remove quest
     * @param {Quest} quest
     * @returns {'removed'|'notExist'}
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
            this.lastDeletedQuest = deleted;
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
        if (!this.questsSort.includes(quest.Title)) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: quest not found (${quest.Title} ${newIndex})`);
            return false;
        }
        if (newIndex < 0 || newIndex > this.questsSort.length) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: index out of range (${quest.Title} ${newIndex})`);
            return false;
        }
        const oldIndex = this.questsSort.indexOf(quest.Title);
        if (oldIndex === newIndex) {
            this.user.interface.console.AddLog('warn', `Quests - move failed: same index (${quest.Title} ${newIndex})`);
            return false;
        }
        this.questsSort.splice(oldIndex, 1);
        this.questsSort.splice(newIndex, 0, quest.Title);
        this.SAVED_sort = false;
        this.allQuests.Set(this.Get());
        return true;
    }

    /**
     * Change sort order of quests titles
     * @param {Quest} quest
     * @param {number} checkedTime UTC Time in seconds or 0 if unchecked
     * @returns {boolean} Success of the operation
     */
    Check(quest, checkedTime) {
        let selectedQuest = null;
        const indexQuest = this.GetIndex(this.SAVED_quests, quest);
        const indexUnsaved = this.GetIndex(this.UNSAVED_additions, quest);

        if (indexQuest !== null) selectedQuest = this.SAVED_quests.splice(indexQuest, 1)[0];
        if (indexUnsaved !== null) selectedQuest = this.UNSAVED_additions.splice(indexUnsaved, 1)[0];
        if (selectedQuest === null) {
            this.user.interface.console.AddLog('warn', `Quests - check failed: quest not found (${quest.Title} ${checkedTime})`);
            return false;
        }

        selectedQuest.Checked = checkedTime;
        this.UNSAVED_additions.push(selectedQuest);
        this.allQuests.Set(this.Get());
        return true;
    }

    /**
     * @param {Quest} quest
     * @returns {boolean} Success of the operation
     */
    Uncheck(quest) {
        return this.Check(quest, 0);
    }

    /**
     * Restore last deleted quest
     * @returns {boolean} Success of the operation
     */
    Undo() {
        if (this.lastDeletedQuest === null) return false;

        // Delete quest from UNSAVED_deletions
        const indexDeletion = this.GetIndex(this.UNSAVED_deletions, this.lastDeletedQuest);
        if (indexDeletion !== null) this.UNSAVED_deletions.splice(indexDeletion, 1);

        // Save unchecked quest in UNSAVED_additions
        this.lastDeletedQuest.Checked = 0;
        this.UNSAVED_additions.push(this.lastDeletedQuest);
        this.lastDeletedQuest = null;
        this.allQuests.Set(this.Get());

        // Save new sort
        this.SAVED_sort = false;

        return true;
    }

    /**
     * @param {Array<Quest>} arr
     * @param {Quest} quest
     * @returns {number|null} Index of quest or null if not found
     */
    GetIndex(arr, quest) {
        const index = arr.findIndex(a => a.Title === quest.Title);
        if (index === -1) return null;
        return index;
    }
}

export { Quest };
export default Quests;
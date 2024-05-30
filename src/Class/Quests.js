import MyQuests from './Quests/MyQuests';
import DailyQuest from './Quests/DailyQuest';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Quests {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        this.myquests = new MyQuests(user);
        this.dailyquest = new DailyQuest(user);
    }

    Clear() {
        this.myquests.Clear();
        this.dailyquest.Clear();
    }
    Load(quests) {
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('myquests'))   this.myquests.Load(quests['myquests']);
        if (contains('dailyquest')) this.dailyquest.Load(quests['dailyquest']);
    }
    LoadOnline(quests) {
        if (typeof(quests) !== 'object') return;
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('myquests'))   this.myquests.LoadOnline(quests['myquests']);
        if (contains('dailyquest')) this.dailyquest.LoadOnline(quests['dailyquest']);
    }
    Save() {
        const quests = {
            myquests: this.myquests.Save(),
            dailyquest: this.dailyquest.Save()
        };
        return quests;
    }

    IsUnsaved = () => {
        return this.myquests.IsUnsaved() || this.dailyquest.IsUnsaved();
    }
    GetUnsaved = () => {
        const quests = {};
        if (this.myquests.IsUnsaved()) {
            quests['myquests'] = this.myquests.GetUnsaved();
        }
        if (this.dailyquest.IsUnsaved()) {
            quests['dailyquest'] = this.dailyquest.GetUnsaved();
        }
        return quests;
    }
    Purge = () => {
        this.myquests.Purge();
        this.dailyquest.Purge();
    }
}

export default Quests;

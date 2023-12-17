import MyQuests from './Quests/MyQuests';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Quests {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        this.myquests = new MyQuests(user);
    }

    Clear() {
        this.myquests.Clear();
    }
    Load(quests) {
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('myquests'))   this.myquests.Load(quests['myquests']);
    }
    LoadOnline(quests) {
        if (typeof(quests) !== 'object') return;
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('myquests'))   this.myquests.LoadOnline(quests['myquests']);
    }
    Save() {
        const quests = {
            myquests: this.myquests.Save()
        };
        return { quests };
    }

    IsUnsaved = () => {
        return this.myquests.IsUnsaved();
    }
    GetUnsaved = () => {
        const quests = {};
        if (this.myquests.IsUnsaved()) {
            quests['myquests'] = this.myquests.GetUnsaved();
        }
        return quests;
    }
    Purge = () => {
        this.myquests.Purge();
    }
}

export default Quests;

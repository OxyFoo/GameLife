import MyQuests from './Quests/MyQuests';
import NonZeroDays from './Quests/NonZeroDays';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 */

class Quests {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;

        this.myquests = new MyQuests(user);
        this.nonzerodays = new NonZeroDays(user);
    }

    Clear() {
        this.myquests.Clear();
    }
    Load(quests) {
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('myquests'))   this.myquests.Load(quests['myquests']);
        if (contains('nonzerodays')) this.nonzerodays.Load(quests['nonzerodays']);
    }
    LoadOnline(quests) {
        if (typeof(quests) !== 'object') return;
        const contains = (key) => quests.hasOwnProperty(key);
        if (contains('myquests'))   this.myquests.LoadOnline(quests['myquests']);
        if (contains('nonzerodays')) this.nonzerodays.LoadOnline(quests['nonzerodays']);
    }
    Save() {
        const quests = {
            myquests: this.myquests.Save(),
            nonzerodays: this.nonzerodays.Save()
        };
        return quests;
    }

    IsUnsaved = () => {
        return this.myquests.IsUnsaved() || this.nonzerodays.IsUnsaved();
    }
    GetUnsaved = () => {
        const quests = {};
        if (this.myquests.IsUnsaved()) {
            quests['myquests'] = this.myquests.GetUnsaved();
        }
        if (this.nonzerodays.IsUnsaved()) {
            quests['nonzerodays'] = this.nonzerodays.GetUnsaved();
        }
        return quests;
    }
    Purge = () => {
        this.myquests.Purge();
        this.nonzerodays.Purge();
    }
}

export default Quests;

import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Class/Inventory').Stuff} Stuff
 *
 * @typedef {import('Managers/LangManager').Lang} Lang
 * @typedef {keyof Lang['missions']['content']} MissionKeys
 * 
 * @typedef {Object} MissionsType
 * @property {MissionKeys} name
 * @property {'ox' | 'chest'} rewardType
 * @property {number} rewardValue Ox amount or chest rarity
 * 
 * @typedef {Object} MissionsItem
 * @property {MissionKeys} name
 * @property {'pending' | 'completed' | 'claimed'} state
 */

/** @type {Array<MissionsType>} */
const MISSIONS = [
    { name: 'mission1', rewardType: 'ox', rewardValue: 20 },
    { name: 'mission2', rewardType: 'ox', rewardValue: 30 },
    { name: 'mission3', rewardType: 'ox', rewardValue: 10 },
    { name: 'mission4', rewardType: 'ox', rewardValue: 50 },
    { name: 'mission5', rewardType: 'chest', rewardValue: 1 }
];

class Missions {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    /** @type {DynamicVar<Array<MissionsItem>>} */
    missions = new DynamicVar([]);

    /**
     * Set to true if missions are edited
     * Used to know if we need to save it
     * @type {boolean}
     */
    missionsEdited = false;

    Clear() {
        this.missions.Set([]);
        this.missionsEdited = false;
    }
    LoadOnline(newMissions) {
        if (typeof(newMissions) !== 'object') return;

        const currMissions = this.missions.Get();
        for (const newMission of newMissions) {
            const currMission = currMissions.find(mission => mission.name === newMission.name);
            if (!currMission) {
                currMissions.push(newMission);
            } else {
                currMission.state = newMission.state;
            }
        }

        this.missions.Set(currMissions);
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('missions')) this.missions.Set(data['missions']);
    }
    Save() {
        const data = {
            missions: this.missions.Get()
        };
        return data;
    }

    IsUnsaved = () => {
        return this.missionsEdited;
    }
    GetUnsaved = () => {
        return this.missions.Get();
    }
    Purge = () => {
        this.missionsEdited = false;
    }

    /** @returns {{ mission: MissionsItem | null, index: number }} Mission item or null if no mission is available */
    GetCurrentMission = () => {
        const names = MISSIONS.map(mission => mission.name);
        const missions = this.missions.Get();

        for (let i = 0; i < names.length; i++) {
            const missionName = names[i];

            const missionItem = missions.find(item => item.name === missionName);

            // If mission is found, return it
            if (missionItem) {
                if (missionItem.state === 'claimed' && i < names.length - 1) {
                    continue;
                }
                return {
                    mission: missionItem,
                    index: i
                };
            }

            // If mission is not found, add it to the list
            missions.push({
                name: missionName,
                state: 'pending'
            });

            this.missions.Set(missions);
            this.missionsEdited = true;

            return {
                mission: missions[missions.length - 1],
                index: missions.length - 1
            };
        }

        return {
            mission: null,
            index: -1
        };
    }

    /**
     * @param {MissionKeys} name
     * @param {MissionsItem['state']} state
     */
    SetMissionState = (name, state) => {
        const missions = this.missions.Get();

        const mission = missions.find(mission => mission.name === name);
        if (!mission) {
            this.user.interface.console.AddLog('error', `Mission ${name} not found`);
            return;
        }

        if (mission.state === state) {
            return;
        }

        mission.state = state;
        this.missions.Set(missions);
        this.missionsEdited = true;

        this.user.OnlineSave();
    }

    /**
     * @param {MissionKeys} name
     * @returns {Promise<boolean>} True if mission was claimed
     */
    ClaimMission = async (name) => {
        const rewards = await this.user.server.ClaimMission(name);
        if (rewards === false) {
            return false;
        }

        // Claim rewards
        if (rewards.hasOwnProperty('ox')) {
            const newOx = rewards['ox'];
            this.user.informations.ox.Set(newOx);
            this.user.LocalSave();
        } else if (rewards.hasOwnProperty('item')) {
            /** @type {Stuff} */
            const stuff = rewards['item'];
            this.user.inventory.stuffs.push(stuff);
            this.user.LocalSave();

            const missionIndex = MISSIONS.findIndex(mission => mission.name === name);
            const rarity = MISSIONS[missionIndex].rewardValue;

            // Go to chest reward page
            const args = {
                itemID: stuff['ItemID'],
                chestRarity: rarity,
                callback: this.user.interface.BackHandle
            };
            this.user.interface.ChangePage('chestreward', args, true);
        } else {
            this.user.interface.console.AddLog('error', 'Unknown reward', rewards);
            return false;
        }

        this.SetMissionState(name, 'claimed');
        return true;
    }
}

export { MISSIONS };
export default Missions;

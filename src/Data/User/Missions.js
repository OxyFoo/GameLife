import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/User/Inventory').Stuff} Stuff
 *
 * @typedef {import('Types/Data/User/Missions').MissionKeys} MissionKeys
 * @typedef {import('Types/Data/User/Missions').MissionType} MissionType
 * @typedef {import('Types/Data/User/Missions').MissionItem} MissionItem
 * @typedef {import('Types/Data/User/Missions').SaveObject_Local_Missions} SaveObject_Local_Missions
 * @typedef {import('Types/Data/User/Missions').SaveObject_Online_Missions} SaveObject_Online_Missions
 */

/** @type {Array<MissionType>} */
const MISSIONS = [
    { name: 'mission1', rewardType: 'ox', rewardValue: 20 },
    { name: 'mission2', rewardType: 'ox', rewardValue: 30 },
    { name: 'mission3', rewardType: 'ox', rewardValue: 10 },
    { name: 'mission4', rewardType: 'ox', rewardValue: 50 },
    { name: 'mission5', rewardType: 'chest', rewardValue: 1 }
];

/** @extends {IUserData<SaveObject_Local_Missions>} */
class Missions extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super();

        this.user = user;
    }

    /** @type {DynamicVar<Array<MissionItem>>} */
    // eslint-disable-next-line prettier/prettier
    missions = new DynamicVar(/** @type {Array<MissionItem>} */ ([]));

    /**
     * Set to true if missions are edited
     * Used to know if we need to save it
     * @type {boolean}
     */
    missionsEdited = false;

    Clear = () => {
        this.missions.Set([]);
        this.missionsEdited = false;
    };

    /** @param {SaveObject_Local_Missions} data */
    Load = (data) => {
        if (typeof data.missions !== 'undefined') {
            this.missions.Set(data.missions);
        }
    };

    /** @returns {SaveObject_Local_Missions} */
    Save = () => {
        return {
            missions: this.missions.Get()
        };
    };

    /** @param {SaveObject_Online_Missions} data */
    LoadOnline = (data) => {
        if (typeof data.missions === 'undefined') return;

        const currMissions = this.missions.Get();
        for (const newMission of data.missions) {
            const currMission = currMissions.find((mission) => mission.name === newMission.name);
            if (!currMission) {
                currMissions.push(newMission);
            } else {
                currMission.state = newMission.state;
            }
        }

        this.missions.Set(currMissions);
    };

    IsUnsaved = () => {
        return this.missionsEdited;
    };

    GetUnsaved = () => {
        return {
            missions: this.missions.Get()
        };
    };

    Purge = () => {
        this.missionsEdited = false;
    };

    /** @returns {{ mission: MissionItem | null, index: number }} Mission item or null if no mission is available */
    GetCurrentMission = () => {
        const names = MISSIONS.map((mission) => mission.name);
        const missions = this.missions.Get();

        for (let i = 0; i < names.length; i++) {
            const missionName = names[i];
            const missionItem = missions.find((item) => item.name === missionName);

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
                index: i
            };
        }

        return {
            mission: null,
            index: -1
        };
    };

    /**
     * @param {MissionKeys} name
     * @param {MissionItem['state']} state
     */
    SetMissionState = (name, state) => {
        if (MISSIONS.findIndex((mission) => mission.name === name) === -1) {
            this.user.interface.console?.AddLog('error', `Mission ${name} not found`);
            return;
        }

        const missions = this.missions.Get();

        const mission = missions.find((m) => m.name === name);
        if (!mission) {
            if (state === 'pending' || state === 'completed') {
                missions.push({ name, state });
                this.missions.Set(missions);
                this.missionsEdited = true;
            }
            return;
        }

        // Don't update if state is the same
        if (mission.state === state) {
            return;
        }

        // Don't update if mission is claimed
        if (mission.state === 'claimed') {
            return;
        }

        mission.state = state;
        this.missions.Set(missions);
        this.missionsEdited = true;

        this.user.OnlineSave();
    };

    /**
     * @param {MissionKeys} name
     * @returns {Promise<boolean>} True if mission was claimed
     */
    ClaimMission = async (name) => {
        // const result = await this.user.server2.tcp.SendAndWait({ action: 'claim-achievement', achievementID: name });
        // TODO !!!!
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

            const missionIndex = MISSIONS.findIndex((mission) => mission.name === name);
            const rarity = MISSIONS[missionIndex].rewardValue;

            // Go to chest reward page
            this.user.interface.ChangePage('chestreward', {
                args: {
                    itemID: stuff['ItemID'],
                    chestRarity: rarity,
                    callback: this.user.interface.BackHandle
                },
                storeInHistory: false
            });
        } else {
            this.user.interface.console?.AddLog('error', 'Unknown reward', rewards);
            return false;
        }

        this.SetMissionState(name, 'claimed');
        return true;
    };
}

export { MISSIONS };
export default Missions;

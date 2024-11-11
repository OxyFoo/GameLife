import { IUserData } from 'Types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/User/Inventory').Stuff} Stuff
 *
 * @typedef {import('Types/Data/User/Missions').MissionKeys} MissionKeys
 * @typedef {import('Types/Data/User/Missions').MissionType} MissionType
 * @typedef {import('Types/Data/User/Missions').MissionItem} MissionItem
 * @typedef {import('Types/Data/User/Missions').SaveObject_Missions} SaveObject_Missions
 */

/** @type {MissionType[]} */
const MISSIONS = [
    { name: 'mission1', rewardType: 'ox', amount: 20 },
    { name: 'mission2', rewardType: 'ox', amount: 30 },
    { name: 'mission3', rewardType: 'ox', amount: 10 },
    { name: 'mission4', rewardType: 'ox', amount: 50 },
    { name: 'mission5', rewardType: 'chest', rarity: 'rare' }
];

/** @extends {IUserData<SaveObject_Missions>} */
class Missions extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('missions');

        this.user = user;
    }

    /** @type {DynamicVar<MissionItem[]>} */
    // eslint-disable-next-line prettier/prettier
    missions = new DynamicVar(/** @type {MissionItem[]} */ ([]));

    /**
     * Set to true if missions are edited
     * Used to know if we need to save it
     * @type {boolean}
     */
    missionsEdited = false;

    token = 0;

    Clear = () => {
        this.missions.Set([]);
        this.missionsEdited = false;
    };

    Get = () => {
        return this.missions.Get();
    };

    /** @param {Partial<SaveObject_Missions>} data */
    Load = (data) => {
        if (typeof data.missions !== 'undefined') {
            this.missions.Set(data.missions);
        }
        if (typeof data.token !== 'undefined') {
            this.token = data.token;
        }
    };

    /** @returns {SaveObject_Missions} */
    Save = () => {
        return {
            missions: this.missions.Get(),
            token: this.token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-missions', token: this.token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-missions' ||
            response.result === 'error'
        ) {
            return false;
        }

        if (response.result === 'already-up-to-date') {
            return true;
        }

        const currMissions = this.missions.Get();
        for (const newMission of response.result.missions) {
            const currMission = currMissions.find((mission) => mission.name === newMission.name);
            if (!currMission) {
                currMissions.push(newMission);
            } else {
                currMission.state = newMission.state;
            }
        }

        this.token = response.result.token;
        this.missions.Set(currMissions);
        return true;
    };

    SaveOnline = async () => {
        const missions = this.missions.Get();
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'save-missions',
            missions,
            token: this.token
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'save-missions' ||
            response.result === 'error' ||
            response.result === 'wrong-missions'
        ) {
            return false;
        }

        if (response.result === 'wrong-last-update') {
            // TODO
            // Error ?
            return false;
        }

        this.token = response.result.token;
        return true;
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
        // Check if mission exists
        if (MISSIONS.findIndex((mission) => mission.name === name) === -1) {
            this.user.interface.console?.AddLog('error', `Mission ${name} not found`);
            return;
        }

        const missions = this.missions.Get();

        // Check if mission is already in the list
        const mission = missions.find((m) => m.name === name);
        if (!mission) {
            // Add mission to the list (can't be claimed before being added)
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

        this.SaveOnline();
    };

    /**
     * @param {MissionKeys} name
     * @returns {Promise<boolean>} True if mission was claimed
     */
    ClaimMission = async (name) => {
        // const result = await this.user.server2.tcp.SendAndWait({ action: 'claim-achievement', achievementID: name });
        // TODO: Claim missions
        return false;

        const rewards = await this.user.server.ClaimMission(name);
        if (rewards === false) {
            return false;
        }

        // Claim rewards
        if (rewards.hasOwnProperty('ox')) {
            const newOx = rewards['ox'];
            this.user.informations.ox.Set(newOx);
            this.user.SaveLocal();
        } else if (rewards.hasOwnProperty('item')) {
            /** @type {Stuff} */
            const stuff = rewards['item'];
            this.user.inventory.stuffs.push(stuff);
            this.user.SaveLocal();

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

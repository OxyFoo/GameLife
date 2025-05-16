import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import { ParsePlural } from 'Utils/String';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/User/Inventory').Stuff} Stuff
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Missions').MissionKeys} MissionKeys
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Missions').MissionType} MissionType
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Missions').MissionItem} MissionItem
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Missions').SaveObject_Missions} SaveObject_Missions
 */

/** @extends {IUserData<SaveObject_Missions>} */
class Missions extends IUserData {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('missions');

        this.#user = user;
    }

    /** @type {DynamicVar<MissionItem[]>} */
    missions = new DynamicVar(/** @type {MissionItem[]} */ ([]));

    /**
     * Set to true if missions are edited
     * Used to know if we need to save it
     * @type {boolean}
     */
    #missionsEdited = false;

    #token = 0;

    Clear = () => {
        this.missions.Set([]);
        this.#token = 0;
        this.#missionsEdited = false;
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
            this.#token = data.token;
        }
    };

    /** @returns {SaveObject_Missions} */
    Save = () => {
        return {
            missions: this.missions.Get(),
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-missions', token: this.#token });

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

        this.#token = response.result.token;
        this.missions.Set(currMissions);
        return true;
    };

    /** @returns {Promise<boolean>} */
    SaveOnline = async (attempt = 1) => {
        if (!this.isUnsaved()) {
            return true;
        }

        const missions = this.getUnsaved();
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'save-missions',
            missions,
            token: this.#token
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'save-missions' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog('error', '[Missions] Failed to save missions');
            return false;
        }

        if (response.result === 'wrong-missions') {
            this.#user.interface.console?.AddLog('error', '[Missions] Missions are wrong');
            this.Clear();
            await this.LoadOnline();
            return false;
        }

        if (response.result === 'not-up-to-date') {
            if (attempt <= 0) {
                this.#user.interface.console?.AddLog('error', '[Missions] Failed to save missions, no more attempts');
                return false;
            }

            this.#user.interface.console?.AddLog('error', '[Missions] Missions are not up to date, retrying');
            await this.LoadOnline();
            return this.SaveOnline(attempt - 1);
        }

        this.#token = response.result.token;

        this.purge();

        return true;
    };

    isUnsaved = () => {
        return this.#missionsEdited;
    };

    getUnsaved = () => {
        return this.missions.Get();
    };

    purge = () => {
        this.#missionsEdited = false;
    };

    /** @returns {{ mission: MissionItem | null, index: number }} Mission item or null if no mission is available */
    GetCurrentMission = () => {
        const missions = this.missions.Get();
        const missionsData = dataManager.missions.Get();
        const names = missionsData.map((m) => m.name);

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
            this.#missionsEdited = true;

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
        const missionsData = dataManager.missions.Get();
        const missionNames = missionsData.map((m) => m.name);
        if (!missionNames.includes(name)) {
            this.#user.interface.console?.AddLog('error', `Mission ${name} not found`);
            return;
        }

        // Check if mission is already in the list
        const missions = this.missions.Get();
        const mission = missions.find((m) => m.name === name);
        if (!mission) {
            // Add mission to the list (can't be claimed before being added)
            if (state === 'pending' || state === 'completed') {
                missions.push({ name, state });
                this.missions.Set(missions);
                this.#missionsEdited = true;
            }
            return;
        }

        // Don't update if state is the same
        if (mission.state === state) {
            return;
        }

        // Don't update if mission is claimed
        // Claim state were update below, in ClaimMission func
        if (mission.state === 'claimed') {
            return;
        }

        mission.state = state;
        this.missions.Set(missions);
        this.#missionsEdited = true;

        if (this.#user.server2.IsAuthenticated()) {
            this.SaveOnline();
        }
    };

    /**
     * @param {MissionKeys} name
     * @returns {Promise<'claimed' | 'not-connected' | 'error'>} True if mission was claimed
     */
    ClaimMission = async (name) => {
        if (!this.#user.server2.IsAuthenticated()) {
            return 'not-connected';
        }

        const savedMissions = await this.SaveOnline();
        if (!savedMissions) {
            this.#user.interface.console?.AddLog('error', '[Missions] Failed to save missions before claiming mission');
            return 'error';
        }

        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'claim-mission',
            missionName: name,
            token: this.#token
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'claim-mission' ||
            response.result === 'error'
        ) {
            this.#user.interface.console?.AddLog(
                'error',
                `[Missions] Failed to claim mission (${name}: ${typeof response === 'string' ? response : JSON.stringify(response)})`
            );
            return 'error';
        }

        if (response.result === 'not-up-to-date') {
            await this.LoadOnline();
            return 'error';
        }

        if (response.result === 'already-claimed') {
            this.SetMissionState(name, 'claimed');
            return 'claimed';
        }

        // Claim rewards
        const { rewards, newOx, newToken } = response.result;
        const rewardsExecuted = await this.#user.rewards.ExecuteRewards(rewards, newOx);
        if (!rewardsExecuted) {
            return 'error';
        }

        // Update token
        this.#token = newToken;

        // Show rewards
        const lang = langManager.curr['missions'];
        const title = lang['claim-title'];
        const message = ParsePlural(lang['claim-text'], rewards.length > 1);
        await this.#user.rewards.ShowRewards(rewards, 'all', title, message);

        this.SetMissionState(name, 'claimed');
        await this.#user.SaveLocal();
        return 'claimed';
    };
}

export default Missions;

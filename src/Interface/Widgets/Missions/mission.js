import user from 'Managers/UserManager';

import StartMission1 from './Chapters/mission1';
import StartMission2 from './Chapters/mission2';
import StartMission3 from './Chapters/mission3';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Missions').MissionKeys} MissionKeys
 */

const MISSIONS = {
    mission1: StartMission1,
    mission2: StartMission2,
    mission3: StartMission3
};

/**
 * @param {MissionKeys} missionName
 * @returns {Promise<boolean>}
 */
async function StartMission(missionName) {
    if (!Object.keys(MISSIONS).includes(missionName)) {
        user.interface.console?.AddLog('error', `[Mission] Chapter "${missionName}" not found`);
        return false;
    }

    const mission = MISSIONS[missionName];
    await mission();
    return true;
}

export default StartMission;

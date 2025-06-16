import { IAppData } from '@oxyfoo/gamelife-types/Interface/IAppData';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Missions').MissionType} MissionType
 */

/** @extends {IAppData<MissionType[]>} */
class Missions extends IAppData {
    /** @type {MissionType[]} */
    missions = [];

    Clear = () => {
        this.missions = [];
    };

    /** @param {MissionType[] | undefined} missions */
    Load = (missions) => {
        if (typeof missions !== 'undefined') {
            this.missions = missions;
        }
    };

    Save = () => {
        return this.missions;
    };

    Get = () => {
        return this.missions;
    };
}

export default Missions;

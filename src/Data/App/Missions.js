import { IAppData } from 'Types/Interface/IAppData';

/**
 * @typedef {import('Types/Data/App/Missions').MissionType} MissionType
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

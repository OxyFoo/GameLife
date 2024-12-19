import { IAppData } from 'Types/Interface/IAppData';

/**
 * @typedef {import('Types/Data/App/Ads').Ad} Ad
 */

/** @extends {IAppData<Ad[]>} */
class Ads extends IAppData {
    /** @type {Ad[]} */
    ads = [];

    Clear = () => {
        this.ads = [];
    };

    /** @param {Ad[] | undefined} ads */
    Load = (ads) => {
        if (typeof ads !== 'undefined') {
            this.ads = ads;
        }
    };

    Save = () => {
        return this.ads;
    };

    Get = () => {
        return this.ads;
    };

    /**
     * @param {Ad['Name']} name
     * @returns {Ad | null}
     */
    GetByName = (name) => this.ads.find((a) => a.Name === name) || null;
}

export default Ads;

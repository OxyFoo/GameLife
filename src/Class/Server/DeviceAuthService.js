/**
 * @typedef {import('./TCP').default} TCP
 */

class DeviceAuthService {
    /** @type {TCP} tcp */
    #tcp;

    /** @type {string | null} */
    UUID = null;

    /** @param {string | null} tcp */
    authenticated = false;

    /**
     * @param {TCP} tcp
     */
    constructor(tcp) {
        this.#tcp = tcp;
        this.authenticated = false;
    }
}

export default DeviceAuthService;

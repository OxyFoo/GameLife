/**
 * @typedef {import('./TCP').default} TCP
 */

class UserAuthService {
    /**
     * @param {TCP} tcp
     */
    #tcp;

    /**
     * @param {TCP} tcp
     */
    constructor(tcp) {
        this.#tcp = tcp;
        this.authenticated = false;
    }
}

export default UserAuthService;

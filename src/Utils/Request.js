import Config from 'react-native-config';

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

class ReqResponse {
    /**
     * @param {number} status The status of the request.
     * @param {object} content The data of the request or error information if failed.
     */
    constructor(status, content) {
        this.status = status;
        this.content = content;
    }

    /**
     * @readonly
     * @type {number} The status of the request.
     */
    status = null;

    /**
     * @readonly
     * @type {object} The data of the request or error information if failed.
     */
    content = null;
}

/**
 * @param {object} data
 * @param {string} url - Default : App server
 * @param {'GET' | 'POST'} method  - Default : 'POST'
 * @param {object} headers - Default :
 * {'Accept': 'application/json', 'Content-Type': 'application/json'}
 * @returns {Promise<ReqResponse>}
 */
async function Request_Async(data = {}, url = Config.SERVER_URL, method = 'POST', headers = defaultHeaders) {
    let status = null;
    let content = null;

    const header = {
        method: method,
        headers: headers,
        body: JSON.stringify(data)
    };

    try {
        const request = await fetch(url, header);
        status = request.status;
        if (request.status === 200) {
            content = await request.json();
        } else {
            content = { error: request.statusText };
        }
    } catch (err) {
        status = 1;
        content = { error: err };
    }

    return new ReqResponse(status, content);
}

export { Request_Async };

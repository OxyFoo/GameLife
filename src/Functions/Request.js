import { atLeastOneUndefined } from './Functions';

const URL = __DEV__ ?
    "https://oxyfoo.com/App/GameLife/Dev/app.php" :
    "https://oxyfoo.com/App/GameLife/Public/app.php";

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

class ReqResponse {
    /**
     * @readonly
     * @property {'ok' | 'err'} status - The status of the request.
     */
    status = null;

    /**
     * @readonly
     * @property {Object} data - The data of the request.
     */
    data = null;

    /**
     * @readonly
     * @property {string} error - The error of the request.
     */
    error = null;
}

/**
 * @param {Object} data 
 * @param {String} url - Default : App server
 * @param {'GET' | 'POST'} method  - Default : 'POST'
 * @param {Object} headers - Default :
 * {'Accept': 'application/json', 'Content-Type': 'application/json'}
 * @returns {Promise<ReqResponse>}
 */
async function Request_Async(data, url = URL, method = 'POST', headers = defaultHeaders) {
    let reqResponse = new ReqResponse();

    if (atLeastOneUndefined(data, url, method, headers)) {
        console.error('Please define all variables !');
        reqResponse.status = 'err';
        reqResponse.error = 'Please define all variables !';
        return reqResponse;
    }

    const header = {
        method: method,
        headers: headers,
        body: JSON.stringify(data)
    };

    try {
        const request = await fetch(url, header);
        if (request.status === 200) {
            const response = await request.json();
            reqResponse.status = 'ok';
            reqResponse.data = response;
        } else {
            reqResponse.status = 'err';
            reqResponse.error = request.status + ' - ' + request.statusText;
        }
    } catch (error) {
        reqResponse.status = 'err';
        reqResponse.error = error;
    }

    return reqResponse;
}

export { Request_Async };
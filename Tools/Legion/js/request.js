const APP_URL = "https://oxyfoo.com/App/GameLife/Dev/app.php";

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

class ReqResponse {
    /**
     * @readonly
     * @property {number} status - The status of the request.
     */
    status = null;

    /**
     * @readonly
     * @property {object} data - The data of the request or error information if failed.
     */
    content = null;

    /**
     * @readonly
     * @property {number} time - The time of the request.
     */
    time = 0;
}

/**
 * @param {object} data
 * @param {string} url - Default : App server
 * @param {'GET' | 'POST'} method  - Default : 'POST'
 * @param {object} headers - Default :
 * {'Accept': 'application/json', 'Content-Type': 'application/json'}
 * @returns {Promise<ReqResponse>}
 */
async function Request_Async(data = {}, url = APP_URL, method = 'POST', headers = defaultHeaders) {
    let reqResponse = new ReqResponse();

    const header = {
        method: method,
        headers: headers,
        body: JSON.stringify(data),
        mode: 'cors',
        origin: '*'
    };

    try {
        const t1 = performance.now();
        const request = await fetch(url, header);
        const t2 = performance.now();
        reqResponse.status = request.status;
        reqResponse.time = t2 - t1;
        if (request.status === 200) {
            const response = await request.json();
            reqResponse.content = response;
        } else {
            reqResponse.content = { error: request.statusText };
            AddError(request.statusText);
        }
    } catch (err) {
        reqResponse.status = 1;
        reqResponse.content = { error: err };
        AddError(err);
    }

    return reqResponse;
}
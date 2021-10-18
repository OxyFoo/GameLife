import user from '../Managers/UserManager';

const URL = require('../../package.json').serverURL;

async function Request_Async(data, url = URL, method, headers) {
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    const header = {
        method: method || 'POST',
        headers: headers || defaultHeaders,
        body: JSON.stringify(data)
    };

    let json = { "status": "fail" };
    try {
        const response = await fetch(url, header);
        if (response.status === 200) {
            json = await response.json();
        } else {
            user.openPopup('ok', [ 'Debug - Warn 1', response.status ], undefined, false);
            console.warn("Error: Request failed " + response.status + ' (1)');
            //console.log(data);
            console.log(response);
        }
    } catch (error) {
        user.openPopup('ok', [ 'Debug - Error 1', error ], undefined, false);
        json["status"] = "offline";
    }

    return json;
}

export { Request_Async };
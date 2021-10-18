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
            json['details'] = response;
        }
    } catch (error) {
        json['details'] = error;
        json["status"] = "offline";
    }

    return json;
}

export { Request_Async };
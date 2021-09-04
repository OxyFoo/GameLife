const URL = 'https://oxyfoo.com/App/GameLife/app.php';

async function Request_Async(data, method, headers) {
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
        const response = await fetch(URL, header);
        if (response.status === 200) {
            json = await response.json();
            if (json['status'] !== 'ok') {
                //console.log(data);
                //console.log(json);
                //console.log("_____");
                console.warn("Error: Request status " + response.status + ' (1)');
            }
        } else {
            console.warn("Error: Request failed " + response.status + ' (2)');
            //console.log(data);
            console.log(response);
        }
    } catch (error) {
        // Pas de co
        //console.warn(error);
        //console.warn("Problème étrange, merci de MP Terra pour lui en avertir, merci ^^");
    }

    return json;
}

export { Request_Async };
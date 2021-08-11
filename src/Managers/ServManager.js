const URL = 'https://oxyfoo.com/App/GameLife/login.php';

class ServManager {
    constructor() {
        this.connected = false;
    }

    getToken = (deviceInformations) => {
        deviceInformations['action'] = 'gettoken';
        this.Request(URL, deviceInformations, (result) => {
            console.log(result);
        });
    }

    Connect = () => {
    }

    Request = (url, data, callback, errorCallback, method, headers) => {
        defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        const header = {
            method: method || 'POST',
            headers: headers || defaultHeaders,
            body: JSON.stringify(data)
        }
        fetch(url, header).then((response) => {
            if (response.status != 200) {
                console.error(response.status);
                return null;
            }
            return response.json();
        }).then((json) => {
            if (json && typeof(callback) === 'function') {
                callback(json);
            }
        }).catch((error) => {
            console.error(error);
            if (typeof(errorCallback) === 'function') {
                errorCallback(error);
            }
        });
    }
}

export default ServManager;
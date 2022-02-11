class User {
    constructor(init = true) {
        const ID = RandomChar(8)
        this.deviceID = RandomNumber(16);
        this.deviceName = 'Bot-' + ID;
        this.username = 'Bot-' + ID;
        this.email = 'bot-' + ID + '@oxyfoo.com';

        /** @type {HTMLDivElement} */
        this.component = null;
        this.activities = 0;
        this.timesOfRequests = [];

        this.pinged = false;
        this.signin = false;
        this.login = false;
        this.token = '';

        if (init) {
            this.Init();
        }
    }

    Init() {
        // Add user element in html component "users"
        let component = document.createElement('div');
        component.className = 'user ' + this.deviceID;
        component.innerHTML = USER_EMPTY;
        elUsers.append(component);
        this.component = component;
        this.Update();
    }

    Update() {
        let reqMax = 0;
        let reqMin = 0;
        let reqAerage = 0;
        if (this.timesOfRequests.length) {
            const reqSum = this.timesOfRequests.reduce((a, b) => a + b, 0);
            reqMax = Math.max(...this.timesOfRequests);
            reqMin = Math.min(...this.timesOfRequests);
            reqAerage = Math.floor(reqSum / this.timesOfRequests.length);
        }
        this.component.getElementsByClassName('device-id')[0].innerText = this.deviceID;
        this.component.getElementsByClassName('device-name')[0].innerText = this.deviceName;
        this.component.getElementsByClassName('nb-requests')[0].innerText = this.timesOfRequests.length;
        this.component.getElementsByClassName('nb-activities')[0].innerText = this.activities;
        this.component.getElementsByClassName('nb-max')[0].innerText = reqMax + 'ms';
        this.component.getElementsByClassName('nb-min')[0].innerText = reqMin + 'ms';
        this.component.getElementsByClassName('nb-average')[0].innerText = reqAerage + 'ms';
        UpdateInterface();
    }

    async Ping() {
        if (!alive) { AddError('Script interrupted'); return; }
        const data = {
            action: 'ping',
            version: '1.0.0',
            deviceID: this.deviceID,
            deviceName: this.deviceName,
            deviceOSName: 'Python',
            deviceOSVersion: '0'
        };
        const result = await Request_Async(data);
        if (result.status === 200) {
            this.timesOfRequests.push(result.time);
            if (result.content.status === 'ok') {
                this.pinged = true;
            } else {
                AddError('User ' + this.deviceID + ' is not pinged');
            }
        }
        this.Update();
    }

    async Signin() {
        if (!alive) { AddError('Script interrupted'); return; }
        if (!this.pinged) {
            AddError('User ' + this.deviceID + ' is not pinged');
            this.Update();
            return;
        }
        const data = {
            action: 'signin',
            deviceID: this.deviceID,
            deviceName: this.deviceName,
            email: this.email,
            username: this.username
        };
        const result = await Request_Async(data);
        if (result.status === 200) {
            this.timesOfRequests.push(result.time);
            if (result.content.status === 'ok') {
                this.signin = true;
            } else {
                AddError('User ' + this.deviceID + ' is not logged in');
            }
        }
        this.Update();
    }
    async Login() {
        if (!alive) { AddError('Script interrupted'); return; }
        if (!this.signin) {
            AddError('User ' + this.deviceID + ' is not logged in');
            this.Update();
            return;
        }
        const data = {
            action: 'login',
            deviceID: this.deviceID,
            deviceName: this.deviceName,
            email: this.email,
            lang: 'fr'
        };
        const result = await Request_Async(data);
        if (result.status === 200) {
            this.timesOfRequests.push(result.time);
            this.login = true;
            if (result.content.status === 'ok') {
                this.token = result.content.token;
            }
        }
        this.Update();
    }
    async GetInternalData(printResult = false) {
        if (!alive) { AddError('Script interrupted'); return; }
        const data = {
            action: 'getInternalData'
        };
        const result = await Request_Async(data);
        if (result.status === 200) {
            this.timesOfRequests.push(result.time);
            if (result.content.status === 'ok') {
                if (printResult) {
                    console.log(result.content);
                }
            }
        }
        this.Update();
    }
    async AddActivity() {
        if (!alive) { AddError('Script interrupted'); return; }
        const skillID = RandomNumber(3);
        const startTime = new Date().getTime();
        const duration = 60;
        const comment = RandomChar(Math.floor(Math.random() * 256));
        const data = {
            action: 'addUserData',
            token: this.token,
            data: {
                activities: [
                    ['add', skillID, startTime, duration, comment]
                ]
            }
        };
        const result = await Request_Async(data);
        if (result.status === 200) {
            this.timesOfRequests.push(result.time);
            if (result.content.status === 'ok') {
                this.activities++;
            }
        }
        this.Update();
    }
    async AddMultipleActivities(number) {
        for (let i = 0; i < number; i++) {
            if (!alive) { AddError('Script interrupted'); return; }
            await this.AddActivity();
            this.Update();
        }
    }

    async TestAll(activitiesNumber) {
        await this.Ping();
        await this.Signin();
        await this.Login();
        await this.GetInternalData();
        if (this.pinged && this.signin && this.login) {
            await this.AddMultipleActivities(activitiesNumber);
        }

        USERS_ENDS++;
        if (USERS_ENDS === users.length) {
            TestAllEnd();
        }
    }

    async DeleteAccount() {
        const Delete = () => {
            this.component.remove();
            this.Update();
        }
        if (this.signin) {
            const data = {
                action: 'deleteAccount',
                email: this.email,
                token: this.token,
                lang: 'fr'
            };
            const result = await Request_Async(data);
            if (result.status === 200) {
                this.timesOfRequests.push(result.time);
                if (result.content.status === 'ok') {
                    Delete();
                }
            }
        } else {
            Delete();
        }
    }
}
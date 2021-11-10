import { BackHandler } from 'react-native';

import langManager from '../Managers/LangManager';
import { isUndefined } from '../Functions/Functions';
import { Request_Async } from '../Functions/Request';
import DataStorage, { STORAGE } from '../Functions/DataStorage';

class DateCheck {
    constructor(user) {
        this.user = user;
    }

    async changeState(state) {
        if (state === 'active') {
            // Check date errors
            const isSafe = await this.currentDateIsSafe();
            if (!isSafe) {
                const title = langManager.curr['home']['alert-dateerror-title'];
                const text = langManager.curr['home']['alert-dateerror-text'];
                this.user.openPopup('ok', [ title, text ], BackHandler.exitApp, false);
                return;
            }
        }
    }

    async currentDateIsSafe() {
        let safe = true;
    
        // In that order, user can block app, but... its ok ^^
    
        // Check local date
        const today = new Date();
        const data = await DataStorage.Load(STORAGE.DATE);
        if (!isUndefined(data) && data.hasOwnProperty('date')) {
            const savedDate = new Date(data['date']);
            if (savedDate > today) {
                safe = false;
            } else {
                DataStorage.Save(STORAGE.DATE, { date: today }, false);
            }
        } else {
            DataStorage.Save(STORAGE.DATE, { date: today }, false);
        }
    
        // Check online date
        if (safe) {
            const onlineData = { 'action': 'getDate' }
            const response = await Request_Async(onlineData);
            if (response.status === 'ok') {
                const onlineTime = response.data['time'];
                const delta = Math.abs(today.getTime()/1000 - onlineTime) / (60 * 60);
                if (delta > 12) {
                    safe = false;
                }
            }
        }
    
        return safe;
    }
}

export default DateCheck;
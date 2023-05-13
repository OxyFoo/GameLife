import { isUndefined } from './Functions';
import { Request_Async } from './Request';
import DataStorage, { STORAGE } from '../Class/DataStorage';

async function currentDateIsSafe() {
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
        if (!isUndefined(response) && response.status == 'ok') {
            const onlineTime = response['time'];
            const delta = Math.abs(today.getTime()/1000 - onlineTime) / (60 * 60);
            if (delta > 12) {
                safe = false;
            }
        }
    }

    return safe;
}

export { currentDateIsSafe };
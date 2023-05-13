import { Request_Async } from './Request';
import DataStorage, { STORAGE } from './DataStorage';

async function CheckDate() {
    let safe = true;

    // In that order, user can block app, but... its ok ^^

    // Check local date
    const today = new Date();
    const data = await DataStorage.Load(STORAGE.DATE);

    if (data !== null && data.hasOwnProperty('date')) {
        const savedDate = new Date(data['date']);
        if (savedDate > today) {
            safe = false;
        }
    }

    if (safe) {
        DataStorage.Save(STORAGE.DATE, { date: today }, false);
    }

    // Check online date
    if (safe) {
        const onlineData = { 'action': 'getDate' }
        const result = await Request_Async(onlineData);
        if (result.status === 200) {
            const onlineTime = result.content['time'];
            const delta = Math.abs(today.getTime()/1000 - onlineTime) / (60 * 60);
            if (delta > 12) {
                safe = false;
            }
        }
    }

    return safe;
}

export { CheckDate };
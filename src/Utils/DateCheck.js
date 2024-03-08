import RNExitApp from 'react-native-exit-app';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetGlobalTime } from './Time';
import DataStorage, { STORAGE } from './DataStorage';

async function CheckDate() {
    if (!user.server.IsConnected()) {
        return;
    }

    const dateIsSafe = await DateIsSafe();
    if (!dateIsSafe) {
        const title = langManager.curr['home']['alert-dateerror-title'];
        const text = langManager.curr['home']['alert-dateerror-text'];
        user.interface.popup.ForceOpen('ok', [ title, text ], RNExitApp.exitApp, false);
    }
}

async function DateIsSafe() {
    // Check local date
    const now = GetGlobalTime();
    const data = await DataStorage.Load(STORAGE.DATE);
    DataStorage.Save(STORAGE.DATE, { date: now });

    if (data !== null && data.hasOwnProperty('date')) {
        const savedDate = data['date'];
        if (savedDate > now) {
            return false;
        }
    }

    // Check online date
    const onlineData = { date: now };
    const result = await user.server.Request('getDate', onlineData);
    if (result.status === 'ok' && result.hasOwnProperty('time')) {
        const onlineTime = result['time'];
        const delta = Math.abs(now - onlineTime) / (60 * 60);
        if (delta > 24) {
            return false;
        }
    }

    return true;
}

export { CheckDate };

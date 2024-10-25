import { GetGlobalTime } from './Time';
import DataStorage, { STORAGE } from './DataStorage';

/**
 * @typedef {import('Class/TCP').default} TCP
 */

/**
 * Check if the date is correct and safe
 * @param {TCP} tcp
 * @returns {Promise<boolean | null>} True if the date is correct and safe, false if not, null if the date couldn't be checked
 */
async function CheckDate(tcp) {
    const onlineDateIsSafe = await DateIsSafeOnline(tcp);
    if (onlineDateIsSafe === null || onlineDateIsSafe === false) {
        return onlineDateIsSafe;
    }

    const localDateIsSafe = await DateIsSafeLocal();
    if (localDateIsSafe === null || localDateIsSafe === false) {
        return localDateIsSafe;
    }

    return true;
}

/**
 * Check locally if the date is correct and safe (no time travel in the past)
 * @returns {Promise<boolean>} True if the date is correct and safe, false if not
 */
async function DateIsSafeLocal() {
    const now = GetGlobalTime();
    /** @type {{ date?: number } | null} */
    const data = await DataStorage.Load(STORAGE.DATE);
    DataStorage.Save(STORAGE.DATE, { date: now });

    if (data !== null && typeof data.date === 'number') {
        if (data.date > now) {
            return false;
        }
    }

    return true;
}

/**
 * Check online if the date is correct and safe (no time travel in the future)
 * @param {TCP} tcp
 * @returns {Promise<boolean | null>} True if the date is correct and safe, false if not, null if the date couldn't be checked
 */
async function DateIsSafeOnline(tcp) {
    if (!tcp.IsConnected()) {
        return null;
    }

    const now = GetGlobalTime();
    const response = await tcp.SendAndWait({ action: 'check-date', timestamp: now });

    if (
        response === 'not-sent' ||
        response === 'timeout' ||
        response === 'interrupted' ||
        response.status !== 'check-date'
    ) {
        return null;
    }

    return response.dateIsValid;
}

export { CheckDate };

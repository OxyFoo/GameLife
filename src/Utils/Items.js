import { GetDeviceInformations } from './Device';
import { GetMidnightTime, GetLocalTime } from './Time';

/**
 * Return a random integer depending on the day and device
 * @param {number} min Minimum value
 * @param {number} max Maximum value
 * @returns {number} Random integer
 */
function GetRandomIntByDay(min, max) {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth();
    const shortYear = today.getFullYear() % 100;

    const device = GetDeviceInformations().deviceID;
    const deviceSeed = device
        .split('')
        .map((c) => c.charCodeAt(0))
        .reduce((a, b) => a + b, 0);
    const random = Math.pow(date + month, shortYear) * deviceSeed;

    const seed = random.toLocaleString('fullwide', { useGrouping: false }).slice(2, 16);
    const index = (Number.parseInt(seed.charAt(0), 10) * (max - min)) / 9;

    return Math.floor(index) + min;
}

/**
 * Return indexes of available items depending on the day and device
 * @param {object} items Available items, keys are indexes and values is probability (0-1) (all to 1 = same probability)
 * @param {number} length Number of item indexes to return
 * @returns {Array<string | number>} Array of indexes of available items (keys of items)
 */
function GetRandomIndexesByDay(items, length) {
    const midnight = GetMidnightTime(GetLocalTime());

    const device = GetDeviceInformations().deviceID;
    const deviceSeed =
        device
            .split('')
            .map((c) => c.charCodeAt(0))
            .reduce((a, b) => a + b, 0) % 10;

    const random = Math.pow(midnight, deviceSeed) % 1000000;
    const randomStrings = String(random).match(/\d+/g);
    let seed = randomStrings ? randomStrings.join('') : '1';
    while (seed.length < length) {
        seed += seed;
    }

    let remainItems = { ...items };
    let output = [];
    for (let i = 0; i < length; i++) {
        const total = Object.values(remainItems).reduce((a, b) => a + b, 0);
        const index = (Number.parseInt(seed.charAt(i), 10) * total) / 9;

        let sum = 0;
        for (const key in remainItems) {
            sum += remainItems[key];
            if (sum >= index) {
                output.push(key);
                delete remainItems[key];
                break;
            }
        }

        if (remainItems.length === 0) {
            break;
        }
    }

    return output;
}

export { GetRandomIntByDay, GetRandomIndexesByDay };

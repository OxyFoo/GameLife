import { GetDeviceInformations } from './Device';

/**
 * Return indexes of available items [en fonction] du jour
 * @param {object} items Available items, keys are indexes and values is probability (0-1) (all to 1 = same probability)
 * @param {number} length Number of item indexes to return
 * @returns {Array<string|number>} Array of indexes of available items (keys of items)
 */
function GetRandomIndexesByDay(items, length) {
    const today = new Date();
    const date = today.getUTCDate();
    const month = today.getUTCMonth();
    const shortYear = today.getUTCFullYear() % 100;

    const device = GetDeviceInformations().deviceID;
    const deviceSeed = device.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0);
    const random = Math.pow(date + month, shortYear) * deviceSeed;

    let seed = random.toLocaleString('fullwide', { useGrouping: false }).slice(2, 16);
    while (seed.length < length) seed += seed;

    let remainItems = { ...items };
    let output = [];
    for (let i = 0; i < length; i++) {
        const total = Object.values(remainItems).reduce((a, b) => a + b, 0);
        const index = Number.parseInt(seed.charAt(i)) * total / 9;

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

export { GetRandomIndexesByDay };
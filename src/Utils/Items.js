/**
 * Return indexes of available items [en fonction] du jour
 * @param {String} username Used to randomize the indexes
 * @param {Object} items Available items, keys are indexes and values is probability (0-1) (all to 1 = same probability)
 * @param {Number} length Number of item indexes to return
 * @returns {Array<String|Number>}
 */
function GetRandomIndexesByDay(username, items, length) {
    const today = new Date();
    const date = today.getUTCDate();
    const month = today.getUTCMonth();
    const shortYear = today.getUTCFullYear() % 100;

    const pseudo = username.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0);
    const random = Math.pow(date + month, shortYear) * pseudo;

    let remainItems = { ...items };
    let output = [];
    for (let i = 0; i < length; i++) {
        const total = Object.values(remainItems).reduce((a, b) => a + b, 0);
        const index = (random * Math.pow(10, i)) % total;

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
/**
 * @template T
 * @param {T} obj
 * @returns {T}
 */
function DeepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        // @ts-ignore
        return obj.map(DeepCopy);
    }

    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // @ts-ignore
            newObj[key] = DeepCopy(obj[key]);
        }
    }

    // @ts-ignore
    return newObj;
}

export { DeepCopy };

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

/**
 * Deeply merges two objects in a new object.
 * @template {object} T
 * @template {object} U
 * @param {T} target
 * @param {U} source
 * @returns {T & U}
 */
function DeepMerge(target, source) {
    let output = DeepCopy(target);
    Object.keys(source).forEach((key) => {
        // @ts-ignore
        if (source[key] instanceof Object && key in target) {
            // @ts-ignore
            output[key] = DeepMerge(target[key], source[key]);
        } else {
            // @ts-ignore
            output[key] = source[key];
        }
    });

    // @ts-ignore
    return output;
}

export { DeepCopy, DeepMerge };

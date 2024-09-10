/**
 * @param {number} n
 * @returns {string} Return number with two digits
 */
function TwoDigit(n) {
    return ('00' + n).slice(-2);
}

/**
 * @param {number} number
 * @param {number} [decimal=0]
 * @returns {number} Return number rounded to decimal
 */
function Round(number, decimal = 0) {
    const dec = decimal.toString();
    const n = parseFloat(number + ('e+' + dec));
    return +(Math.floor(n) + ('e-' + dec));
}

/**
 * @param {Array<number>} arr
 * @returns {number} Return sum of array
 * @example Sum([1, 2, 3]) => 6
 */
function Sum(arr) {
    return arr.reduce((partial_sum, a) => partial_sum + a, 0);
}

/**
 * @param {*} el
 * @returns {boolean} Return true if element is undefined
 */
function IsUndefined(el) {
    return typeof el === 'undefined';
}

/**
 * @param {number} min
 * @param {number} value
 * @param {number} max
 * @returns {number} Return value between min and max
 */
function MinMax(min, value, max) {
    let output = value;
    if (typeof value === 'number') {
        if (output < min) output = min;
        else if (output > max) output = max;
    }
    return output;
}

/**
 * Sort array of object by key
 * @template T
 * @param {T[]} array
 * @param {keyof T} key
 * @returns {T[]} Return sorted array
 */
function SortByKey(array, key) {
    /** @param {T[keyof T]} value */
    const format = (value) => (typeof value === 'string' ? value.toLowerCase() : value);
    /** @param {T} a @param {T} b */
    const compare = (a, b) => (format(a[key]) < format(b[key]) ? -1 : 1);
    return array.sort(compare);
}

/**
 * Return element in array of object by key and value
 * @template T
 * @param {T[]} array
 * @param {keyof T} key
 * @param {T[keyof T]} value
 * @returns {T | null} Return object or null if didn't exists
 */
function GetByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

/**
 * Convert array of object to object
 * @template T
 * @param {T[]} arr
 * @returns {Record<string, T>}
 */
const ArrayToDict = (arr) => arr.reduce((acc, curr) => Object.assign(acc, curr), {});

/**
 * Range function
 * @example Range(5) => [0, 1, 2, 3, 4]
 * @param {number} length
 * @param {number} [step=1] Step between each number
 * @returns {Array<number>}
 */
function Range(length, step = 1) {
    return Array.from({ length: length / step }, (_, i) => i * step);
}

/** @param {number} ms */
function Sleep(ms) {
    const T = Math.max(0, ms);
    return new Promise((resolve) => setTimeout(resolve, T));
}

/**
 * Generate random number between [min, max[
 * @param {number} min
 * @param {number} max
 * @param {number} decimal Number of decimals to keep
 * @returns
 */
function Random(min = 0, max = 1, decimal = 0) {
    const r = Math.random() * (max - min) + min;
    return Round(r, decimal);
}

function RandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export {
    TwoDigit,
    Round,
    Sum,
    Range,
    SortByKey,
    GetByKey,
    ArrayToDict,
    IsUndefined,
    MinMax,
    Sleep,
    Random,
    RandomString
};

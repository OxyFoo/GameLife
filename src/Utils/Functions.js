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
    return + (Math.floor(n) + ('e-' + dec));
}

function Sum(arr) {
    return arr.reduce((partial_sum, a) => partial_sum + parseInt(a), 0);
}

function IsUndefined(el) {
    return typeof(el) === 'undefined';
}

function MinMax(min, value, max) {
    let output = null;
    if (typeof(value) === 'number') {
        output = value;
        if (output < min) output = min;
        else if (output > max) output = max;
    }
    return output;
}

/**
 * @param {Array} array
 * @param {string} key Key of array
 * @returns {Array} Return sorted array
 */
function SortByKey(array, key) {
    const format = (value) => typeof(value) === 'string' ? value.toLowerCase() : value;
    const compare = (a, b) => format(a[key]) < format(b[key]) ? -1 : 1;
    return array.sort(compare);
}

/**
 * Return element in array of object by key and value
 * @param {Array} array
 * @param {string} key
 * @param {*} value
 * @returns {object|null} Return object or null if didn't exists
 */
function GetByKey(array, key, value) {
    const result = array.find((element) => element[key] == value);
    return !IsUndefined(result) ? result : null;
}

/**
 * Convert array of object to object
 * @param {Array} arr
 * @returns {object} 
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

function Sleep(ms) {
    const T = Math.max(0, ms);
    return new Promise(resolve => setTimeout(resolve, T));
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

export { TwoDigit, Round, Sum, Range, SortByKey, GetByKey, ArrayToDict,
    IsUndefined, MinMax, Sleep, Random };
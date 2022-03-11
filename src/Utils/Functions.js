function TwoDigit(n) {
    return ('00' + n).slice(-2);
}

/**
 * @param {Number} number 
 * @param {Number} [decimal=0] 
 * @returns {Number} - Return number rounded to decimal
 */
function Round(number, decimal = 0) {
    const dec = decimal.toString();
    return  +(Math.round(number + ('e+' + dec)) + ('e-' + dec));
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
 * @param {String} str - String to check if it's a valid json
 * @returns {Boolean} - Return true if string is a valid json
 */
function StrIsJSON(str) {
    let isJSON = true;
    try { JSON.parse(str); }
    catch (e) { isJSON = false; }
    return isJSON;
}

/**
 * @param {Array} array
 * @param {String} key - Key of array
 * @returns {Array} - Return sorted array
 */
function SortByKey(array, key) {
    const format = (value) => typeof(value) === 'string' ? value.toLowerCase() : value;
    const compare = (a, b) => format(a[key]) < format(b[key]) ? -1 : 1;
    return array.sort(compare);
}

/**
 * Return element in array of object by key and value
 * @param {Array} array
 * @param {String} key
 * @param {*} value
 * @returns {Object?} Return object or null if didn't exists
 */
function GetByKey(array, key, value) {
    const result = array.find((element) => element[key] == value);
    return !IsUndefined(result) ? result : null;
}

/**
 * @param {String} email
 * @returns {Boolean} - True if str "email" is a valid email
 */
function IsEmail(email) {
    let isEmail = false;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (typeof(email) === 'string' && email.length && reg.test(email)) {
        isEmail = true;
    }
    return isEmail;
}

/**
 * Range function
 * @example Range(5) => [0, 1, 2, 3, 4]
 * @param {Number} length 
 * @returns {Array}
 */
function Range(length) {
    return Array.from({ length: length }, (_, i) => i);
}

function Sleep(ms) {
    const T = Math.max(0, ms);
    return new Promise(resolve => setTimeout(resolve, T));
}

function Random(min, max) {
    const m = min || 0;
    const M = max || 1;
    let R = Math.random() * (M - m) + m;
    return parseInt(R);
}

export { TwoDigit, Round, Sum, Range, StrIsJSON,
    SortByKey, GetByKey, IsEmail,
    IsUndefined, MinMax, Sleep, Random };
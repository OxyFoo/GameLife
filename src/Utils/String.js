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

export { IsEmail, StrIsJSON };
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

/**
 * @description Returns the same text, interpreting if necessary the
 * texts between brackets to make the sentence plural, the values between
 * "[" and "]" are added if the sentence is plural, removing the characters
 * preceding them by the same number as the number of "-"
 * @example Text : "The following sentence[s] is[--are] singular[--------plural]"
 * @param {String} text
 * @param {Boolean} plural
 * @returns {String}
 */
 function ParsePlural(text, plural = false) {
    while (text.indexOf('[') !== -1) {
        let [ start, end ] = [ text.indexOf('['), text.indexOf(']') ];
        let pluralText = '';
        if (plural) {
            pluralText = text.substring(start + 1, end);
            const remLength = pluralText.lastIndexOf('-') + 1;
            start -= remLength;
            pluralText = pluralText.substring(remLength);
        }
        text = text.slice(0, start) + pluralText + text.slice(end + 1);
    }
    return text;
}

export { IsEmail, StrIsJSON, ParsePlural };
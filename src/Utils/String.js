/**
 * @param {string} str String to check if it's a valid json
 * @returns {boolean} Return true if string is a valid json
 */
 function StrIsJSON(str) {
    let isJSON = true;
    try { JSON.parse(str); }
    catch (e) { isJSON = false; }
    return isJSON;
}

/**
 * @param {string} email
 * @returns {boolean} True if str "email" is a valid email
 */
 function IsEmail(email) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return typeof(email) === 'string' && email.length && reg.test(email);
}

/**
 * @description Returns the same text, interpreting if necessary the
 * texts between brackets to make the sentence plural, the values between
 * "[" and "]" are added if the sentence is plural, removing the characters
 * preceding them by the same number as the number of "-"
 * @example Text : "The following sentence[s] is[--are] singular[--------plural]"
 * @example ParsePlural(Text, false) => "The following sentence is singular"
 * @example ParsePlural(Text, true) => "The following sentence are plural"
 * @param {string} text
 * @param {boolean} plural
 * @returns {string}
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


/**
 * Will return a string containing all the uppercase letters of the string
 * @param {string} str 
 * @returns 
 */
function getUppercaseLetters(str) {
    const matches = str.match(/[A-Z]/g);
    return matches ? matches.join('') : '';
}

export { IsEmail, StrIsJSON, ParsePlural, getUppercaseLetters };

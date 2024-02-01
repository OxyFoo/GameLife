/**
 * Check if a string is a valid json
 * @param {string} str 
 * @returns {boolean}
 */
function StrIsJson(str) {
    try { JSON.parse(str); }
    catch (e) { return false; }
    return true;
}

export { StrIsJson };

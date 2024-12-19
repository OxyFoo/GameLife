/**
 * Check if a value is not null or undefined
 * @template T
 * @param {T} value The value to check
 * @returns {value is NonNullable<T>}
 */
function IsNotNull(value) {
    return value !== null && value !== undefined;
}

export { IsNotNull };

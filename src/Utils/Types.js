/**
 * Check if a value is not null or undefined
 * @template T
 * @param {T} value The value to check
 * @returns {value is NonNullable<T>}
 */
function IsNotNull(value) {
    return value !== null && value !== undefined;
}

/** @param {Error | unknown} error */
function SerializeError(error) {
    if (!(error instanceof Error)) {
        return error;
    }

    return {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        cause: error?.cause
    };
}

export { IsNotNull, SerializeError };

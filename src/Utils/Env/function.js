import Config from 'react-native-config';

/**
 * Error thrown when an env var is missing or malformed.
 * @extends {Error}
 */
export class EnvironmentError extends Error {
    /** @param {string} msg */
    constructor(msg) {
        super(msg);
        this.name = 'EnvironmentError';
    }
}

// ────────────────────────────────────────────────────────────────────────────
// Internal parsers
// ────────────────────────────────────────────────────────────────────────────

/** @param {string} v */
const parseBoolean = (v) => {
    const l = v.toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(l)) return true;
    if (['false', '0', 'no', 'off'].includes(l)) return false;
    throw new EnvironmentError(`Invalid boolean value: "${v}"`);
};

/** @param {string} v */
const parseNumber = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) throw new EnvironmentError(`Value "${v}" is not a valid number`);
    return n;
};

/**
 * @template {string} T
 * @param {string} v
 * @param {readonly T[]} allowed
 * @returns {T}
 */
function ensureEnum(v, allowed) {
    if (!allowed.includes(/** @type {T} */ (v))) {
        throw new EnvironmentError(`Value "${v}" must be one of: ${allowed.join(', ')}`);
    }
    return /** @type {T} */ (v);
}

// ────────────────────────────────────────────────────────────────────────────
// Internal Helper to fetch raw values
// ────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} name
 * @param {boolean} [required=true]
 * @returns {string|undefined}
 */
function getRaw(name, required = true) {
    const raw = /** @type {string|undefined} */ (Config[name]);
    if (raw == null || raw === '') {
        if (required) throw new EnvironmentError(`Missing required env var "${name}"`);
        return undefined;
    }
    return raw;
}

// ────────────────────────────────────────────────────────────────────────────
// Public helpers – with overloads to keep strict types
// ────────────────────────────────────────────────────────────────────────────

/**
 * @overload
 * @param {string} name
 * @returns {string}
 */
/**
 * @overload
 * @param {string} name
 * @param {true} required
 * @returns {string}
 */
/**
 * @overload
 * @param {string} name
 * @param {false} required
 * @returns {string|undefined}
 */
/**
 * @param {string} name
 * @param {boolean} [required=true]
 * @returns {string|undefined}
 */
export function envString(name, required = true) {
    return getRaw(name, required);
}

/**
 * @overload
 * @param {string} name
 * @returns {number}
 */
/**
 * @overload
 * @param {string} name
 * @param {true} required
 * @returns {number}
 */
/**
 * @overload
 * @param {string} name
 * @param {false} required
 * @returns {number|undefined}
 */
/**
 * @param {string} name
 * @param {boolean} [required=true]
 * @returns {number|undefined}
 */
export function envNumber(name, required = true) {
    const raw = getRaw(name, required);
    return raw === undefined ? undefined : parseNumber(raw);
}

/**
 * @overload
 * @param {string} name
 * @returns {boolean}
 */
/**
 * @overload
 * @param {string} name
 * @param {true} required
 * @returns {boolean}
 */
/**
 * @overload
 * @param {string} name
 * @param {false} required
 * @returns {boolean|undefined}
 */
/**
 * @param {string} name
 * @param {boolean} [required=true]
 * @returns {boolean|undefined}
 */
export function envBool(name, required = true) {
    const raw = getRaw(name, required);
    return raw === undefined ? undefined : parseBoolean(raw);
}

/**
 * @template {string} T
 * @overload
 * @param {string} name
 * @param {readonly T[]} allowed
 * @returns {T}
 */
/**
 * @template {string} T
 * @overload
 * @param {string} name
 * @param {readonly T[]} allowed
 * @param {true} required
 * @returns {T}
 */
/**
 * @template {string} T
 * @overload
 * @param {string} name
 * @param {readonly T[]} allowed
 * @param {false} required
 * @returns {T|undefined}
 */
/**
 * @template {string} T
 * @param {string} name
 * @param {readonly T[]} allowed
 * @param {boolean} [required=true]
 * @returns {T|undefined}
 */
export function envEnum(name, allowed, required = true) {
    const raw = getRaw(name, required);
    return raw === undefined ? undefined : ensureEnum(raw, allowed);
}

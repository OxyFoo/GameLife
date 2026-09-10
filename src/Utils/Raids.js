import langManager from 'Managers/LangManager';

/**
 * "12.4k" for 12 400, "980" below 1 000, "1.2M" above a million
 * @param {number} value
 * @returns {string}
 */
function FormatCompact(value) {
    const abs = Math.abs(value);
    if (abs >= 1000000) {
        return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (abs >= 1000) {
        return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return Math.round(value).toString();
}

/**
 * "3 400" (thin grouping, no locale dependency)
 * @param {number} value
 * @returns {string}
 */
function FormatThousands(value) {
    const rounded = Math.round(value);
    const sign = rounded < 0 ? '-' : '';
    const digits = Math.abs(rounded).toString();
    return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * "14j 5h", "2j 14h 32m", "3h42", "45m" — the two or three most significant parts
 * @param {number} seconds
 * @param {number} [parts] Number of parts, 2 or 3
 * @returns {string}
 */
function FormatCountdown(seconds, parts = 2) {
    const names = langManager.curr['dates']['names'];
    const total = Math.max(0, Math.floor(seconds));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);

    /** @type {string[]} */
    const chunks = [];
    if (days > 0) chunks.push(`${days}${names['day-min']}`);
    if (hours > 0 || days > 0) chunks.push(`${hours}${names['hours-min']}`);
    chunks.push(`${minutes}${names['minutes-min']}`);
    return chunks.slice(0, parts).join(' ');
}

/**
 * "1h45", "45min", "12h" — a duration in minutes for the card
 * @param {number} minutes
 * @returns {string}
 */
function FormatMinutes(minutes) {
    const names = langManager.curr['dates']['names'];
    const total = Math.max(0, Math.round(minutes));
    const hours = Math.floor(total / 60);
    const rest = total % 60;
    if (hours === 0) {
        return `${rest}${names['minutes-min']}`;
    }
    if (rest === 0) {
        return `${hours}${names['hours-min']}`;
    }
    return `${hours}${names['hours-min']}${rest.toString().padStart(2, '0')}`;
}

export { FormatCompact, FormatThousands, FormatCountdown, FormatMinutes };

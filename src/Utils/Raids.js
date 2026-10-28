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

/**
 * Damage ratio of a season as the app draws it [0;1]: the registry the server keeps (`progress`),
 * forced to 1 once the boss is defeated — the defeating hit can leave the registry a hair below 1.
 * Single source for the phase of the boss and for its bar on the Home.
 * @param {number} progress `progress` of the season, or of a history entry
 * @param {boolean} defeated
 * @returns {number}
 */
function RaidDamageRatio(progress, defeated) {
    if (defeated) {
        return 1;
    }
    return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

/**
 * Phase of a boss drawn in `count` images: its life is cut in `count` equal parts, the first image
 * while it is untouched and the last one until its defeat. With 4: [0, 25 %[ → 0, [25 %, 50 %[ → 1,
 * [50 %, 75 %[ → 2, [75 %, 100 %] → 3.
 * @param {number} progress Damage ratio of the season [0;1]
 * @param {number} count Number of phases, at least 1
 * @returns {number} 0-based
 */
function RaidPhaseIndex(progress, count) {
    const index = Number.isFinite(progress) ? Math.floor(progress * count) : 0;
    return Math.min(count - 1, Math.max(0, index));
}

/**
 * Where the boss changes phase on a bar of its life: 1/count … (count − 1)/count, none with a single phase
 * @param {number} count Number of phases
 * @returns {number[]} Fractions in ]0;1[, for the `markers` of a `ProgressBar`
 */
function RaidPhaseMarkers(count) {
    return Array.from({ length: Math.max(0, count - 1) }, (_, i) => (i + 1) / count);
}

export {
    FormatCompact,
    FormatThousands,
    FormatCountdown,
    FormatMinutes,
    RaidDamageRatio,
    RaidPhaseIndex,
    RaidPhaseMarkers
};

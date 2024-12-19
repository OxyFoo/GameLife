import langManager from 'Managers/LangManager';

import { ParsePlural } from 'Utils/String';

/**
 * Prepare the string to dislpay in the separator from a hour and min number
 * @param {number} deltaTime In seconds
 * @returns {string}
 */
function createSeparatorText(deltaTime) {
    const lang = langManager.curr['calendar'];

    const deltaTimeMinutes = Math.floor(deltaTime / 60);
    const hourDiff = Math.floor(deltaTimeMinutes / 60);
    const minuteDiff = deltaTimeMinutes % 60;

    let separatorText = '';
    if (hourDiff === 0 && minuteDiff === 0) {
        separatorText = lang['between-activity-hour'].replace('{}', '24');
        separatorText = ParsePlural(separatorText, true);
    } else if (hourDiff === 0) {
        const text = lang['between-activity-min'].replace('{}', minuteDiff.toString());
        separatorText = ParsePlural(text, minuteDiff > 1);
    } else if (minuteDiff === 0) {
        const text = lang['between-activity-hour'].replace('{}', hourDiff.toString());
        separatorText = ParsePlural(text, hourDiff > 1);
    } else {
        separatorText = lang['between-activity'];
        separatorText = separatorText.replace('{}', hourDiff.toString());
        separatorText = separatorText.replace('{}', minuteDiff.toString());
    }

    return separatorText;
}

export { createSeparatorText };

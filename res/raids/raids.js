/**
 * Visuals of the raid seasons, embedded in the app. The database gives one key per season
 * (`RaidSeasons.ImageID`, e.g. 'desert-de-feu') and that key carries both images at once.
 * An unknown key falls back to `RAID_GENERIC`: shipping a new boss is an app update that drops a
 * folder here and adds one line below.
 *
 * Every `require` must stay a static literal for Metro.
 *
 * @typedef {{ boss: number, background: number }} RaidImages
 */

/** @type {Record<string, RaidImages>} */
const RAIDS = {
    'desert-de-feu': {
        boss: require('./desert-de-feu/boss.png'),
        background: require('./desert-de-feu/background.png')
    }
};

/** @type {RaidImages} */
const RAID_GENERIC = {
    boss: require('./generic/boss.png'),
    background: require('./generic/background.png')
};

export { RAID_GENERIC };
export default RAIDS;

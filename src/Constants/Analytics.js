/**
 * @description What the app reports to DevEye: the name of every screen, and the name of every
 * step worth counting.
 *
 * Everything DevEye displays comes from here, and nothing else in the app writes one of these
 * strings by hand. Names are compared byte for byte on the DevEye side, accents and capitals
 * included: a name written twice slightly differently produces two lines that each count half, and
 * an event renamed after the fact cuts every funnel that used it in two. So they are constants,
 * they are French because that is what the DevEye screens display, and they do not change.
 *
 * Few of them on purpose. A screen is already counted on its own (see `GetPagePath`); an event is
 * for a step that no screen expresses - something the user did, not something they saw.
 */

/**
 * @typedef {import('Interface/Pages').PageNames} PageNames
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivityAddedType} ActivityAddedType
 */

/**
 * Screens that are never reported.
 *
 * `display` is the generic result screen: it follows nearly every action, says nothing about which
 * one, and would sit at the top of the ranking for good. The other three only exist in a
 * development build.
 * @type {PageNames[]}
 */
const ANALYTICS_UNTRACKED_PAGES = ['display', 'test', 'benchmark', 'responsive'];

/**
 * The path of a screen, as it appears under "Pages" in DevEye.
 *
 * The page name is used as-is rather than translated: it is the one thing that cannot drift from
 * the code. Underscores become slashes, which turns the four `settings_*` pages into a readable
 * `/settings/...` family.
 * @param {PageNames} pageName
 * @returns {string | null} Null for a screen that is not reported
 */
function GetPagePath(pageName) {
    if (ANALYTICS_UNTRACKED_PAGES.includes(pageName)) {
        return null;
    }

    return `/${pageName.replace(/_/g, '/')}`;
}

/**
 * Screens that are not pages: panels and modes opened over a page, which the navigation engine
 * therefore never reports. `/panel/add-activity` is the one that matters - it is the entrance of
 * the app's main loop, and without it nothing distinguishes "opened the form" from "recorded an
 * activity".
 */
const ANALYTICS_PATHS = {
    ADD_ACTIVITY: '/panel/add-activity',
    EDIT_ACTIVITY: '/panel/edit-activity',
    PROFILE_FRIEND: '/panel/profile-friend',
    PROFILE_RAID_PLAYER: '/panel/raid-player',
    RAID_SEASON: '/panel/raid-season',
    AVATAR_EDITOR: '/profile/avatar'
};

/** Named steps. Sorted by domain, in the order a user meets them. */
const ANALYTICS_EVENTS = {
    // Getting in
    ONBOARDING_DONE: 'Onboarding terminé',
    ACCOUNT_CREATED: 'Compte créé',
    LOGIN_SUCCESS: 'Connexion réussie',

    // The main loop
    ACTIVITY_ADDED: 'Activité ajoutée',
    TIMER_STARTED: 'Chrono démarré',
    ACTIVITY_EDITED: 'Activité modifiée',
    ACTIVITY_DELETED: 'Activité supprimée',
    SKILL_CREATED_BY_ZAP: 'Compétence créée par Zap',

    // Progression
    DAILY_QUEST_CLAIMED: 'Quête du jour réclamée',
    MISSION_CLAIMED: 'Mission réclamée',
    ACHIEVEMENT_CLAIMED: 'Succès réclamé',
    REWARDED_AD_WATCHED: 'Pub récompensée regardée',

    // Shop
    CHEST_RANDOM_BOUGHT: 'Coffre aléatoire acheté',
    CHEST_TARGETED_BOUGHT: 'Coffre ciblé acheté',
    DAILY_DEAL_BOUGHT: 'Offre du jour achetée',
    PURCHASE_STARTED: 'Achat Ox lancé',
    PURCHASE_CONFIRMED: 'Achat Ox confirmé',

    // Raids
    RAID_HEAL_OX: 'Raid : soin par Ox',
    RAID_HEAL_AD: 'Raid : soin par pub',
    RAID_REWARD_CLAIMED: 'Raid : récompense réclamée',

    // Social and the rest
    FRIEND_ADDED: 'Ami ajouté',
    AVATAR_ITEM_EQUIPPED: 'Avatar : tenue changée',
    REPORT_SENT: 'Retour envoyé'
};

/**
 * How the activity was recorded. Emitted next to `ACTIVITY_ADDED`, never instead of it: the plain
 * name stays the one number to watch, these three say which of the three doors was used.
 * @type {Record<ActivityAddedType, string>}
 */
const ANALYTICS_ACTIVITY_ADDED_BY = {
    normal: 'Activité ajoutée : manuelle',
    'start-now': 'Activité ajoutée : chrono',
    'zap-gpt': 'Activité ajoutée : Zap'
};

export { ANALYTICS_EVENTS, ANALYTICS_PATHS, ANALYTICS_ACTIVITY_ADDED_BY, ANALYTICS_UNTRACKED_PAGES, GetPagePath };

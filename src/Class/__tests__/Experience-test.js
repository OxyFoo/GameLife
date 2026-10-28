import dataManager from 'Managers/DataManager';
import DynamicVar from 'Utils/DynamicVar';
import Experience from 'Class/Experience';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemStatsMap} ItemStatsMap
 */

const SKILL = 1;

/** Only the fields Experience reads */
const SKILLS = /** @type {any} */ ([
    {
        ID: SKILL,
        Enabled: true,
        Name: { fr: 'Muscu', en: 'Gym' },
        XP: 100,
        CategoryID: 1,
        Stats: { int: 0, soc: 0, for: 3, sta: 2, agi: 0, dex: 2 }
    }
]);

/** @param {number} duration In minutes */
const activity = (duration) => ({
    skillID: SKILL,
    startTime: 0,
    duration,
    comment: '',
    timezone: 0,
    addedType: 'normal',
    addedTime: 0,
    friends: [],
    notifyBefore: null
});

/**
 * Fake user: only what Experience touches
 * @param {ItemStatsMap[]} equippedStats
 */
const makeUser = (equippedStats) => ({
    activities: {
        allActivities: new DynamicVar(/** @type {any[]} */ ([])),
        GetUseful: () => [activity(60), activity(60)]
    },
    avatar: { GetEquippedStats: () => equippedStats }
});

beforeAll(() => {
    dataManager.skills.Load({ skills: SKILLS, skillIcons: [], skillCategories: [] });
});

describe('Experience with the equipped copies', () => {
    test('shows the stats multiplied by the equipment and keeps the base for the server', () => {
        const experience = new Experience(/** @type {any} */ (makeUser([{ for: 50 }, { dex: 25 }])));
        experience.UpdateExperience();

        expect(experience.GetBaseStatsNumber()).toEqual({ int: 0, soc: 0, for: 6, sta: 4, agi: 0, dex: 4 });
        expect(experience.GetStatsNumber()).toEqual({ int: 0, soc: 0, for: 9, sta: 4, agi: 0, dex: 5 });
        expect(experience.experience.Get().xpInfo.totalXP).toBe(200);
    });

    test('without any equipment the shown stats are the base ones', () => {
        const experience = new Experience(/** @type {any} */ (makeUser([])));
        experience.UpdateExperience();

        expect(experience.GetStatsNumber()).toEqual(experience.GetBaseStatsNumber());
    });

    test('recomputes when the activities change', () => {
        const user = makeUser([{ sta: 100 }]);
        const experience = new Experience(/** @type {any} */ (user));
        experience.onMount();

        expect(experience.GetStatsNumber().sta).toBe(8);
        user.activities.GetUseful = () => [activity(60)];
        user.activities.allActivities.Set([]);
        expect(experience.GetStatsNumber().sta).toBe(4);
        experience.Unmount();
    });
});

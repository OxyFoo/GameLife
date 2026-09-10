import dataManager from 'Managers/DataManager';
import Raids from '../index';
import DynamicVar from 'Utils/DynamicVar';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidStatePayload} RaidStatePayload
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidSeasonPublic} RaidSeasonPublic
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidParticipantSelf} RaidParticipantSelf
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Activities').ActivitySaved} ActivitySaved
 * @typedef {import('Managers/UserManager').default} UserManager
 */

const DAY = 24 * 60 * 60;
const S = Date.UTC(2026, 9, 1) / 1000;
const E = Date.UTC(2026, 10, 1) / 1000;
const NOW = S + 10 * DAY;
/** End of the 4th 12h activity of the tests below: the 48h budget is exhausted, the heal starts */
const HEAL_START = S + 4 * DAY + 8 * 3600 + 720 * 60;
const ZERO = { int: 0, for: 0, dex: 0, sta: 0, agi: 0, soc: 0 };

/** Only the fields read by the raid preview are meaningful here */
const SKILLS = /** @type {any} */ ([
    { ID: 1, Enabled: true, Name: { fr: 'Sport', en: 'Sport' }, XP: 100, CategoryID: 1 }
]);

/** @returns {RaidSeasonPublic} */
const season = () => ({
    id: 1,
    number: 1,
    name: { fr: 'Désert de feu', en: 'Fire Desert' },
    description: { fr: '', en: '' },
    bossName: { fr: 'Ifrit', en: 'Ifrit' },
    difficulty: 'normal',
    imageID: 'unknown-image',
    rewards: [],
    consolationRewards: [],
    startTime: S,
    endTime: E,
    hpPerParticipant: 2500,
    participantsCount: 30,
    progress: 0.1,
    hp: 5000,
    maxHP: 50000,
    defeatedAt: null,
    closedAt: null
});

/** @returns {RaidParticipantSelf} */
const self = () => ({
    joinedAt: S,
    active: true,
    stats: ZERO,
    level: 12,
    damage: 60,
    hits: 1,
    criticals: 0,
    minutes: 60,
    rank: 3,
    prevRank: 5,
    trend: 'up',
    rewardState: 'none',
    simulation: {
        phases: [],
        hits: [],
        totals: { damage: 60, hits: 1, criticals: 0, minutes: 60 },
        current: { kind: 'fight', start: S, end: null, budgetTotal: 2880, budgetUsed: 60 },
        unusedSkipIDs: []
    }
});

/**
 * @param {Partial<RaidStatePayload>} partial
 * @returns {RaidStatePayload}
 */
const payload = (partial = {}) => ({
    state: 'ok',
    season: season(),
    self: self(),
    skips: [],
    accountID: 42,
    nextSeasonAt: null,
    serverTime: NOW,
    healAdRemaining: 3,
    ...partial
});

/**
 * @param {number} dayOffset
 * @param {number} duration
 * @returns {ActivitySaved}
 */
const activity = (dayOffset, duration) => {
    const startTime = S + dayOffset * DAY + 8 * 3600;
    return {
        ID: dayOffset,
        skillID: 1,
        startTime,
        duration,
        comment: '',
        timezone: 0,
        addedType: 'normal',
        addedTime: startTime + 60,
        friends: [],
        notifyBefore: null
    };
};

/** Fake user: only what Raids touches */
const makeUser = (level = 12) => {
    const fake = {
        interface: { console: { AddLog: jest.fn() }, popup: { OpenT: jest.fn() } },
        experience: {
            experience: new DynamicVar({ stats: ZERO, xpInfo: { xp: 0, lvl: level, next: 0, totalXP: 0 } }),
            GetStatsNumber: () => ZERO
        },
        activities: {
            allActivities: new DynamicVar(/** @type {ActivitySaved[]} */ ([])),
            Get: () => fake.activities.allActivities.Get()
        },
        informations: { ox: new DynamicVar(0) },
        rewards: {
            ExecuteRewards: jest.fn(() => Promise.resolve(true)),
            ShowRewards: jest.fn(() => Promise.resolve())
        },
        server2: {
            serverState: { status: 'up-to-date', version: null },
            tcp: { SendAndWait: jest.fn(() => Promise.resolve({ status: 'ok' })) }
        },
        SaveLocal: jest.fn(() => Promise.resolve(true))
    };
    return fake;
};

beforeAll(() => {
    dataManager.skills.Load({ skills: SKILLS, skillIcons: [], skillCategories: [] });
    jest.useFakeTimers();
    jest.setSystemTime(NOW * 1000);
});

afterAll(() => {
    jest.useRealTimers();
});

describe('Raids', () => {
    test('reports whether the raid data was ever received', () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));

        // Nothing loaded yet: the status alone cannot tell this apart from a real 'no-season', which
        // is why the home widget shows empty rings instead of the "no raid" message
        expect(raids.GetSnapshot(NOW).loaded).toBe(false);
        expect(raids.GetSnapshot(NOW).status).toBe('no-season');

        raids.Load({ cache: payload(), fetchedAt: NOW });
        expect(raids.GetSnapshot(NOW).loaded).toBe(true);

        raids.Clear();
        expect(raids.GetSnapshot(NOW).loaded).toBe(false);
    });

    test('is locked below level 10, whatever the server says', () => {
        const user = makeUser(9);
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        raids.Load({ cache: payload(), fetchedAt: NOW });
        expect(raids.GetStatus(NOW)).toBe('locked');
        user.experience.experience.Set({ stats: ZERO, xpInfo: { xp: 0, lvl: 10, next: 0, totalXP: 900 } });
        expect(raids.GetStatus(NOW)).toBe('fighting');
    });

    test('statuses follow the season and the local simulation', () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        expect(raids.GetStatus(NOW)).toBe('no-season');

        raids.Load({
            cache: payload({ state: 'no-season', season: null, self: null, nextSeasonAt: E }),
            fetchedAt: NOW
        });
        expect(raids.GetStatus(NOW)).toBe('heroes-rest');

        raids.Load({ cache: payload(), fetchedAt: NOW });
        expect(raids.GetStatus(NOW)).toBe('fighting');
        expect(raids.GetStatus(E + 1)).toBe('ended');

        raids.Load({ cache: payload({ season: { ...season(), defeatedAt: NOW - DAY } }), fetchedAt: NOW });
        expect(raids.GetStatus(NOW)).toBe('defeated');
    });

    test('previews the phase from the local activities, without any critical', () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        raids.onMount();
        raids.Load({ cache: payload(), fetchedAt: NOW });

        // The preview is computed at the system time: inside the heal that follows the 4th activity
        jest.setSystemTime((HEAL_START + 60) * 1000);
        user.activities.allActivities.Set([activity(1, 720), activity(2, 720), activity(3, 720), activity(4, 720)]);
        const simulation = raids.GetSimulation();
        expect(simulation?.totals.damage).toBe(2880);
        expect(simulation?.totals.criticals).toBe(0);
        expect(simulation?.current.kind).toBe('heal');
        expect(raids.GetStatus(HEAL_START + 60)).toBe('healing');
        expect(raids.GetHealRemaining(HEAL_START + 3600)).toBe(23 * 3600);
        expect(raids.GetStatus(HEAL_START + DAY + 1)).toBe('fighting');
        jest.setSystemTime(NOW * 1000);
        raids.Unmount();
    });

    test('the update gate needs an unknown image AND an optional update', () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        raids.Load({ cache: payload(), fetchedAt: NOW });
        expect(raids.GetStatus(NOW)).toBe('fighting');
        user.server2.serverState.status = 'update-optional';
        expect(raids.GetStatus(NOW)).toBe('update-required');
    });

    test('LoadOnline keeps the cache on an old server and fails only on a lost connection', async () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        raids.Load({ cache: payload(), fetchedAt: NOW });

        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(/** @type {any} */ ('timeout'));
        expect(await raids.LoadOnline()).toBe(false);
        expect(raids.GetSeason()?.number).toBe(1);

        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(/** @type {any} */ ({ status: 'unknown' }));
        expect(await raids.LoadOnline()).toBe(true);
        expect(raids.GetSeason()?.number).toBe(1);

        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({ status: 'get-raid', result: payload({ season: { ...season(), number: 2 } }) })
        );
        expect(await raids.LoadOnline()).toBe(true);
        expect(raids.GetSeason()?.number).toBe(2);
        expect(user.SaveLocal).toHaveBeenCalled();
    });

    test('the heal ad is offered once per phase and within the daily quota', () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        raids.onMount();
        raids.Load({ cache: payload(), fetchedAt: NOW });
        expect(raids.GetHealAdAvailability(NOW)).toBe('not-healing');

        jest.setSystemTime((HEAL_START + 60) * 1000);
        user.activities.allActivities.Set([activity(1, 720), activity(2, 720), activity(3, 720), activity(4, 720)]);
        expect(raids.GetHealAdAvailability(HEAL_START + 60)).toBe('ok');

        // A skip of an earlier heal phase must not lock the current one, even though its time falls
        // inside the window the gate used to test
        raids.Load({
            cache: payload({
                skips: [{ id: 1, time: HEAL_START + 30, minutes: 700, kind: 'ad', phaseStart: HEAL_START - DAY }]
            }),
            fetchedAt: NOW
        });
        expect(raids.GetHealAdAvailability(HEAL_START + 60)).toBe('ok');

        raids.Load({
            cache: payload({
                skips: [{ id: 1, time: HEAL_START + 30, minutes: 700, kind: 'ad', phaseStart: HEAL_START }]
            }),
            fetchedAt: NOW
        });
        expect(raids.GetHealAdAvailability(HEAL_START + 60)).toBe('already-used');

        raids.Load({ cache: payload({ healAdRemaining: 0 }), fetchedAt: NOW });
        expect(raids.GetHealAdAvailability(HEAL_START + 60)).toBe('limit-reached');
        jest.setSystemTime(NOW * 1000);
        raids.Unmount();
    });

    test('the reward state comes from the server and drives the claim', async () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));

        raids.Load({ cache: payload(), fetchedAt: NOW });
        expect(raids.GetSnapshot(NOW).rewardState).toBe('none');

        raids.Load({
            cache: payload({
                season: { ...season(), defeatedAt: NOW - DAY },
                self: { ...self(), rewardState: 'claimable' }
            }),
            fetchedAt: NOW
        });
        expect(raids.GetStatus(NOW)).toBe('defeated');
        expect(raids.GetSnapshot(NOW).rewardState).toBe('claimable');

        // A refused claim explains itself and resynchronises instead of crediting anything
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({ status: 'claim-raid-reward', result: 'already-claimed' })
        );
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({ status: 'get-raid', result: payload() })
        );
        expect(await raids.ClaimReward(1)).toBe('already-claimed');
        expect(user.rewards.ExecuteRewards).not.toHaveBeenCalled();

        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({
                status: 'claim-raid-reward',
                result: { rewards: [{ Type: 'OX', Amount: 500 }], newOx: 500 }
            })
        );
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({ status: 'get-raid', result: payload() })
        );
        expect(await raids.ClaimReward(1)).toBe('ok');
        expect(user.rewards.ExecuteRewards).toHaveBeenCalledWith([{ Type: 'OX', Amount: 500 }], 500);
        expect(user.rewards.ShowRewards).toHaveBeenCalled();
    });

    test('HealByOx refuses without enough ox and never calls the server', async () => {
        const user = makeUser();
        const raids = new Raids(/** @type {UserManager} */ (/** @type {unknown} */ (user)));
        raids.onMount();
        raids.Load({ cache: payload(), fetchedAt: NOW });
        jest.setSystemTime((HEAL_START + 60) * 1000);
        user.activities.allActivities.Set([activity(1, 720), activity(2, 720), activity(3, 720), activity(4, 720)]);

        expect(await raids.HealByOx()).toBe('not-enough-ox');
        expect(user.interface.popup.OpenT).toHaveBeenCalledTimes(1);
        expect(user.server2.tcp.SendAndWait).not.toHaveBeenCalled();
        raids.Unmount();
        jest.setSystemTime(NOW * 1000);
    });
});

import dataManager from 'Managers/DataManager';
import DynamicVar from 'Utils/DynamicVar';
import Inventory from '../Inventory';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 */

/**
 * @param {number} ID
 * @param {Partial<Stuff>} [extra]
 * @returns {Stuff}
 */
const stuff = (ID, extra = {}) => ({
    ID,
    ItemID: 'hair_00',
    CreatedBy: 1,
    CreatedAt: 0,
    Rarity: 'common',
    Stats: { for: 5 },
    ...extra
});

/** Fake user: only what Inventory touches */
const makeUser = () => ({
    interface: { console: { AddLog: jest.fn() } },
    informations: { ox: new DynamicVar(100) },
    experience: { UpdateExperience: jest.fn() },
    server2: { tcp: { SendAndWait: jest.fn(() => Promise.resolve({ status: 'ok' })) } },
    SaveLocal: jest.fn(() => Promise.resolve(true))
});

const makeInventory = () => {
    const user = makeUser();
    const inventory = new Inventory(/** @type {any} */ (user));
    inventory.Load({ stuffs: [stuff(1), stuff(2), stuff(3)], token: 5 });
    return { user, inventory };
};

describe('Inventory.ForgeStuff', () => {
    test('sends the request as the server expects it', async () => {
        const { user, inventory } = makeInventory();
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(/** @type {any} */ ('timeout'));
        await inventory.ForgeStuff(1, [2, 3]);
        expect(user.server2.tcp.SendAndWait).toHaveBeenCalledWith({
            action: 'forge-stuff',
            stuffID: 1,
            catalystIDs: [2, 3]
        });
    });

    test('answers error on the sentinels and on a wrong status, touching nothing', async () => {
        const { user, inventory } = makeInventory();
        for (const answer of ['timeout', 'not-sent', 'interrupted', { status: 'unknown' }]) {
            jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(/** @type {any} */ (answer));
            expect(await inventory.ForgeStuff(1, [2])).toEqual({ result: 'error' });
        }
        expect(inventory.stuffs).toHaveLength(3);
        expect(user.informations.ox.Get()).toBe(100);
        expect(user.experience.UpdateExperience).not.toHaveBeenCalled();
    });

    test('relays a refusal and the balance it carries', async () => {
        const { user, inventory } = makeInventory();
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({ status: 'forge-stuff', result: 'not-enough-ox', ox: 12 })
        );
        expect(await inventory.ForgeStuff(1, [2])).toEqual({ result: 'not-enough-ox' });
        expect(inventory.stuffs).toHaveLength(3);
        expect(user.informations.ox.Get()).toBe(12);
        expect(user.experience.UpdateExperience).not.toHaveBeenCalled();
    });

    test('relays the catalyst refusals without touching the inventory', async () => {
        const { user, inventory } = makeInventory();
        for (const result of ['catalyst-rarity', 'catalyst-starter']) {
            jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
                /** @type {any} */ ({ status: 'forge-stuff', result })
            );
            expect(await inventory.ForgeStuff(1, [2])).toEqual({ result });
        }
        expect(inventory.stuffs).toHaveLength(3);
        expect(user.informations.ox.Get()).toBe(100);
    });

    test('on success removes the catalysts and replaces the main copy in place', async () => {
        const { user, inventory } = makeInventory();
        const upgraded = stuff(1, { Rarity: 'rare', Stats: { for: 12 } });
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({
                status: 'forge-stuff',
                result: 'ok',
                success: true,
                chance: 0.3,
                cost: 30,
                stuff: upgraded,
                ox: 70,
                token: 9
            })
        );
        const outcome = await inventory.ForgeStuff(1, [2]);
        expect(outcome).toEqual({ result: 'ok', success: true, chance: 0.3, cost: 30, stuff: upgraded });
        // Same position, same ID: the avatar wearing it is untouched
        expect(inventory.stuffs.map((s) => s.ID)).toEqual([1, 3]);
        expect(inventory.GetStuffByID(1)).toEqual(upgraded);
        expect(user.informations.ox.Get()).toBe(70);
        expect(inventory.Get().token).toBe(9);
        expect(user.experience.UpdateExperience).toHaveBeenCalledTimes(1);
        expect(user.SaveLocal).toHaveBeenCalled();
    });

    test('on failure removes the catalysts and keeps the main copy as it was', async () => {
        const { user, inventory } = makeInventory();
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({
                status: 'forge-stuff',
                result: 'ok',
                success: false,
                chance: 0.6,
                cost: 30,
                stuff: stuff(1),
                ox: 70
            })
        );
        const outcome = await inventory.ForgeStuff(1, [2, 3]);
        expect(outcome.result).toBe('ok');
        expect(outcome.result === 'ok' && outcome.success).toBe(false);
        expect(inventory.stuffs).toEqual([stuff(1)]);
        expect(user.informations.ox.Get()).toBe(70);
    });
});

describe('Inventory: starter outfit and catalysts', () => {
    /**
     * @param {string} ID
     * @param {boolean} starter
     */
    const item = (ID, starter) =>
        /** @type {any} */ ({
            ID,
            Slot: ID.split('_')[0],
            Name: { fr: ID, en: ID },
            Description: { fr: '', en: '' },
            Rarity: 'common',
            Buyable: true,
            Value: 222,
            Buffs: [],
            StatsRange: null,
            StatsKeys: null,
            Starter: starter
        });

    beforeEach(() => {
        dataManager.items.Load([item('hair_00', true), item('hair_01', false), item('top_01', false)]);
    });

    /** 1 starter, 2 and 3 common, 4 rare, 5 common equipped */
    const makeCatalystInventory = () => {
        const { inventory } = makeInventory();
        inventory.Load({
            stuffs: [
                stuff(1, { ItemID: 'hair_00', Stats: {} }),
                stuff(2, { ItemID: 'hair_01' }),
                stuff(3, { ItemID: 'top_01' }),
                stuff(4, { ItemID: 'top_01', Rarity: 'rare' }),
                stuff(5, { ItemID: 'hair_01' })
            ],
            token: 5
        });
        return inventory;
    };

    test('recognises the starter outfit', () => {
        const inventory = makeCatalystInventory();
        expect(inventory.IsStarterStuff(stuff(1, { ItemID: 'hair_00' }))).toBe(true);
        expect(inventory.IsStarterStuff(stuff(2, { ItemID: 'hair_01' }))).toBe(false);
    });

    test('locks the equipped copies and the starter outfit while no main copy is chosen', () => {
        const inventory = makeCatalystInventory();
        expect(inventory.GetLockedCatalystIDs(null, [5])).toEqual([1, 5]);
    });

    test('also locks the copies of another rarity than the main copy', () => {
        const inventory = makeCatalystInventory();
        const commonMain = inventory.GetStuffByID(2);
        const rareMain = inventory.GetStuffByID(4);
        expect(inventory.GetLockedCatalystIDs(commonMain, [5])).toEqual([1, 4, 5]);
        expect(inventory.GetLockedCatalystIDs(rareMain, [5])).toEqual([1, 2, 3, 5]);
    });

    test('a starter main copy takes common catalysts, never another starter copy', () => {
        const inventory = makeCatalystInventory();
        expect(inventory.GetLockedCatalystIDs(inventory.GetStuffByID(1), [])).toEqual([1, 4]);
    });

    test('the shop never offers the starter outfit, even marked buyable', () => {
        expect(dataManager.items.GetBuyable().map((i) => i.ID)).toEqual(['hair_01', 'top_01']);
        expect(dataManager.items.GetBuyable('hair').map((i) => i.ID)).toEqual(['hair_01']);
    });

    test('relays the refusal to sell a starter copy', async () => {
        const { user, inventory } = makeInventory();
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(
            /** @type {any} */ ({ status: 'sell-stuff', result: 'item-starter' })
        );
        expect(await inventory.SellStuff(1)).toBe('item-starter');
        expect(inventory.stuffs).toHaveLength(3);
    });
});

describe('Inventory.Load', () => {
    test('a cache written before the copies had a rarity forces a full reload', async () => {
        const { user, inventory } = makeInventory();
        inventory.Load({
            stuffs: [/** @type {any} */ ({ ID: 1, ItemID: 'hair_00', CreatedBy: 1, CreatedAt: 0 })],
            token: 5
        });
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(/** @type {any} */ ('timeout'));
        await inventory.LoadOnline();
        expect(user.server2.tcp.SendAndWait).toHaveBeenCalledWith({ action: 'get-inventories', token: 0 });
    });

    test('a cache with rarities keeps its token', async () => {
        const { user, inventory } = makeInventory();
        jest.mocked(user.server2.tcp.SendAndWait).mockResolvedValueOnce(/** @type {any} */ ('timeout'));
        await inventory.LoadOnline();
        expect(user.server2.tcp.SendAndWait).toHaveBeenCalledWith({ action: 'get-inventories', token: 5 });
    });
});

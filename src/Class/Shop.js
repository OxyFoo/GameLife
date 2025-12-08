import langManager from 'Managers/LangManager';
import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {'hair' | 'top' | 'bottom' | 'shoes'} Slot
 *
 * @typedef {import('@oxyfoo/gamelife-types').Rarities} Rarities
 * @typedef {import('@oxyfoo/gamelife-types/Class/Shop').SaveObject_Shop} SaveObject_Shop
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_ServerToClient').ShopChestStats} ShopChestStats
 *
 * @typedef Chest
 * @property {number} priceOriginal
 * @property {number} priceDiscount
 * @property {Object} probas
 * @property {number} probas.common
 * @property {number} probas.rare
 * @property {number} probas.epic
 * @property {number} probas.legendary
 *
 * @typedef BuyableRandomChest
 * @property {string} ref
 * @property {string | number} ID
 * @property {ImageSourcePropType} Image
 * @property {number} PriceOriginal
 * @property {number} PriceDiscount
 * @property {Exclude<Rarities, 'legendary'>} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {() => void} OnPress
 *
 * @typedef Target
 * @property {string} id
 * @property {IconsName} icon
 * @property {() => void} onPress
 *
 * @typedef BuyableTargetedChest
 * @property {string} ref
 * @property {string | number} ID
 * @property {string} Name
 * @property {Slot} Slot
 * @property {ImageSourcePropType} Image
 * @property {number} PriceOriginal
 * @property {number} PriceDiscount
 * @property {Exclude<Rarities, 'legendary'>} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {() => void} OnPress
 */

/** @extends {IUserClass<SaveObject_Shop>} */
class Shop extends IUserClass {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('shop');

        this.#user = user;
    }

    buyToday = {
        /** @type {string} Today date */
        day: '',

        /** @type {string[]} List of items ID */
        items: [],

        /** @type {number[]} List of inventory items ID */
        dyes: []
    };

    /** @type {string[]} */
    IAP_IDs = [];

    /** @type {number} Price factor, applied to all Ox prices in shop */
    priceFactor = 1;

    Clear = () => {
        this.buyToday = {
            day: '',
            items: [],
            dyes: []
        };
    };

    // TODO: Reimplement shop
    /**
     * @param {Object} inventory
     * @param {this['buyToday']} inventory.buyToday
     */
    LoadOnline(inventory) {
        if (typeof inventory !== 'object') return;
        /** @param {string} key */
        const contains = (key) => inventory.hasOwnProperty(key);
        if (contains('buyToday')) {
            const today = DateFormat(new Date(), 'DD/MM/YYYY');
            this.buyToday = inventory['buyToday'];
            this.buyToday.day = today;
            this.#user.SaveLocal();
        }
    }

    /**
     * @param {Partial<SaveObject_Shop>} data
     */
    Load = (data) => {
        if (typeof data.day !== 'undefined') {
            this.buyToday.day = data.day;
        }
        if (typeof data.items !== 'undefined') {
            this.buyToday.items = data.items;
        }
        if (typeof data.dyes !== 'undefined') {
            this.buyToday.dyes = data.dyes;
        }

        // If today is different, reset
        const today = DateFormat(new Date(), 'DD/MM/YYYY');
        if (today !== this.buyToday.day) {
            this.buyToday.day = today;
            this.buyToday.items = [];
            this.buyToday.dyes = [];
            this.#user.SaveLocal();
        }
    };

    /** @returns {SaveObject_Shop} */
    Save = () => {
        return {
            day: this.buyToday.day,
            items: this.buyToday.items,
            dyes: this.buyToday.dyes
        };
    };

    /** @param {string[]} iaps */
    LoadIAPs(iaps) {
        if (Array.isArray(iaps)) {
            this.IAP_IDs = iaps;
        }
    }

    /** @param {BuyableRandomChest} chest */
    BuyRandomChest = async (chest) => {
        const lang = langManager.curr['shop'];
        const price = chest.PriceDiscount < 0 ? chest.PriceOriginal : chest.PriceDiscount;

        // Check Ox Amount (local validation)
        if (this.#user.informations.ox.Get() < price) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        // Buy chest using TCP protocol
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-random-chest',
            rarity: chest.Rarity
        });

        // Check for connection errors
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'buy-random-chest'
        ) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Handle response
        if (response.result === 'not-enough-ox') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        if (response.result === 'invalid-rarity') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        if (response.result !== 'ok' || !response.newItem) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Update Ox amount
        if (response.ox !== undefined) {
            this.#user.informations.ox.Set(response.ox);
        }

        // Update inventory
        this.#user.inventory.stuffs.push(response.newItem);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: response.newItem.ItemID,
                chestRarity: chest.Rarity,
                callback: this.#user.interface.BackHandle
            },
            storeInHistory: false
        });
    };

    /** @param {BuyableTargetedChest} chest */
    BuyTargetedChest = async (chest) => {
        const lang = langManager.curr['shop'];
        const price = chest.PriceDiscount < 0 ? chest.PriceOriginal : chest.PriceDiscount;

        // Check Ox Amount (local validation)
        if (this.#user.informations.ox.Get() < price) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        // Buy chest using TCP protocol
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-targeted-chest',
            rarity: chest.Rarity,
            slot: chest.Slot
        });

        // Check for connection errors
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'buy-targeted-chest'
        ) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Handle response
        if (response.result === 'not-enough-ox') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        if (response.result === 'invalid-rarity' || response.result === 'invalid-slot') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        if (response.result === 'no-items-available') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        if (response.result !== 'ok' || !response.newItem) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Update Ox amount
        if (response.ox !== undefined) {
            this.#user.informations.ox.Set(response.ox);
        }

        // Update inventory
        this.#user.inventory.stuffs.push(response.newItem);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: response.newItem.ItemID,
                chestRarity: chest.Rarity,
                callback: this.#user.interface.BackHandle
            },
            storeInHistory: false
        });
    };

    /**
     * Buy a daily deal item
     * @param {string} itemID - The item ID to buy
     * @param {number} price - The item price (already with price factor applied)
     * @returns {Promise<boolean>} - True if purchase was successful
     */
    BuyDailyDeal = async (itemID, price) => {
        const lang = langManager.curr['shop'];

        // Check Ox Amount (local validation)
        if (this.#user.informations.ox.Get() < price) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return false;
        }

        // Buy item using TCP protocol
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-daily-deal',
            itemID: itemID
        });

        // Check for connection errors
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'buy-daily-deal'
        ) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return false;
        }

        // Handle response
        if (response.result === 'not-enough-ox') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return false;
        }

        if (response.result === 'already-purchased') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return false;
        }

        if (response.result === 'invalid-item' || response.result === 'item-not-available') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return false;
        }

        if (response.result !== 'ok' || !response.newItem) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return false;
        }

        // Update Ox amount
        if (response.ox !== undefined) {
            this.#user.informations.ox.Set(response.ox);
        }

        // Update inventory
        this.#user.inventory.stuffs.push(response.newItem);

        // Mark as purchased today
        this.buyToday.items.push(itemID);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        return true;
    };

    /**
     * @description Get shop content (daily deals and chest stats)
     * @returns {Promise<{
     *   dailyDeals: string[],
     *   chestsStats: {
     *     random: { common: Chest, rare: Chest, epic: Chest },
     *     target: { common: Chest, rare: Chest, epic: Chest }
     *   }
     * }>}
     * @throws {Error} If the server response is invalid
     */
    GetShopContent = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-shop' });

        // Check if response is valid
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-shop' ||
            response.result !== 'ok'
        ) {
            this.#user.interface.console?.AddLog('error', '[Server] Failed to get shop content from server', response);
            throw new Error(`Failed to get shop content from server: ${response}`);
        }

        return {
            dailyDeals: response.dailyDeals ?? [],
            chestsStats: {
                random: {
                    common: this.#convertChestStats(response.chestsStats?.random?.common),
                    rare: this.#convertChestStats(response.chestsStats?.random?.rare),
                    epic: this.#convertChestStats(response.chestsStats?.random?.epic)
                },
                target: {
                    common: this.#convertChestStats(response.chestsStats?.target?.common),
                    rare: this.#convertChestStats(response.chestsStats?.target?.rare),
                    epic: this.#convertChestStats(response.chestsStats?.target?.epic)
                }
            }
        };
    };

    /**
     * @param {ShopChestStats | undefined} stats
     * @returns {Chest}
     */
    #convertChestStats = (stats) => {
        if (!stats) {
            return {
                priceOriginal: 0,
                priceDiscount: 0,
                probas: { common: 0, rare: 0, epic: 0, legendary: 0 }
            };
        }
        return {
            priceOriginal: stats.priceOriginal,
            priceDiscount: stats.priceDiscount,
            probas: stats.probas
        };
    };
}

export default Shop;

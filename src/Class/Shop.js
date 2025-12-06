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
 * @property {string} LangName
 * @property {ImageSourcePropType} Image
 * @property {number} PriceOriginal
 * @property {number} PriceDiscount
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
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
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
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

        // Check Ox Amount
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

        // Buy chest
        const data = { rarity: chest.Rarity };
        const result = await this.#user.server.Request('buyRandomChest', data);
        if (result === null) return;

        // Check error
        if (result['status'] !== 'ok' || !result.hasOwnProperty('newItem')) {
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
        if (result.hasOwnProperty('ox')) {
            this.#user.informations.ox.Set(result['ox']);
        }

        // Update inventory
        const newItem = result['newItem'];
        this.#user.inventory.stuffs.push(newItem);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: newItem['ItemID'],
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

        // Check Ox Amount
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

        // Buy chest
        const data = {
            rarity: chest.Rarity,
            slot: chest.Slot
        };
        const result = await this.#user.server.Request('buyTargetedChest', data);
        if (result === null) return;

        // Check error
        if (result['status'] !== 'ok' || !result.hasOwnProperty('newItem')) {
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
        if (result.hasOwnProperty('ox')) {
            this.#user.informations.ox.Set(result['ox']);
        }

        // Update inventory
        const newItem = result['newItem'];
        this.#user.inventory.stuffs.push(newItem);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: newItem['ItemID'],
                chestRarity: chest.Rarity,
                callback: this.#user.interface.BackHandle
            },
            storeInHistory: false
        });
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

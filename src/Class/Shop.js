import langManager from 'Managers/LangManager';

import { DateFormat } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {'hair' | 'top' | 'bottom' | 'shoes'} Slot
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

class Shop {
    /** @param {UserManager} user */
    constructor(user) {
        this.user = user;
    }

    buyToday = {
        /** @type {string} Today date */
        day: '',

        /** @type {Array<string>} List of items ID */
        items: [],

        /** @type {Array<number>} List of inventory items ID */
        dyes: []
    };

    /** @type {Array<string>} */
    IAP_IDs = [];

    /** @type {number} Price factor, applied to all Ox prices in shop */
    priceFactor = 1;

    Clear() {
        this.buyToday = {
            day: '',
            items: [],
            dyes: []
        };
    }

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
            this.user.LocalSave();
        }
    }

    /**
     * @param {Object} data
     * @param {this['buyToday']} data.buyToday
     */
    Load(data) {
        /** @param {string} key */
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('buyToday')) this.buyToday = data['buyToday'];

        const today = DateFormat(new Date(), 'DD/MM/YYYY');
        if (today !== this.buyToday.day) {
            this.buyToday.day = today;
            this.buyToday.items = [];
            this.buyToday.dyes = [];
            this.user.LocalSave();
        }
    }

    Save() {
        const data = {
            buyToday: this.buyToday
        };
        return data;
    }

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
        if (this.user.informations.ox.Get() < price) {
            this.user.interface.popup?.OpenT({
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
        const result = await this.user.server.Request('buyRandomChest', data);
        if (result === null) return;

        // Check error
        if (result['status'] !== 'ok' || !result.hasOwnProperty('newItem')) {
            this.user.interface.popup?.OpenT({
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
            this.user.informations.ox.Set(result['ox']);
        }

        // Update inventory
        const newItem = result['newItem'];
        this.user.inventory.stuffs.push(newItem);

        // Save inventory
        this.user.LocalSave();

        // Update mission
        this.user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.user.interface.ChangePage('chestreward', {
            args: {
                itemID: newItem['ItemID'],
                chestRarity: chest.Rarity,
                callback: this.user.interface.BackHandle
            },
            storeInHistory: false
        });
    };

    /** @param {BuyableTargetedChest} chest */
    BuyTargetedChest = async (chest) => {
        const lang = langManager.curr['shop'];
        const price = chest.PriceDiscount < 0 ? chest.PriceOriginal : chest.PriceDiscount;

        // Check Ox Amount
        if (this.user.informations.ox.Get() < price) {
            this.user.interface.popup?.OpenT({
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
        const result = await this.user.server.Request('buyTargetedChest', data);
        if (result === null) return;

        // Check error
        if (result['status'] !== 'ok' || !result.hasOwnProperty('newItem')) {
            this.user.interface.popup?.OpenT({
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
            this.user.informations.ox.Set(result['ox']);
        }

        // Update inventory
        const newItem = result['newItem'];
        this.user.inventory.stuffs.push(newItem);

        // Save inventory
        this.user.LocalSave();

        // Update mission
        this.user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.user.interface.ChangePage('chestreward', {
            args: {
                itemID: newItem['ItemID'],
                chestRarity: chest.Rarity,
                callback: this.user.interface.BackHandle
            },
            storeInHistory: false
        });
    };
}

export default Shop;

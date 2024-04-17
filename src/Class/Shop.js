import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { DateToFormatString } from 'Utils/Date';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 * 
 * @typedef {import('Interface/OldComponents/Icon').Icons} Icons
 * @typedef {'hair' | 'top' | 'bottom' | 'shoes'} Slot
 * 
 * @typedef BuyableRandomChest
 * @property {string} ref
 * @property {string | number} ID
 * @property {string} LangName
 * @property {ImageSourcePropType} Image
 * @property {number} Price
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {() => void} OnPress
 * 
 * @typedef Target
 * @property {string} id
 * @property {Icons} icon
 * @property {() => void} onPress
 * 
 * @typedef BuyableTargetedChest
 * @property {string} ref
 * @property {string | number} ID
 * @property {string} Name
 * @property {Slot} Slot
 * @property {ImageSourcePropType} Image
 * @property {number} Price
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

    Clear() {
        this.buyToday = {
            day: '',
            items: [],
            dyes: []
        };
    }
    LoadOnline(inventory) {
        if (typeof(inventory) !== 'object') return;
        const contains = (key) => inventory.hasOwnProperty(key);
        if (contains('buyToday')) {
            const today = DateToFormatString(new Date());
            this.buyToday = inventory['buyToday'];
            this.buyToday.day = today;
            this.user.LocalSave();
        }
    }
    Load(data) {
        const contains = (key) => data.hasOwnProperty(key);
        if (contains('buyToday')) this.buyToday = data['buyToday'];

        const today = DateToFormatString(new Date());
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

    LoadIAPs(iaps) {
        if (Array.isArray(iaps)) {
            this.IAP_IDs = iaps;
        }
    }

    /** @param {BuyableRandomChest} chest */
    BuyRandomChest = async (chest) => {
        const lang = langManager.curr['shop'];

        // Check Ox Amount
        if (this.user.informations.ox.Get() < chest.Price) {
            const title = lang['popup-notenoughox-title'];
            const text = lang['popup-notenoughox-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        // Buy chest
        const data = { rarity: chest.Rarity };
        const result = await this.user.server.Request('buyRandomChest', data);
        if (result === null) return;

        // Check error
        if (result['status'] !== 'ok' || !result.hasOwnProperty('newItem')) {
            const title = lang['reward-failed-title'];
            const text = lang['reward-failed-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
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
        const args = {
            itemID: newItem['ItemID'],
            chestRarity: chest.Rarity,
            callback: this.user.interface.BackHandle
        };
        this.user.interface.ChangePage('chestreward', args, true);
    }

    /** @param {BuyableTargetedChest} chest */
    BuyTargetedChest = async (chest) => {
        const lang = langManager.curr['shop'];

        // Check Ox Amount
        if (this.user.informations.ox.Get() < chest.Price) {
            const title = lang['popup-notenoughox-title'];
            const text = lang['popup-notenoughox-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ]);
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
            const title = lang['reward-failed-title'];
            const text = lang['reward-failed-text'];
            this.user.interface.popup.ForceOpen('ok', [ title, text ], undefined, false);
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
        const args = {
            itemID: newItem['ItemID'],
            chestRarity: chest.Rarity,
            callback: this.user.interface.BackHandle
        };
        this.user.interface.ChangePage('chestreward', args, true);
    }
}

export default Shop;

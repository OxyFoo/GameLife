import * as React from 'react';

import { BuyPopup } from './popup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types').Rarities} Rarities
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemSlot} ItemSlot
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('Data/App/Items').ItemID} ItemID
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef BuyableItem
 * @property {ItemID} ID
 * @property {string} Name
 * @property {number} Price
 * @property {Rarities} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {CharacterContainerSize} Size Item size in pixels for the character
 * @property {ItemSlot} Slot Item slot type
 * @property {() => void} OnPress
 */

/**
 * @typedef {object} BackShopItemsPropsType
 * @property {ItemID[]} dailyItemsID
 */

/** @type {BackShopItemsPropsType} */
const BackShopItemsProps = {
    dailyItemsID: []
};

class BackShopItems extends React.Component {
    state = {
        /** @type {BuyableItem[]} */
        buyableItems: [],
        /** @type {string[]} Items purchased in this session (for immediate UI update) */
        purchasedItems: [...user.shop.buyToday.items]
    };

    /** @param {BackShopItemsPropsType} props */
    constructor(props) {
        super(props);

        const { dailyItemsID } = this.props;
        const newItems = this.refreshItems(dailyItemsID);
        if (newItems !== null) {
            this.state.buyableItems = newItems;
        }
    }

    /**
     * Called when an item is purchased to update UI immediately
     * @param {string} itemID
     */
    onItemPurchased = (itemID) => {
        this.setState((/** @type {this['state']} */ prevState) => ({
            purchasedItems: [...prevState.purchasedItems, itemID]
        }));
    };

    /**
     * Check if an item is purchased (either from server data or current session)
     * @param {string} itemID
     * @returns {boolean}
     */
    isItemPurchased = (itemID) => {
        return this.state.purchasedItems.includes(itemID.toString());
    };

    /**
     * Get items to display in item preview
     * For 'top' items, also show the user's bottom item
     * @param {BuyableItem} item
     * @returns {ItemConfig[]}
     */
    getPreviewItems = (item) => {
        /** @type {ItemConfig[]} */
        const baseItems = [{ id: item.ID }];

        // For 'top' items, also show bottom item (like in avatar editor slots)
        if (item.Slot === 'top') {
            const bottomStuffID = user.avatar.avatar.bottom;
            const bottomStuff = user.inventory.GetStuffByID(bottomStuffID);
            const bottomItemID = bottomStuff ? bottomStuff.ItemID : 'bottom_00';
            baseItems.push({ id: bottomItemID });
        }

        return baseItems;
    };

    /**
     * @param {ItemID[]} dailyItemsID
     * @returns {BuyableItem[] | null}
     */
    refreshItems = (dailyItemsID) => {
        const allBuyableItems = dataManager.items.GetBuyable();

        if (dailyItemsID === null) return null;

        // Create characters & get data for each item
        /** @type {BuyableItem[]} */
        const buyableItems = [];
        dailyItemsID.forEach((itemID) => {
            const item = allBuyableItems.find((i) => i.ID === itemID) || null;
            if (item === null) return;

            /** @type {BuyableItem} */
            const buyableItem = {
                ID: itemID,
                Name: langManager.GetText(item.Name),
                Price: item.Value,
                Rarity: item.Rarity,
                Colors: themeManager.GetRariryColors(item.Rarity),
                Size: dataManager.items.GetContainerSize(item.Slot),
                Slot: item.Slot,
                OnPress: () => this.openItemPopup(item)
            };
            buyableItems.push(buyableItem);
        });

        return buyableItems;
    };

    /** @param {Item} item */
    openItemPopup = (item) => {
        user.interface.popup?.Open({
            content: (
                <BuyPopup
                    item={item}
                    closePopup={user.interface.popup?.Close}
                    onPurchased={() => this.onItemPurchased(item.ID)}
                />
            )
        });
    };
}

BackShopItems.defaultProps = BackShopItemsProps;
BackShopItems.prototype.props = BackShopItemsProps;

export default BackShopItems;

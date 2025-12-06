import * as React from 'react';

import { renderItemPopup } from './popup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types').Rarities} Rarities
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {import('Data/App/Items').ItemID} ItemID
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef BuyableItem
 * @property {string | number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {Rarities} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {CharacterContainerSize} Size Item size in pixels for the character
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
        buyableItems: []
    };

    /** @param {BackShopItemsPropsType} props */
    constructor(props) {
        super(props);

        const { dailyItemsID } = this.props;
        const newItems = this.refreshItems(dailyItemsID)
        if (newItems !== null) {
            this.state.buyableItems = newItems;
        }
    }

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
            const item = allBuyableItems.find((i) => i.ID == itemID) || null;
            if (item === null) return;

            // TODO: Supprimer Character
            // const characterKey = `shop-character-${itemID.toString()}`;
            // const character = new Character(characterKey, 'skin_01', 0);
            // character.SetEquipment([itemID.toString()]);

            /** @type {BuyableItem} */
            const buyableItem = {
                ID: itemID,
                Name: langManager.GetText(item.Name),
                Price: item.Value,
                Rarity: item.Rarity,
                Colors: themeManager.GetRariryColors(item.Rarity),
                BackgroundColor: themeManager.GetColor('backgroundCard'),
                Size: dataManager.items.GetContainerSize(item.Slot),
                OnPress: () => this.openItemPopup(item)
            };
            buyableItems.push(buyableItem);
        });

        return buyableItems;
    };

    /** @param {Item} item */
    openItemPopup = (item) => {
        user.interface.popup?.Open({
            content: renderItemPopup.call(this, item)
        });
    };
}

BackShopItems.defaultProps = BackShopItemsProps;
BackShopItems.prototype.props = BackShopItemsProps;

export default BackShopItems;

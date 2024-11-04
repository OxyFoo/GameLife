import * as React from 'react';

import { renderItemPopup } from './popup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Character } from 'Interface/Components';

/**
 * @typedef {import('Types/Data/App/Items').Item} Item
 * @typedef {import('Data/App/Items').StuffID} StuffID
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef BuyableItem
 * @property {string | number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {Character} Character Character to display item
 * @property {CharacterContainerSize} Size Item size in pixels for the character
 * @property {() => void} OnPress
 */

const BackShopItemsProps = {
    /** @type {StuffID[]} */
    dailyItemsID: []
};

class BackShopItems extends React.Component {
    state = {
        /** @type {Array<BuyableItem>} */
        buyableItems: []
    };

    constructor(props) {
        super(props);

        const { dailyItemsID } = this.props;
        this.state.buyableItems = this.refreshItems(dailyItemsID);
    }

    /** @param {StuffID[]} dailyItemsID */
    refreshItems = (dailyItemsID) => {
        const allBuyableItems = dataManager.items.GetBuyable();

        if (dailyItemsID === null) return;

        // Create characters & get data for each item
        /** @type {BuyableItem[]} */
        const buyableItems = [];
        dailyItemsID.forEach((itemID, index) => {
            const item = allBuyableItems.find((i) => i.ID == itemID) || null;
            if (item === null) return;

            const characterKey = `shop-character-${itemID.toString()}`;
            const character = new Character(characterKey, user.character.sexe, 'skin_01', 0);
            character.SetEquipment([itemID.toString()]);

            /** @type {BuyableItem} */
            const buyableItem = {
                ID: itemID,
                Name: langManager.GetText(item.Name),
                Price: item.Value,
                Rarity: item.Rarity,
                Colors: themeManager.GetRariryColors(item.Rarity),
                BackgroundColor: themeManager.GetColor('backgroundCard'),
                Character: character,
                Size: dataManager.items.GetContainerSize(item.Slot),
                OnPress: () => this.openItemPopup(item)
            };
            buyableItems.push(buyableItem);
        });

        return buyableItems;
    };

    /** @param {Item} item */
    openItemPopup = (item) => {
        const render = () => renderItemPopup.call(this, item);
        user.interface.popup.Open('custom', render);
    };
}

BackShopItems.defaultProps = BackShopItemsProps;
BackShopItems.prototype.props = BackShopItemsProps;

export default BackShopItems;

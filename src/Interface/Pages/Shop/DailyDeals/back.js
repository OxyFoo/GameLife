import * as React from 'react';

import { renderItemPopup } from './popup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Character } from 'Interface/Components';

/**
 * @typedef {import('Data/Items').Item} Item
 * @typedef {import('Data/Items').CharacterContainerSize} CharacterContainerSize
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

class BackShopItems extends React.Component {
    state = {
        /** @type {Array<BuyableItem>} */
        buyableItems: [],
    }

    componentDidMount() {
        this.refreshItems();
    }

    refreshItems = async () => {
        const allBuyableItems = dataManager.items.GetBuyable();
        const dailyItemsID = await user.server.GetDailyDeals();

        if (dailyItemsID === null) return;

        // Create characters & get data for each item
        const buyableItems = [];
        dailyItemsID.forEach((itemID, index) => {
            const item = allBuyableItems.find(i => i.ID == itemID) || null;
            if (item === null) return;

            const characterKey = `shop-character-${itemID.toString()}`;
            const character = new Character(characterKey, user.character.sexe, 'skin_01', 0);
            character.SetEquipment([ itemID.toString() ]);

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

        this.setState({ buyableItems });
    }

    /** @param {Item} item */
    openItemPopup = (item) => {
        const render = () => renderItemPopup.call(this, item);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopItems;

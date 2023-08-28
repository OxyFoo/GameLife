import * as React from 'react';

import { renderItemPopup } from './popupItem';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Character } from 'Interface/Components';
import { ArrayToDict } from 'Utils/Functions';
import { GetRandomIndexesByDay } from 'Utils/Items';

const SHOP_NUMBER_ITEMS = 8;

/**
 * @typedef {import('Data/Items').Item} Item
 * @typedef {import('Data/Items').CharacterContainerSize} CharacterContainerSize
 * 
 * @typedef BuyableItem
 * @property {string|number} ID
 * @property {string} Name
 * @property {number} Price
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

    refreshItems = () => {
        // Get random buyable items
        const allBuyableItems = dataManager.items.GetBuyable();
        const rarities = [ .75, .18, .6, .1 ];
        const itemsProbas = ArrayToDict(allBuyableItems.map(i => ({ [i.ID]: rarities[i.Rarity] })));
        const buyableItemsID = GetRandomIndexesByDay(itemsProbas, SHOP_NUMBER_ITEMS);

        // Create characters & get data for each item
        const buyableItems = [];
        buyableItemsID.forEach((itemID, index) => {
            const item = allBuyableItems.find(i => i.ID == itemID) || null;
            if (item === null) return;

            const characterKey = `shop-character-${itemID.toString()}`;
            const character = new Character(characterKey, user.character.sexe, 'skin_01', 0);
            character.SetEquipment([ itemID.toString() ]);

            /** @type {BuyableItem} */
            const buyableItem = {
                ID: itemID,
                Name: dataManager.GetText(item.Name),
                Price: item.Value,
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
        const callback = this.refreshItems.bind(this);
        const render = () => renderItemPopup.bind(this)(item, callback);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopItems;
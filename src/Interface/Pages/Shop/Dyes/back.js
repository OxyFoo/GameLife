import * as React from 'react';

import { renderDyePopup } from './popup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Character } from 'Interface/Components';
import { ArrayToDict, Round } from 'Utils/Functions';
import { GetRandomIndexesByDay, GetRandomIntByDay } from 'Utils/Items';

const SHOP_NUMBER_DYE = 2;

/**
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef BuyableDye
 * @property {Object} ItemBefore
 * @property {string} ItemBefore.ID
 * @property {number} ItemBefore.InventoryID
 * @property {Character} ItemBefore.Character
 * @property {CharacterContainerSize} ItemBefore.Size
 * @property {Object} ItemAfter
 * @property {string} ItemAfter.ID
 * @property {Character} ItemAfter.Character
 * @property {CharacterContainerSize} ItemAfter.Size
 * @property {string} Name
 * @property {number} Price
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {() => void} OnPress
 */

class BackShopDyes extends React.Component {
    state = {
        /** @type {Array<BuyableDye>} */
        buyableDyes: []
    }

    componentDidMount() {
        this.refreshDye();
    }

    refreshDye = () => {
        // Get random buyable items
        const rarities = [ .75, .18, .6, .1 ];
        const allBuyableDyes = dataManager.items.GetBuyable();

        const ownItems = user.inventory.stuffs.map(item => ({
            StuffID: item.ID,
            ...dataManager.items.GetByID(item.ItemID)
        }));
        const altItems = ownItems.filter(i => dataManager.items.GetDyables(i.ID, allBuyableDyes).length > 0);
        const altItemsProbas = ArrayToDict(altItems.map(i => ({ [i.ID]: rarities[i.Rarity] })));
        const buyableItemsID = GetRandomIndexesByDay(altItemsProbas, SHOP_NUMBER_DYE);

        // Create characters & get data for each item
        const buyableDyes = [];
        buyableItemsID.forEach((itemID, index) => {
            const itemBefore = allBuyableDyes.find(i => i.ID == itemID) || null;
            if (itemBefore === null) return;
            const inventoryID = user.inventory.stuffs.find(i => i.ItemID == itemBefore.ID).ID;

            const itemsAlternative = dataManager.items.GetDyables(itemBefore.ID, allBuyableDyes);
            const itemAfter = itemsAlternative[GetRandomIntByDay(0, itemsAlternative.length - 1)] || null;
            if (itemAfter === null) return;

            const characterBeforeKey = `shop-dye-character-before-${itemAfter.ID}`;
            const characterAfterKey = `shop-dye-character-after-${itemBefore.ID}`;
            const characterBefore = new Character(characterBeforeKey, user.character.sexe, 'skin_01', 0);
            const characterAfter = new Character(characterAfterKey, user.character.sexe, 'skin_01', 0);
            characterBefore.SetEquipment([ itemBefore.ID ]);
            characterAfter.SetEquipment([ itemAfter.ID ]);

            /** @type {BuyableDye} */
            const buyableDye = {
                ItemBefore: {
                    ID: itemBefore.ID,
                    InventoryID: inventoryID,
                    Character: characterBefore,
                    Size: dataManager.items.GetContainerSize(itemBefore.Slot)
                },
                ItemAfter: {
                    ID: itemAfter.ID,
                    Character: characterAfter,
                    Size: dataManager.items.GetContainerSize(itemAfter.Slot)
                },
                Name: langManager.GetText(itemAfter.Name),
                Price: Round(itemAfter.Value * 3/4),
                Colors: themeManager.GetRariryColors(itemAfter.Rarity),
                BackgroundColor: themeManager.GetColor('backgroundCard'),
                OnPress: () => this.openDyePopup(buyableDye)
            };
            buyableDyes.push(buyableDye);
        });

        this.setState({ buyableDyes: buyableDyes });
    }

    /** @param {BuyableDye} dye */
    openDyePopup = (dye) => {
        const callback = this.refreshDye.bind(this);
        const render = () => renderDyePopup.bind(this)(dye, callback);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopDyes;

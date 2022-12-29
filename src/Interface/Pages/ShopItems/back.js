import * as React from 'react';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';
import langManager from '../../../Managers/LangManager';

import { Character } from '../../Components';
import { GetRandomIndexesByDay } from '../../../Utils/Items';
import { renderTitlePopup, renderItemPopup, renderItemEditorPopup } from './itemPopup';

/**
 * @typedef {import('../../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../../Class/Admob').AdTypes['add30Ox']} AdEvent
 */

const SHOP_NUMBER_TITLES = 3;
const SHOP_NUMBER_ITEMS = 8;

class BackShopItems extends React.Component {
    state = {
        titlesAvailable: null,
        itemsAvailable: null,
        itemsCharacters: null,
    
        buying: false
    }

    constructor(props) {
        super(props);

        const titles = dataManager.titles.GetBuyable();
        let titlesIndexes = {};
        titles.forEach(t => titlesIndexes[t.ID] = 1);
        this.state.titlesAvailable = GetRandomIndexesByDay(titlesIndexes, SHOP_NUMBER_TITLES);

        const items = dataManager.items.GetBuyable();
        const rarities = [ .75, .18, .6, .1 ];

        let itemsIndexes = {};
        items.forEach(i => itemsIndexes[i.ID] = rarities[i.Rarity] );
        this.state.itemsAvailable = GetRandomIndexesByDay(itemsIndexes, SHOP_NUMBER_ITEMS);

        this.state.itemsCharacters = [];
        this.state.itemsAvailable.forEach(itemID => {
            const character = new Character('shop-character-' + itemID, 'MALE', 'skin_01', 0);
            character.SetEquipment([ itemID ]);
            this.state.itemsCharacters[itemID] = character;
        });
    }

    openTitlePopup = (title) => {
        // Check if title already owned
        if (user.inventory.titles.includes(title.ID)) {
            const lang = langManager.curr['shopItems'];
            const title = lang['alert-owned-title'];
            const text = lang['alert-owned-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        const render = () => renderTitlePopup.bind(this)(title);
        user.interface.popup.Open('custom', render);
    }
    openItemPopup = (item) => {
        const render = () => renderItemPopup.bind(this)(item);
        user.interface.popup.Open('custom', render);
    }
    openItemEditorPopup = () => user.interface.popup.Open('custom', renderItemEditorPopup.bind(this));
}

export default BackShopItems;
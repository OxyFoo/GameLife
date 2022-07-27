import * as React from 'react';

import user from '../../../Managers/UserManager';
import dataManager from '../../../Managers/DataManager';

import { GetRandomIndexesByDay } from '../../../Utils/Items';
import { renderTitlePopup, renderItemPopup, renderItemEditorPopup } from './itemPopup';

/**
 * @typedef {import('../../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../../Class/Admob').AdTypes['add10Ox']} AdEvent
 */

const SHOP_NUMBER_TITLES = 3;
const SHOP_NUMBER_ITEMS = 8;

class BackShopItems extends React.Component {
    state = {
        titlesAvailable: null,
        itemsAvailable: null
    }

    constructor(props) {
        super(props);

        const titles = dataManager.titles.Get();
        const titlesIndexes = titles.map(t => t.ID);
        this.state.titlesAvailable = GetRandomIndexesByDay(user.informations.username.Get(), titlesIndexes, SHOP_NUMBER_TITLES);

        const items = dataManager.items.Get();
        const rarities = [ .75, .18, .6, .1 ];

        let itemsIndexes = {};
        items.filter(i => i.Rarity <= 3).map(i => itemsIndexes[i.ID] = rarities[i.Rarity] );
        this.state.itemsAvailable = GetRandomIndexesByDay(user.informations.username.Get(), itemsIndexes, SHOP_NUMBER_ITEMS);
    }

    componentDidMount() {
    }
    componentWillUnmount() {
    }

    openTitlePopup = () => user.interface.popup.Open('custom', renderTitlePopup.bind(this));
    openItemPopup = () => user.interface.popup.Open('custom', renderItemPopup.bind(this));
    openItemEditorPopup = () => user.interface.popup.Open('custom', renderItemEditorPopup.bind(this));
}

export default BackShopItems;
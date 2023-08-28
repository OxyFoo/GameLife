import * as React from 'react';

import { renderTitlePopup } from './popupTitle';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { ArrayToDict } from 'Utils/Functions';
import { GetRandomIndexesByDay } from 'Utils/Items';

const SHOP_NUMBER_TITLES = 3;

/**
 * @typedef {import('Data/Titles').Title} Title
 * 
 * @typedef BuyableTitle
 * @property {number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {() => void} OnPress
 */

class BackShopTitles extends React.Component {
    state = {
        /** @type {Array<BuyableTitle>} */
        buyableTitles: [],
    }

    componentDidMount() {
        this.refreshTitles();
    }

    refreshTitles = () => {
        // Get random buyable titles
        const allBuyableTitles = dataManager.titles.GetBuyable();
        const titlesProbas = ArrayToDict(allBuyableTitles.map(t => ({ [t.ID]: 1 })));
        const buyableTitlesID = GetRandomIndexesByDay(titlesProbas, SHOP_NUMBER_TITLES);

        // Create get data for each title
        const buyableTitles = [];
        buyableTitlesID.forEach(titleID => {
            const title = allBuyableTitles.find(t => t.ID == titleID) || null;
            if (title === null) return;

            /** @type {BuyableTitle} */
            const buyableTitle = {
                ID: typeof(titleID) === 'string' ? parseInt(titleID) : titleID,
                Name: dataManager.GetText(title.Name),
                Price: title.Value,
                OnPress: () => this.openTitlePopup(title)
            };
            buyableTitles.push(buyableTitle);
        });

        this.setState({ buyableTitles });
    }

    /** @param {Title} title */
    openTitlePopup = (title) => {
        // Check if title already owned
        if (user.inventory.titles.includes(title.ID)) {
            const lang = langManager.curr['shopItems'];
            const title = lang['alert-owned-title'];
            const text = lang['alert-owned-text'];
            user.interface.popup.ForceOpen('ok', [ title, text ]);
            return;
        }

        const callback = this.refreshTitles.bind(this);
        const render = () => renderTitlePopup.bind(this)(title, callback);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopTitles;
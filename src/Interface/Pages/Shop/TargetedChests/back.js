import * as React from 'react';

import { renderBuyPopup } from './popup';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Class/Shop').BuyableRandomChest} BuyableRandomChest
 */

class BackShopItems extends React.Component {
    /** @type {BuyableRandomChest[]} */
    CHESTS = [
        {
            ID: 1,
            LangName: 'chest-random-common',
            Image: require('Ressources/items/chests/common.png'),
            Price: 50,
            Rarity: 0,
            Colors: themeManager.GetRariryColors(0),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(1)
        },
        {
            ID: 2,
            LangName: 'chest-random-rare',
            Image: require('Ressources/items/chests/rare.png'),
            Price: 200,
            Rarity: 1,
            Colors: themeManager.GetRariryColors(1),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(2)
        },
        {
            ID: 3,
            LangName: 'chest-random-epic',
            Image: require('Ressources/items/chests/epic.png'),
            Price: 500,
            Rarity: 2,
            Colors: themeManager.GetRariryColors(2),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(3)
        }
    ];

    /** @param {number} chestID */
    openItemPopup = (chestID) => {
        const chest = this.CHESTS.find(chest => chest.ID === chestID);
        const render = () => renderBuyPopup.call(this, chest);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopItems;
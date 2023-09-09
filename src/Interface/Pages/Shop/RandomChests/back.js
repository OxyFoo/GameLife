import * as React from 'react';

import { renderBuyPopup } from './popup';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 * 
 * @typedef BuyableChest
 * @property {string|number} ID
 * @property {string} Name
 * @property {ImageSourcePropType} Image
 * @property {number} Price
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {() => void} OnPress
 */


class BackShopItems extends React.Component {
    /** @type {BuyableChest[]} */
    CHESTS = [
        {
            ID: 1,
            Name: 'Coffre perdu',
            Image: require('Ressources/items/chests/common.png'),
            Price: 100,
            Rarity: 0,
            Colors: themeManager.GetRariryColors(0),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => {}
        },
        {
            ID: 2,
            Name: 'Coffre ancien',
            Image: require('Ressources/items/chests/rare.png'),
            Price: 200,
            Rarity: 1,
            Colors: themeManager.GetRariryColors(1),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => {}
        },
        {
            ID: 3,
            Name: 'Coffre secret',
            Image: require('Ressources/items/chests/epic.png'),
            Price: 500,
            Rarity: 2,
            Colors: themeManager.GetRariryColors(2),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => {}
        }
    ];

    /** @param {BuyableChest} item */
    openItemPopup = (item) => {
        const render = () => renderBuyPopup.call(this, item);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopItems;
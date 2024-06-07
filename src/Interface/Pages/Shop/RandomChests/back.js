import * as React from 'react';

import { renderBuyPopup } from './popup';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Class/Shop').Chest} Chest
 * @typedef {import('Class/Shop').BuyableRandomChest} BuyableRandomChest
 */

const BackShopItemsProps = {
    /** @type {{ common: Chest, rare: Chest, epic: Chest }} */
    randomChestsStats: null
};

class BackShopItems extends React.Component {
    refChest1 = null;
    refChest2 = null;
    refChest3 = null;

    /** @type {BuyableRandomChest[]} */
    CHESTS = [
        {
            ref: 'refChest1',
            ID: 1,
            LangName: 'chest-random-common',
            // @ts-ignore
            Image: require('Ressources/items/chests/common.png'),
            PriceOriginal: this.props.randomChestsStats.common.priceOriginal,
            PriceDiscount: this.props.randomChestsStats.common.priceDiscount,
            Rarity: 0,
            Colors: themeManager.GetRariryColors(0),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(1)
        },
        {
            ref: 'refChest2',
            ID: 2,
            LangName: 'chest-random-rare',
            // @ts-ignore
            Image: require('Ressources/items/chests/rare.png'),
            PriceOriginal: this.props.randomChestsStats.rare.priceOriginal,
            PriceDiscount: this.props.randomChestsStats.rare.priceDiscount,
            Rarity: 1,
            Colors: themeManager.GetRariryColors(1),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(2)
        },
        {
            ref: 'refChest3',
            ID: 3,
            LangName: 'chest-random-epic',
            // @ts-ignore
            Image: require('Ressources/items/chests/epic.png'),
            PriceOriginal: this.props.randomChestsStats.epic.priceOriginal,
            PriceDiscount: this.props.randomChestsStats.epic.priceDiscount,
            Rarity: 2,
            Colors: themeManager.GetRariryColors(2),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(3)
        }
    ];

    /** @param {number} chestID */
    openItemPopup = (chestID) => {
        const chest = this.CHESTS.find(chest => chest.ID === chestID);
        const render = () => renderBuyPopup.call(this, chest, user.interface.popup.Close);
        user.interface.popup.Open('custom', render);
    }
}

BackShopItems.defaultProps = BackShopItemsProps;
BackShopItems.prototype.props = BackShopItemsProps;

export default BackShopItems;

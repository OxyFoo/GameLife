import * as React from 'react';

import { BuyPopup } from './popup';
import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Class/Shop').Chest} Chest
 * @typedef {import('Class/Shop').BuyableRandomChest} BuyableRandomChest
 */

const BackShopItemsProps = {
    /** @type {{ common: Chest, rare: Chest, epic: Chest }} */
    randomChestsStats: {
        common: { priceOriginal: 0, priceDiscount: 0, probas: { common: 0, rare: 0, epic: 0, legendary: 0 } },
        rare: { priceOriginal: 0, priceDiscount: 0, probas: { common: 0, rare: 0, epic: 0, legendary: 0 } },
        epic: { priceOriginal: 0, priceDiscount: 0, probas: { common: 0, rare: 0, epic: 0, legendary: 0 } }
    }
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
            // @ts-ignore
            Image: require('Ressources/items/chests/common.png'),
            PriceOriginal: this.props.randomChestsStats.common.priceOriginal,
            PriceDiscount: this.props.randomChestsStats.common.priceDiscount,
            Rarity: 'common',
            Colors: themeManager.GetRariryColors('common'),
            OnPress: () => this.openItemPopup(1)
        },
        {
            ref: 'refChest2',
            ID: 2,
            // @ts-ignore
            Image: require('Ressources/items/chests/rare.png'),
            PriceOriginal: this.props.randomChestsStats.rare.priceOriginal,
            PriceDiscount: this.props.randomChestsStats.rare.priceDiscount,
            Rarity: 'rare',
            Colors: themeManager.GetRariryColors('rare'),
            OnPress: () => this.openItemPopup(2)
        },
        {
            ref: 'refChest3',
            ID: 3,
            // @ts-ignore
            Image: require('Ressources/items/chests/epic.png'),
            PriceOriginal: this.props.randomChestsStats.epic.priceOriginal,
            PriceDiscount: this.props.randomChestsStats.epic.priceDiscount,
            Rarity: 'epic',
            Colors: themeManager.GetRariryColors('epic'),
            OnPress: () => this.openItemPopup(3)
        }
    ];

    /** @param {number} chestID */
    openItemPopup = (chestID) => {
        const chest = this.CHESTS.find((c) => c.ID === chestID);
        if (!chest) {
            return;
        }

        user.interface.popup?.Open({
            content: <BuyPopup item={chest} closePopup={user.interface.popup?.Close} />
        });
    };
}

BackShopItems.defaultProps = BackShopItemsProps;
BackShopItems.prototype.props = BackShopItemsProps;

export default BackShopItems;

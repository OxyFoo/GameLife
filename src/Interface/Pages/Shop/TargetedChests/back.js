import * as React from 'react';

import { renderBuyPopup } from './popup';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Class/Shop').Slot} Slot
 * @typedef {import('Class/Shop').Chest} Chest
 * @typedef {import('Class/Shop').Target} Target
 * @typedef {import('Class/Shop').BuyableTargetedChest} BuyableTargetedChest
 */

const BackShopItemsProps = {
    /** @type {{ common: Chest, rare: Chest, epic: Chest }} */
    targetChestsStats: {
        common: { priceOriginal: 0, priceDiscount: 0, probas: { common: 0, rare: 0, epic: 0, legendary: 0 } },
        rare: { priceOriginal: 0, priceDiscount: 0, probas: { common: 0, rare: 0, epic: 0, legendary: 0 } },
        epic: { priceOriginal: 0, priceDiscount: 0, probas: { common: 0, rare: 0, epic: 0, legendary: 0 } }
    }
};

class BackShopItems extends React.Component {
    state = {
        /** @type {Slot} */
        selectedCategory: 'hair'
    };

    /** @type {Target[]} */
    TARGETS = [
        {
            id: 'hair',
            icon: 'slot-hair',
            onPress: () => this.selectSlot('hair')
        },
        {
            id: 'top',
            icon: 'slot-top',
            onPress: () => this.selectSlot('top')
        },
        {
            id: 'bottom',
            icon: 'slot-bottom',
            onPress: () => this.selectSlot('bottom')
        },
        {
            id: 'shoes',
            icon: 'slot-shoes',
            onPress: () => this.selectSlot('shoes')
        }
    ];

    /** @type {BuyableTargetedChest[]} */
    CHESTS = [
        {
            ref: 'refChest1',
            ID: 1,
            Name: langManager.curr['shop']['targetedChests']['targets']['hair'],
            Slot: 'hair',
            // @ts-ignore
            Image: require('Ressources/items/chests/common.png'),
            PriceOriginal: this.props.targetChestsStats.common.priceOriginal,
            PriceDiscount: this.props.targetChestsStats.common.priceDiscount,
            Rarity: 'common',
            Colors: themeManager.GetRariryColors('common'),
            OnPress: () => this.openItemPopup(1)
        },
        {
            ref: 'refChest2',
            ID: 2,
            Name: langManager.curr['shop']['targetedChests']['targets']['hair'],
            Slot: 'hair',
            // @ts-ignore
            Image: require('Ressources/items/chests/rare.png'),
            PriceOriginal: this.props.targetChestsStats.rare.priceOriginal,
            PriceDiscount: this.props.targetChestsStats.rare.priceDiscount,
            Rarity: 'rare',
            Colors: themeManager.GetRariryColors('rare'),
            OnPress: () => this.openItemPopup(2)
        },
        {
            ref: 'refChest3',
            ID: 3,
            Name: langManager.curr['shop']['targetedChests']['targets']['hair'],
            Slot: 'hair',
            // @ts-ignore
            Image: require('Ressources/items/chests/epic.png'),
            PriceOriginal: this.props.targetChestsStats.epic.priceOriginal,
            PriceDiscount: this.props.targetChestsStats.epic.priceDiscount,
            Rarity: 'epic',
            Colors: themeManager.GetRariryColors('epic'),
            OnPress: () => this.openItemPopup(3)
        }
    ];

    /** @param {Slot} slot */
    selectSlot = (slot) => {
        const lang = langManager.curr['shop']['targetedChests'];
        this.CHESTS.forEach((chest) => {
            chest.Name = lang['targets'][slot];
            chest.Slot = slot;
        });
        this.setState({ selectedCategory: slot });
    };

    /** @param {number} chestID */
    openItemPopup = (chestID) => {
        const chest = this.CHESTS.find((c) => c.ID === chestID);
        if (!chest) return;

        user.interface.popup?.Open({
            content: renderBuyPopup.call(this, chest, user.interface.popup?.Close)
        });
    };
}

BackShopItems.defaultProps = BackShopItemsProps;
BackShopItems.prototype.props = BackShopItemsProps;

export default BackShopItems;

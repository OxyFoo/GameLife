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
    targetChestsStats: null
};

class BackShopItems extends React.Component {
    state = {
        /** @type {Slot} */
        selectedCategory: 'hair'
    }

    refTuto1 = null;
    refChest1 = null;
    refChest2 = null;
    refChest3 = null;

    /** @type {Target[]} */
    TARGETS = [
        {
            id: 'hair',
            icon: 'slotHair',
            onPress: () => this.selectSlot('hair')
        },
        {
            id: 'top',
            icon: 'slotTop',
            onPress: () => this.selectSlot('top')
        },
        {
            id: 'bottom',
            icon: 'slotBottom',
            onPress: () => this.selectSlot('bottom')
        },
        {
            id: 'shoes',
            icon: 'slotShoes',
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
            Rarity: 0,
            Colors: themeManager.GetRariryColors(0),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
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
            Rarity: 1,
            Colors: themeManager.GetRariryColors(1),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
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
            Rarity: 2,
            Colors: themeManager.GetRariryColors(2),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(3)
        }
    ];

    /** @param {Slot} slot */
    selectSlot = (slot) => {
        const lang = langManager.curr['shop']['targetedChests'];
        this.CHESTS.forEach(chest => {
            chest.Name = lang['targets'][slot];
            chest.Slot = slot;
        });
        this.setState({ selectedCategory: slot });
    }

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

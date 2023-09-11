import * as React from 'react';

import { renderBuyPopup } from './popup';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('Class/Shop').Slot} Slot
 * @typedef {import('Class/Shop').Target} Target
 * @typedef {import('Class/Shop').BuyableTargetedChest} BuyableTargetedChest
 */

class BackShopItems extends React.Component {
    state = {
        /** @type {'hair'|'top'|'bottom'|'shoes'} */
        selectedCategory: 'hair'
    };

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
            ID: 1,
            Name: langManager.curr['shop']['targetedChests']['targets']['hair'],
            Slot: 'hair',
            Image: require('Ressources/items/chests/common.png'),
            Price: 60,
            Rarity: 0,
            Colors: themeManager.GetRariryColors(0),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(1)
        },
        {
            ID: 2,
            Name: langManager.curr['shop']['targetedChests']['targets']['hair'],
            Slot: 'hair',
            Image: require('Ressources/items/chests/rare.png'),
            Price: 240,
            Rarity: 1,
            Colors: themeManager.GetRariryColors(1),
            BackgroundColor: themeManager.GetColor('backgroundCard'),
            OnPress: () => this.openItemPopup(2)
        },
        {
            ID: 3,
            Name: langManager.curr['shop']['targetedChests']['targets']['hair'],
            Slot: 'hair',
            Image: require('Ressources/items/chests/epic.png'),
            Price: 600,
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
        const render = () => renderBuyPopup.call(this, chest);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopItems;
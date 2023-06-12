import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { ArrayToDict, Random } from 'Utils/Functions';
import { Character, PageBack } from 'Interface/Components';
import { GetRandomIntByDay, GetRandomIndexesByDay } from 'Utils/Items';
import { renderTitlePopup } from './popupTitle';
import { renderItemPopup } from './popupItem';
import { renderDyePopup } from './popupDye';

const SHOP_NUMBER_TITLES = 3;
const SHOP_NUMBER_ITEMS = 8;
const SHOP_NUMBER_DYE = 2;

/**
 * @typedef {import('Class/Admob').AdStates} AdStates
 * @typedef {import('Class/Admob').AdTypes['add30Ox']} AdEvent
 * @typedef {import('Data/Items').CharacterContainerSize} CharacterContainerSize
 * 
 * @typedef BuyableTitle
 * @property {number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {() => void} OnPress
 * 
 * @typedef BuyableItem
 * @property {string|number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {string} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {Character} Character Character to display item
 * @property {CharacterContainerSize} Size Item size in pixels for the character
 * @property {() => void} OnPress
 * 
 * @typedef BuyableDye
 * @property {Object} ItemBefore
 * @property {string} ItemBefore.ID
 * @property {number} ItemBefore.InventoryID
 * @property {Character} ItemBefore.Character
 * @property {CharacterContainerSize} ItemBefore.Size
 * @property {Object} ItemAfter
 * @property {string} ItemAfter.ID
 * @property {Character} ItemAfter.Character
 * @property {CharacterContainerSize} ItemAfter.Size
 * @property {string} Name
 * @property {number} Price
 * @property {string} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {() => void} OnPress
 */

class BackShopItems extends PageBack {
    state = {
        oxAmount: user.informations.ox.Get(),
        buying: false,

        /** @type {Array<BuyableTitle>} */
        buyableTitles: [],

        /** @type {Array<BuyableItem>} */
        buyableItems: [],

        /** @type {Array<BuyableDye>} */
        buyableDye: []
    };

    constructor(props) {
        super(props);

        this.refreshTitles();
        this.refreshItems();
        this.refreshDye();
    }

    componentDidMount() {
        super.componentDidMount();

        const updateOx = () => this.setState({ oxAmount: user.informations.ox.Get() });
        this.oxListener = user.informations.ox.AddListener(updateOx);
    }
    componentWillUnmount() {
        user.informations.ox.RemoveListener(this.oxListener);
    }

    /** @param {BuyableTitle} title */
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
    /** @param {BuyableItem} item */
    openItemPopup = (item) => {
        const callback = this.refreshItems.bind(this);
        const render = () => renderItemPopup.bind(this)(item, callback);
        user.interface.popup.Open('custom', render);
    }
    /** @param {BuyableDye} dye */
    openDyePopup = (dye) => {
        const callback = this.refreshDye.bind(this);
        const render = () => renderDyePopup.bind(this)(dye, callback);
        user.interface.popup.Open('custom', render);
    }

    refreshTitles = () => {
        // Get random buyable titles
        const buyableTitles = dataManager.titles.GetBuyable();
        const titlesProbas = ArrayToDict(buyableTitles.map(t => ({ [t.ID]: 1 })));
        const buyableTitlesID = GetRandomIndexesByDay(titlesProbas, SHOP_NUMBER_TITLES);

        // Create get data for each title
        this.state.buyableTitles = [];
        buyableTitlesID.forEach(titleID => {
            const title = buyableTitles.find(t => t.ID == titleID) || null;
            if (title === null) return;

            this.state.buyableTitles.push({
                ID: parseInt(titleID),
                Name: dataManager.GetText(title.Name),
                Price: title.Value,
                OnPress: () => this.openTitlePopup(title)
            });
        });
    }
    refreshItems = () => {
        // Get random buyable items
        const buyableItems = dataManager.items.GetBuyable();
        const rarities = [ .75, .18, .6, .1 ];
        const itemsProbas = ArrayToDict(buyableItems.map(i => ({ [i.ID]: rarities[i.Rarity] })));
        const buyableItemsID = GetRandomIndexesByDay(itemsProbas, SHOP_NUMBER_ITEMS);

        // Create characters & get data for each item
        this.state.buyableItems = [];
        buyableItemsID.forEach((itemID, index) => {
            const item = buyableItems.find(i => i.ID == itemID) || null;
            if (item === null) return;

            const characterKey = `shop-character-${itemID.toString()}`;
            const character = new Character(characterKey, user.character.sexe, 'skin_01', 0);
            character.SetEquipment([ itemID ]);

            this.state.buyableItems.push({
                ID: itemID,
                Name: dataManager.GetText(item.Name),
                Price: item.Value,
                Colors: themeManager.GetRariryColors(item.Rarity),
                BackgroundColor: themeManager.GetColor('backgroundCard'),
                Character: character,
                Size: dataManager.items.GetContainerSize(item.Slot),
                OnPress: () => this.openItemPopup(item)
            });
        });
    }
    refreshDye = () => {
        // Get random buyable items
        const rarities = [ .75, .18, .6, .1 ];
        const buyableItems = dataManager.items.GetBuyable();

        const ownItems = user.inventory.stuffs.map(item => ({
            StuffID: item.ID,
            ...dataManager.items.GetByID(item.ItemID)
        }));
        const altItems = ownItems.filter(i => dataManager.items.GetDyables(i.ID, buyableItems).length > 0);
        const altItemsProbas = ArrayToDict(altItems.map(i => ({ [i.ID]: rarities[i.Rarity] })));
        const buyableItemsID = GetRandomIndexesByDay(altItemsProbas, SHOP_NUMBER_DYE);

        // Create characters & get data for each item
        this.state.buyableDye = [];
        buyableItemsID.forEach((itemID, index) => {
            const itemBefore = buyableItems.find(i => i.ID == itemID) || null;
            if (itemBefore === null) return;
            const inventoryID = user.inventory.stuffs.find(i => i.ItemID == itemBefore.ID).ID;

            const itemsAlternative = dataManager.items.GetDyables(itemBefore.ID, buyableItems);
            const itemAfter = itemsAlternative[GetRandomIntByDay(0, itemsAlternative.length - 1)] || null;
            if (itemAfter === null) return;

            const characterBeforeKey = `shop-dye-character-before-${itemAfter.ID}`;
            const characterAfterKey = `shop-dye-character-after-${itemBefore.ID}`;
            const characterBefore = new Character(characterBeforeKey, user.character.sexe, 'skin_01', 0);
            const characterAfter = new Character(characterAfterKey, user.character.sexe, 'skin_01', 0);
            characterBefore.SetEquipment([ itemBefore.ID ]);
            characterAfter.SetEquipment([ itemAfter.ID ]);

            /** @type {BuyableDye} */
            const buyableDye = {
                ItemBefore: {
                    ID: itemBefore.ID,
                    InventoryID: inventoryID,
                    Character: characterBefore,
                    Size: dataManager.items.GetContainerSize(itemBefore.Slot)
                },
                ItemAfter: {
                    ID: itemAfter.ID,
                    Character: characterAfter,
                    Size: dataManager.items.GetContainerSize(itemAfter.Slot)
                },
                Name: dataManager.GetText(itemAfter.Name),
                Price: parseInt(itemAfter.Value * 3/4),
                Colors: themeManager.GetRariryColors(itemAfter.Rarity),
                BackgroundColor: themeManager.GetColor('backgroundCard'),
                OnPress: () => this.openDyePopup(buyableDye)
            };
            this.state.buyableDye.push(buyableDye);
        });
    }
}

export default BackShopItems;
import * as React from 'react';
import { Platform } from 'react-native';
import { getProducts } from 'react-native-iap';

import { renderItemPopup } from './popup';
import user from 'Managers/UserManager';

import { Character } from 'Interface/Components';

/**
 * @typedef {import('react-native-iap').Product} Product
 * @typedef {import('Data/Items').Item} Item
 * @typedef {import('Data/Items').CharacterContainerSize} CharacterContainerSize
 * 
 * @typedef BuyableItem
 * @property {string | number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {Character} Character Character to display item
 * @property {CharacterContainerSize} Size Item size in pixels for the character
 * @property {() => void} OnPress
 * 
 * @typedef IAPItem
 * @property {string} ID
 * @property {string} Name
 * @property {string} Price
 * @property {string} Description
 * @property {() => void} OnPress
 */

const skus = Platform.select({
    ios: ['First_Ox_0_99', 'test_0_99_ox'],
    android: ['first_ox_0_99']
});

class BackShopIAP extends React.Component {
    state = {
        /** @type {Array<BuyableItem>} */
        buyableItems: [],

        /** @type {Array<IAPItem>} */
        iapItems: []
    }

    componentDidMount() {
        this.refreshIAP();
    }

    refreshIAP = async () => {
        const allIAP = await getProducts({ skus })
            .catch((error) => {
                console.error('Error fetching products:', error);
                user.interface.console.AddLog('error', 'Error fetching products', error);
                return /** @type {Array<Product>} */ ([]);
            });

        console.log("[IAP] items", allIAP);
        if (allIAP === null) {
            return;
        }

        /** @type {Array<IAPItem>} */
        const iapItems = allIAP.map((product, index) => ({
            ID: product.productId,
            Name: product.title,
            Price: product.localizedPrice,
            Description: product.description,
            OnPress: () => this.openItemPopup(product)
        }));

        this.setState({ iapItems });
    }

    /** @param {Product} product */
    openItemPopup = (product) => {
        const render = () => renderItemPopup.call(this, product);
        user.interface.popup.Open('custom', render);
    }
}

export default BackShopIAP;

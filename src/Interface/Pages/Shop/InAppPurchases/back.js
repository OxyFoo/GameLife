import * as React from 'react';
import { Platform } from 'react-native';
import { requestPurchase, fetchProducts } from 'react-native-iap';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 * @typedef {import('Managers/LangManager').Lang} Lang
 *
 * @typedef BuyableItem
 * @property {string | number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
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

class BackShopIAP extends React.Component {
    state = {
        /** @type {BuyableItem[]} */
        buyableItems: [],

        /** @type {IAPItem[]} */
        iapItems: []
    };

    componentDidMount() {
        // IAP listeners are now managed globally in Shop class
        // Just load products for display
        this.LoadIAP();
    }

    LoadIAP = async () => {
        // Ensure IAP is initialized (should already be from app startup)
        if (!user.shop.IsIAPInitialized()) {
            user.interface.console?.AddLog('warn', '[IAP] IAP not initialized, waiting...');
            await user.shop.InitIAP();
        }

        const allIAP = await fetchProducts({
            skus: user.shop.IAP_IDs,
            type: 'in-app'
        }).catch((error) => {
            user.interface.console?.AddLog('error', '[IAP] Error fetching products', error);
            return [];
        });

        if (allIAP === null || allIAP.length === 0) {
            return;
        }

        /** @param {string} title */
        const getTitle = (title) => {
            if (title.endsWith(' (Game Life)')) {
                return title.slice(0, -12);
            } else if (title.endsWith(' (GameLife)')) {
                return title.slice(0, -11);
            }
            return title;
        };

        const iapItems = allIAP
            .map(
                (product) =>
                    /** @type {IAPItem} */ ({
                        ID: product.id,
                        Name: getTitle(product.title),
                        Price: product.displayPrice,
                        Description: product.description,
                        OnPress: () => this.purchase(product.id)
                    })
            )
            .sort((a, b) => {
                // Sort by server order (IAP_IDs array order)
                const indexA = user.shop.IAP_IDs.indexOf(a.ID);
                const indexB = user.shop.IAP_IDs.indexOf(b.ID);
                return indexA - indexB;
            });

        this.setState({ iapItems });
    };

    /** @param {string} sku Product ID */
    purchase = (sku) => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            return requestPurchase({
                type: 'in-app',
                request: {
                    apple: { sku: sku },
                    google: { skus: [sku] },
                    ios: { sku: sku },
                    android: { skus: [sku] }
                }
            });
        } else {
            const { title, message } = langManager.curr['shop']['popup-purchase']['wrong-platform'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return null;
        }
    };
}

export default BackShopIAP;

import * as React from 'react';
import { Platform } from 'react-native';
import {
    initConnection,
    endConnection,
    requestPurchase,
    fetchProducts,
    finishTransaction,
    purchaseUpdatedListener,
    purchaseErrorListener,
    clearTransactionIOS,
    ErrorCode
} from 'react-native-iap';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';

/**
 * @typedef {import('react-native-iap').Purchase} Purchase
 * @typedef {import('react-native-iap').PurchaseError} PurchaseError
 * @typedef {import('react-native-iap').EventSubscription} EventSubscription
 *
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

    /** @type {EventSubscription | null} */
    purchaseUpdateSubscription = null;

    /** @type {EventSubscription | null} */
    purchaseErrorSubscription = null;

    componentDidMount() {
        initConnection()
            .then((canMakePaymentIOS) => {
                if (Platform.OS === 'ios' && canMakePaymentIOS) {
                    return clearTransactionIOS();
                }
                return true;
            })
            .then(() => {
                this.purchaseUpdateSubscription = purchaseUpdatedListener(this.purchaseDidUpdate);
                this.purchaseErrorSubscription = purchaseErrorListener(this.purchaseDidError);
                return this.LoadIAP();
            })
            .catch((exception) => {
                // Nothing to do here
                user.interface.console?.AddLog(
                    'error',
                    '[IAP] Error flushing failed purchases cached as pending',
                    exception
                );
            });
    }

    componentWillUnmount() {
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }

        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }

        endConnection();
    }

    LoadIAP = async () => {
        const allIAP = await fetchProducts({
            skus: user.shop.IAP_IDs
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
                    android: {
                        skus: [sku]
                    },
                    ios: {
                        sku: sku
                    }
                }
            });
        } else {
            this.handleError('wrong-platform', 'Platform not supported', Platform.OS);
            return null;
        }
    };

    /** @param {Purchase} purchase */
    purchaseDidUpdate = async (purchase) => {
        if (purchase.purchaseState === 'pending') {
            const { title, message } = langManager.curr['shop']['popup-purchase']['purchase-pending'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }

        if (purchase.purchaseState !== 'purchased') {
            user.interface.console?.AddLog('warn', `[IAP] Purchase not completed yet: ${purchase.purchaseState}`);
            return;
        }

        if (!purchase.id) {
            // Handle error
            this.handleError('no-receipt', 'No receipt', purchase);
            return;
        }

        // Handle purchase
        const addedOx = await this.handlePurchase(purchase);
        if (addedOx === false) {
            // Handle error
            this.handleError('purchase-handle-error', 'Error handling purchase', addedOx);
            return;
        }

        // Wait if reward application is not loaded or already on reward page
        while (user.appIsLoaded === false || user.interface.GetCurrentPageName() === 'chestreward') {
            await Sleep(200);
        }

        // Show reward
        user.interface.ChangePage('chestreward', {
            args: {
                chestRarity: 'ox',
                oxCount: addedOx,
                callback: () => {
                    user.interface.BackHandle();
                }
            },
            storeInHistory: false
        });

        // Finish transaction
        finishTransaction({
            purchase,

            // Is consumable (can be purchased again)
            isConsumable: true
        });
    };

    /**
     * @param {Purchase} purchase
     * @returns {Promise<number | false>} Added ox count or false if error
     */
    handlePurchase = async (purchase) => {
        if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
            user.interface.console?.AddLog('error', '[IAP] Unsupported platform', Platform.OS);
            return false;
        }

        // Get purchase token based on platform
        // Android: purchaseToken from Google Play Billing
        // iOS: purchaseToken contains JWS (JSON Web Signature) since StoreKit 2
        // Both platforms use the unified purchaseToken field
        const purchaseToken = purchase.purchaseToken ?? '';

        // Validate required data
        if (!purchase.id || !purchaseToken) {
            user.interface.console?.AddLog('error', '[IAP] Missing transaction data', {
                hasTransactionId: !!purchase.id,
                hasPurchaseToken: !!purchaseToken,
                platform: Platform.OS
            });
            return false;
        }

        // Send purchase to server for validation
        const response = await user.server2.tcp.SendAndWait({
            action: 'buy-iap',
            sku: purchase.productId,
            platform: Platform.OS,
            transactionId: purchase.id,
            purchaseToken: purchaseToken
        });

        // Handle connection errors
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            user.interface.console?.AddLog('error', '[IAP] Server connection error', response);
            return false;
        }

        // Handle server response
        if (response.status !== 'buy-iap') {
            user.interface.console?.AddLog('error', '[IAP] Unexpected server response', response);
            return false;
        }

        // Handle specific error cases
        if (response.result !== 'ok') {
            user.interface.console?.AddLog('error', '[IAP] Server rejected purchase', {
                result: response.result,
                sku: purchase.productId
            });
            return false;
        }

        // Update local state with server values
        if (typeof response.ox === 'number') {
            user.informations.ox.Set(response.ox);
        }

        user.informations.purchasedCount++;
        user.SaveLocal();

        return response.addedOx ?? 0;
    };

    /** @param {PurchaseError} error */
    purchaseDidError = (error) => {
        if (error.code === ErrorCode.UserCancelled) {
            return;
        }

        this.handleError('purchase-error', 'Error purchasing item', error);
    };

    /**
     * Show error in console & open a popup
     * @param {keyof Lang['shop']['popup-purchase']} errorKey
     * @param {string} errorName
     * @param {*} error
     */
    handleError = (errorKey, errorName, error) => {
        user.interface.console?.AddLog('error', `[IAP] ${errorName}:`, error);
        const { title, message } = langManager.curr['shop']['popup-purchase'][errorKey];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: { title, message }
        });
    };
}

export default BackShopIAP;

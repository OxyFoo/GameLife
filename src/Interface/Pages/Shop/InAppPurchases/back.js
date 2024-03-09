import * as React from 'react';
import { Platform } from 'react-native';
import {
    initConnection, endConnection,
    requestPurchase, PurchaseStateAndroid,
    flushFailedPurchasesCachedAsPendingAndroid,
    getProducts, finishTransaction,
    purchaseUpdatedListener, purchaseErrorListener,
    ErrorCode
} from 'react-native-iap';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Sleep } from 'Utils/Functions';
import { Character } from 'Interface/Components';

/**
 * @typedef {import('react-native-iap').Product} Product
 * @typedef {import('react-native-iap').Purchase} Purchase
 * @typedef {import('react-native-iap').PurchaseError} PurchaseError
 * 
 * @typedef {import('Data/Items').Item} Item
 * @typedef {import('Data/Items').CharacterContainerSize} CharacterContainerSize
 * @typedef {import('Managers/LangManager').Lang} Lang
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

class BackShopIAP extends React.Component {
    state = {
        /** @type {Array<BuyableItem>} */
        buyableItems: [],

        /** @type {Array<IAPItem>} */
        iapItems: []
    }

    purchaseUpdateSubscription = null;
    purchaseErrorSubscription = null;

    componentDidMount() {
        initConnection()
            .then((canMakePaymentIOS) => {
                // We make sure that "ghost" pending payment are removed
                // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
                return flushFailedPurchasesCachedAsPendingAndroid();
            })
            .catch((exception) => {
                // Nothing to do here
                user.interface.console.AddLog('error', '[IAP] Error flushing failed purchases cached as pending', exception);
            })
            .then(() => {
                this.purchaseUpdateSubscription = purchaseUpdatedListener(this.purchaseDidUpdate);
                this.purchaseErrorSubscription = purchaseErrorListener(this.purchaseDidError);
                return this.LoadIAP();
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
        const allIAP = await getProducts({
            skus: user.shop.IAP_IDs
        })
            .catch((error) => {
                user.interface.console.AddLog('error', '[IAP] Error fetching products', error);
                return /** @type {Array<Product>} */ ([]);
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

        /** @type {Array<IAPItem>} */
        const iapItems = allIAP.map((product, index) => ({
            ID: product.productId,
            Name: getTitle(product.title),
            Price: product.localizedPrice,
            Description: product.description,
            OnPress: () => this.purchase(product.productId)
        }));

        this.setState({ iapItems });
    }

    /** @param {Purchase} purchase */
    purchaseDidUpdate = async (purchase) => {
        // If purchase is pending, we should just wait
        if (purchase.purchaseStateAndroid === PurchaseStateAndroid.PENDING) {
            const { title, message } = langManager.curr['shop']['popup-purchase']['purchase-pending'];
            user.interface.popup.Open('ok', [ title, message ], undefined, true);
            return;
        }

        if (purchase.purchaseStateAndroid !== PurchaseStateAndroid.PURCHASED) {
            // Handle pending purchase, just wait
            return;
        }

        const receipt = purchase.transactionReceipt;
        if (!receipt) {
            // Handle error
            this.handleError('no-receipt', 'No receipt', receipt);
            return;
        }

        // Handle purchase
        const addedOx = await this.handlePurchase(receipt);
        if (addedOx === false) {
            // Handle error
            this.handleError('purchase-handle-error', 'Error handling purchase', addedOx);
            return;
        }

        // Wait if reward application is not loaded or 
        while (user.appIsLoaded === false || user.interface.GetCurrentPageName() === 'chestreward') {
            await Sleep(200);
        }

        // Show reward
        user.interface.ChangePage('chestreward', {
            chestRarity: 'ox',
            oxCount: addedOx,
            callback: () => {
                user.interface.BackHandle();
            }
        }, true);

        // Finish transaction
        finishTransaction({
            purchase,

            // Is consumable (can be purchased again)
            isConsumable: true
        });
    }

    /** @param {PurchaseError} error */
    purchaseDidError = (error) => {
        if (error.code === ErrorCode.E_USER_CANCELLED) {
            return;
        }

        this.handleError('purchase-error', 'Error purchasing item', error);
    }

    /** @param {string} sku Product ID */
    purchase = (sku) => {
        if (Platform.OS === 'ios') {
            return requestPurchase({
                sku: sku,
                andDangerouslyFinishTransactionAutomaticallyIOS: false
            });
        } else if (Platform.OS === 'android') {
            return requestPurchase({
                skus: [sku]
            });
        } else {
            this.handleError('wrong-platform', 'Platform not supported', Platform.OS);
        }
    }

    /**
     * @param {Purchase['transactionReceipt']} transactionReceipt
     * @returns {Promise<number | false>} Added ox count or false if error
     */
    handlePurchase = async (transactionReceipt) => {
        const result = await user.server.Request('buyOx', { transactionReceipt });
        if (result === null || result?.status !== 'ok') {
            return false;
        }

        user.informations.purchasedCount++;
        user.informations.ox.Set(result.ox);
        return result.addedOx;
    }

    /**
     * Show error in console & open a popup
     * @param {keyof Lang['shop']['popup-purchase']} errorKey
     * @param {string} errorName
     * @param {*} error
     */
    handleError = (errorKey, errorName, error) => {
        user.interface.console.AddLog('error', `[IAP] ${errorName}:`, error);
        const { title, message } = langManager.curr['shop']['popup-purchase'][errorKey];
        user.interface.popup.Open('ok', [ title, message ], undefined, true);
    }
}

export default BackShopIAP;

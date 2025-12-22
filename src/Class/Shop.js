import { Platform } from 'react-native';
import {
    initConnection,
    endConnection,
    finishTransaction,
    purchaseUpdatedListener,
    purchaseErrorListener,
    clearTransactionIOS,
    getAvailablePurchases,
    ErrorCode
} from 'react-native-iap';

import langManager from 'Managers/LangManager';
import { IUserClass } from '@oxyfoo/gamelife-types/Interface/IUserClass';

import { DateFormat } from 'Utils/Date';
import { Sleep } from 'Utils/Functions';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('react-native').ImageSourcePropType} ImageSourcePropType
 * @typedef {import('react-native-iap').Purchase} Purchase
 * @typedef {import('react-native-iap').PurchaseError} PurchaseError
 * @typedef {import('react-native-iap').EventSubscription} EventSubscription
 *
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {'hair' | 'top' | 'bottom' | 'shoes'} Slot
 *
 * @typedef {import('@oxyfoo/gamelife-types').Rarities} Rarities
 * @typedef {import('@oxyfoo/gamelife-types/Class/Shop').SaveObject_Shop} SaveObject_Shop
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_Types').ShopChestStats} ShopChestStats
 *
 * @typedef Chest
 * @property {number} priceOriginal
 * @property {number} priceDiscount
 * @property {Object} probas
 * @property {number} probas.common
 * @property {number} probas.rare
 * @property {number} probas.epic
 * @property {number} probas.legendary
 *
 * @typedef BuyableRandomChest
 * @property {string} ref
 * @property {string | number} ID
 * @property {ImageSourcePropType} Image
 * @property {number} PriceOriginal
 * @property {number} PriceDiscount
 * @property {Exclude<Rarities, 'legendary'>} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {() => void} OnPress
 *
 * @typedef Target
 * @property {string} id
 * @property {IconsName} icon
 * @property {() => void} onPress
 *
 * @typedef BuyableTargetedChest
 * @property {string} ref
 * @property {string | number} ID
 * @property {string} Name
 * @property {Slot} Slot
 * @property {ImageSourcePropType} Image
 * @property {number} PriceOriginal
 * @property {number} PriceDiscount
 * @property {Exclude<Rarities, 'legendary'>} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {() => void} OnPress
 */

/**
 * @typedef {'idle' | 'initializing' | 'ready'} IAPState
 */

/** @extends {IUserClass<SaveObject_Shop>} */
class Shop extends IUserClass {
    /** @type {UserManager} */
    #user;

    /** @param {UserManager} user */
    constructor(user) {
        super('shop');

        this.#user = user;
    }

    buyToday = {
        /** @type {string} Today date */
        day: '',

        /** @type {string[]} List of items ID */
        items: [],

        /** @type {number[]} List of inventory items ID */
        dyes: []
    };

    /** @type {string[]} */
    IAP_IDs = [];

    /** @type {number} Price factor, applied to all Ox prices in shop */
    priceFactor = 1;

    /** @type {IAPState} IAP connection state */
    #iapState = 'idle';

    /** @type {EventSubscription | null} */
    #purchaseUpdateSubscription = null;

    /** @type {EventSubscription | null} */
    #purchaseErrorSubscription = null;

    /** @type {ReturnType<typeof setInterval> | null} */
    #pendingPurchasesInterval = null;

    /** @type {Set<string>} Set of pending purchase IDs already notified to the user */
    #notifiedPendingPurchases = new Set();

    /** @type {Set<string>} Set of transaction IDs currently being processed (race condition protection) */
    #processingTransactions = new Set();

    Clear = () => {
        this.buyToday = {
            day: '',
            items: [],
            dyes: []
        };
    };

    // TODO: Reimplement shop
    /**
     * @param {Object} inventory
     * @param {this['buyToday']} inventory.buyToday
     */
    LoadOnline(inventory) {
        if (typeof inventory !== 'object') return;
        /** @param {string} key */
        const contains = (key) => inventory.hasOwnProperty(key);
        if (contains('buyToday')) {
            const today = DateFormat(new Date(), 'DD/MM/YYYY');
            this.buyToday = inventory['buyToday'];
            this.buyToday.day = today;
            this.#user.SaveLocal();
        }
    }

    /**
     * @param {Partial<SaveObject_Shop>} data
     */
    Load = (data) => {
        if (typeof data.day !== 'undefined') {
            this.buyToday.day = data.day;
        }
        if (typeof data.items !== 'undefined') {
            this.buyToday.items = data.items;
        }
        if (typeof data.dyes !== 'undefined') {
            this.buyToday.dyes = data.dyes;
        }

        // If today is different, reset
        const today = DateFormat(new Date(), 'DD/MM/YYYY');
        if (today !== this.buyToday.day) {
            this.buyToday.day = today;
            this.buyToday.items = [];
            this.buyToday.dyes = [];
            this.#user.SaveLocal();
        }
    };

    /** @returns {SaveObject_Shop} */
    Save = () => {
        return {
            day: this.buyToday.day,
            items: this.buyToday.items,
            dyes: this.buyToday.dyes
        };
    };

    /** @param {string[]} iaps */
    LoadIAPs(iaps) {
        if (Array.isArray(iaps)) {
            this.IAP_IDs = iaps;
        }
    }

    // #region IAP Global Management

    /**
     * Initialize IAP connection and listeners globally
     * Should be called once at app startup (after user is authenticated)
     */
    InitIAP = async () => {
        // Already initialized
        if (this.#iapState === 'ready') {
            return;
        }

        // Already initializing (prevent parallel calls)
        if (this.#iapState === 'initializing') {
            // Wait for initialization to complete
            while (this.#iapState === 'initializing') {
                await Sleep(100);
            }
            return;
        }

        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
            return;
        }

        this.#iapState = 'initializing';

        try {
            const canMakePayment = await initConnection();

            if (Platform.OS === 'ios' && canMakePayment) {
                await clearTransactionIOS();
            }

            this.#purchaseUpdateSubscription = purchaseUpdatedListener(this.#handlePurchaseUpdate);
            this.#purchaseErrorSubscription = purchaseErrorListener(this.#handlePurchaseError);
            this.#iapState = 'ready';

            this.#user.interface.console?.AddLog('info', '[IAP] Global IAP listener initialized');

            // Check for pending purchases that were completed while app was closed
            await this.#processPendingPurchases();

            // Start polling for pending purchases (every 30 seconds)
            // This catches async purchase completions/failures that don't trigger listeners
            this.#startPendingPurchasesPolling();
        } catch (error) {
            this.#iapState = 'idle';
            this.#user.interface.console?.AddLog('error', '[IAP] Failed to initialize IAP connection', error);
        }
    };

    /**
     * Start polling for pending purchases
     * Needed because Google Play doesn't always trigger events for async purchase updates
     */
    #startPendingPurchasesPolling = () => {
        if (this.#pendingPurchasesInterval) {
            return;
        }

        // Poll every 30 seconds
        this.#pendingPurchasesInterval = setInterval(() => {
            this.#processPendingPurchases();
        }, 30 * 1000);
    };

    /**
     * Stop polling for pending purchases
     */
    #stopPendingPurchasesPolling = () => {
        if (this.#pendingPurchasesInterval) {
            clearInterval(this.#pendingPurchasesInterval);
            this.#pendingPurchasesInterval = null;
        }
    };

    /**
     * Process any pending purchases that were completed while app was closed
     * This is necessary because listeners only capture new events, not past ones
     */
    #processPendingPurchases = async () => {
        try {
            const availablePurchases = await getAvailablePurchases();

            if (availablePurchases.length === 0) {
                this.#user.interface.console?.AddLog('info', '[IAP] No pending purchases found');
                return;
            }

            this.#user.interface.console?.AddLog(
                'info',
                `[IAP] Found ${availablePurchases.length} pending purchase(s)`
            );

            for (const purchase of availablePurchases) {
                this.#user.interface.console?.AddLog('info', '[IAP] Processing pending purchase:', purchase.productId);
                await this.#handlePurchaseUpdate(purchase);
            }
        } catch (error) {
            this.#user.interface.console?.AddLog('error', '[IAP] Failed to get available purchases', error);
        }
    };

    /**
     * Cleanup IAP connection and listeners
     * Should be called when user logs out or app closes
     */
    CleanupIAP = () => {
        this.#stopPendingPurchasesPolling();

        if (this.#purchaseUpdateSubscription) {
            this.#purchaseUpdateSubscription.remove();
            this.#purchaseUpdateSubscription = null;
        }

        if (this.#purchaseErrorSubscription) {
            this.#purchaseErrorSubscription.remove();
            this.#purchaseErrorSubscription = null;
        }

        if (this.#iapState === 'ready') {
            endConnection();
            this.#iapState = 'idle';
        }
    };

    /** @returns {boolean} */
    IsIAPInitialized = () => this.#iapState === 'ready';

    /**
     * Handle purchase update from store
     * @param {Purchase} purchase
     */
    #handlePurchaseUpdate = async (purchase) => {
        const purchaseId = purchase.id || purchase.transactionId || '';

        // Prevent race conditions: if transaction is already being processed, skip
        if (purchaseId && this.#processingTransactions.has(purchaseId)) {
            this.#user.interface.console?.AddLog('info', '[IAP] Transaction already being processed:', purchaseId);
            return;
        }

        // Handle pending state (slow card test, etc.)
        if (purchase.purchaseState === 'pending') {
            // Only notify once per pending purchase
            if (purchaseId && !this.#notifiedPendingPurchases.has(purchaseId)) {
                this.#notifiedPendingPurchases.add(purchaseId);
                const lang = langManager.curr['shop']['popup-purchase'];
                this.#user.interface.popup?.OpenT({
                    type: 'ok',
                    data: { title: lang['purchase-pending'].title, message: lang['purchase-pending'].message }
                });
            }
            return;
        }

        // Purchase is no longer pending, remove from notified set
        if (purchaseId) {
            this.#notifiedPendingPurchases.delete(purchaseId);
        }

        // Handle failed purchases (slow card declined, etc.)
        if (purchase.purchaseState === 'failed') {
            this.#user.interface.console?.AddLog('warn', '[IAP] Purchase failed:', purchase.purchaseState);
            this.#showIAPError('purchase-error');
            // Finalize the failed transaction to clear it from the queue
            finishTransaction({ purchase, isConsumable: true });
            return;
        }

        // Only process completed purchases
        if (purchase.purchaseState !== 'purchased') {
            this.#user.interface.console?.AddLog('warn', '[IAP] Unknown purchase state: ' + purchase.purchaseState);
            return;
        }

        if (!purchase.id) {
            this.#showIAPError('no-receipt');
            return;
        }

        // Mark transaction as being processed
        if (purchaseId) {
            this.#processingTransactions.add(purchaseId);
        }

        try {
            // Get quantity from purchase (default 1)
            const quantity = purchase.quantity ?? 1;

            // Validate with server
            const result = await this.#validatePurchaseWithServer(purchase, quantity);

            // Finish transaction first to prevent re-processing
            finishTransaction({ purchase, isConsumable: true });

            if (result === false) {
                this.#showIAPError('purchase-handle-error');
                return;
            }

            // Skip reward page if already processed (result === 0)
            if (result === 0) {
                return;
            }

            // Wait if app is not loaded or already on reward page
            while (this.#user.appIsLoaded === false || this.#user.interface.GetCurrentPageName() === 'chestreward') {
                await Sleep(200);
            }

            // Show reward with total ox
            this.#user.interface.ChangePage('chestreward', {
                args: {
                    chestRarity: 'ox',
                    oxCount: result,
                    callback: () => {
                        this.#user.interface.BackHandle();
                    }
                },
                storeInHistory: false
            });
        } finally {
            // Always remove from processing set
            if (purchaseId) {
                this.#processingTransactions.delete(purchaseId);
            }
        }
    };

    /**
     * Handle purchase error from store
     * @param {PurchaseError} error
     */
    #handlePurchaseError = (error) => {
        // Ignore user cancelled or already owned errors
        if (error.code === ErrorCode.UserCancelled || error.code === ErrorCode.AlreadyOwned) {
            return;
        }
        this.#user.interface.console?.AddLog('error', '[IAP] Purchase error:', error);
        this.#showIAPError('purchase-error');
    };

    /**
     * Validate purchase with server
     * @param {Purchase} purchase
     * @param {number} quantity
     * @returns {Promise<number | false>} Added ox count or false if error, 0 if already processed
     */
    #validatePurchaseWithServer = async (purchase, quantity) => {
        const purchaseToken = purchase.purchaseToken ?? '';

        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
            this.#user.interface.console?.AddLog(
                'error',
                '[IAP] Unsupported platform for purchase validation',
                Platform.OS
            );
            return false;
        }

        if (!purchase.id || !purchaseToken) {
            this.#user.interface.console?.AddLog('error', '[IAP] Missing transaction data', {
                hasTransactionId: !!purchase.id,
                hasPurchaseToken: !!purchaseToken,
                platform: Platform.OS
            });
            return false;
        }

        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-iap',
            sku: purchase.productId,
            platform: Platform.OS,
            transactionId: purchase.id,
            purchaseToken: purchaseToken,
            quantity: quantity
        });

        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            this.#user.interface.console?.AddLog('error', '[IAP] Server connection error', response);
            return false;
        }

        // Handle already processed transactions (e.g., app restart after crash)
        // @ts-ignore
        if (response.result === 'already-processed') {
            this.#user.interface.console?.AddLog('info', '[IAP] Transaction already processed, finalizing');
            return 0;
        }

        if (response.status !== 'buy-iap' || response.result !== 'ok') {
            this.#user.interface.console?.AddLog('error', '[IAP] Server rejected purchase', response);
            return false;
        }

        if (typeof response.ox === 'number') {
            this.#user.informations.ox.Set(response.ox);
        }

        this.#user.informations.purchasedCount += quantity;
        this.#user.SaveLocal();

        // Server returns total addedOx already multiplied by quantity
        return response.addedOx ?? 0;
    };

    /**
     * Show IAP error popup
     * @param {string} errorKey
     */
    #showIAPError = (errorKey) => {
        const lang = langManager.curr['shop']['popup-purchase'];
        // @ts-ignore
        const errorData = lang[errorKey];
        if (errorData) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: errorData.title, message: errorData.message }
            });
        }
    };

    // #endregion

    /** @param {BuyableRandomChest} chest */
    BuyRandomChest = async (chest) => {
        const lang = langManager.curr['shop'];
        const price = chest.PriceDiscount < 0 ? chest.PriceOriginal : chest.PriceDiscount;

        // Check Ox Amount (local validation)
        if (this.#user.informations.ox.Get() < price) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        // Buy chest using TCP protocol
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-random-chest',
            rarity: chest.Rarity
        });

        // Check for connection errors
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'buy-random-chest'
        ) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Handle response
        if (response.result === 'not-enough-ox') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        if (response.result === 'invalid-rarity') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        if (response.result === 'no-items-available') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-no-items-title'],
                    message: lang['reward-no-items-message']
                }
            });
            return;
        }

        if (response.result !== 'ok' || !response.newItem) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Update Ox amount
        if (response.ox !== undefined) {
            this.#user.informations.ox.Set(response.ox);
        }

        // Update inventory
        this.#user.inventory.stuffs.push(response.newItem);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: response.newItem.ItemID,
                chestRarity: chest.Rarity,
                callback: this.#user.interface.BackHandle
            },
            storeInHistory: false
        });
    };

    /** @param {BuyableTargetedChest} chest */
    BuyTargetedChest = async (chest) => {
        const lang = langManager.curr['shop'];
        const price = chest.PriceDiscount < 0 ? chest.PriceOriginal : chest.PriceDiscount;

        // Check Ox Amount (local validation)
        if (this.#user.informations.ox.Get() < price) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        // Buy chest using TCP protocol
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-targeted-chest',
            rarity: chest.Rarity,
            slot: chest.Slot
        });

        // Check for connection errors
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'buy-targeted-chest'
        ) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Handle response
        if (response.result === 'not-enough-ox') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return;
        }

        if (response.result === 'invalid-rarity' || response.result === 'invalid-slot') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        if (response.result === 'no-items-available') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-no-items-title'],
                    message: lang['reward-no-items-message']
                }
            });
            return;
        }

        if (response.result !== 'ok' || !response.newItem) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return;
        }

        // Update Ox amount
        if (response.ox !== undefined) {
            this.#user.informations.ox.Set(response.ox);
        }

        // Update inventory
        this.#user.inventory.stuffs.push(response.newItem);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        // Show chest opening
        this.#user.interface.ChangePage('chestreward', {
            args: {
                itemID: response.newItem.ItemID,
                chestRarity: chest.Rarity,
                callback: this.#user.interface.BackHandle
            },
            storeInHistory: false
        });
    };

    /**
     * Buy a daily deal item
     * @param {string} itemID - The item ID to buy
     * @param {number} price - The item price (already with price factor applied)
     * @returns {Promise<'purchased' | 'already-purchased' | 'error'>} - True if purchase was successful
     */
    BuyDailyDeal = async (itemID, price) => {
        const lang = langManager.curr['shop'];

        // Check Ox Amount (local validation)
        if (this.#user.informations.ox.Get() < price) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return 'error';
        }

        // Buy item using TCP protocol
        const response = await this.#user.server2.tcp.SendAndWait({
            action: 'buy-daily-deal',
            itemID: itemID
        });

        // Check for connection errors
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'buy-daily-deal'
        ) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return 'error';
        }

        // Handle response
        if (response.result === 'not-enough-ox') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['popup-notenoughox-title'],
                    message: lang['popup-notenoughox-message']
                }
            });
            return 'error';
        }

        if (response.result === 'already-purchased') {
            // Item was already purchased today on server, but local data was reset
            // Update local state silently and notify UI to disable button
            if (!this.buyToday.items.includes(itemID)) {
                this.buyToday.items.push(itemID);
                await this.#user.SaveLocal();
            }
            return 'already-purchased';
        }

        if (response.result === 'invalid-item' || response.result === 'item-not-available') {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return 'error';
        }

        if (response.result !== 'ok' || !response.newItem) {
            this.#user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['reward-failed-title'],
                    message: lang['reward-failed-message']
                }
            });
            return 'error';
        }

        // Update Ox amount
        if (response.ox !== undefined) {
            this.#user.informations.ox.Set(response.ox);
        }

        // Update inventory
        this.#user.inventory.stuffs.push(response.newItem);

        // Mark as purchased today
        this.buyToday.items.push(itemID);

        // Save inventory
        this.#user.SaveLocal();

        // Update mission
        this.#user.missions.SetMissionState('mission3', 'completed');

        return 'purchased';
    };

    /**
     * @description Get shop content (daily deals and chest stats)
     * @returns {Promise<{
     *   dailyDeals: string[],
     *   chestsStats: {
     *     random: { common: Chest, rare: Chest, epic: Chest },
     *     target: { common: Chest, rare: Chest, epic: Chest }
     *   }
     * }>}
     * @throws {Error} If the server response is invalid
     */
    GetShopContent = async () => {
        const response = await this.#user.server2.tcp.SendAndWait({ action: 'get-shop' });

        // Check if response is valid
        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-shop' ||
            response.result !== 'ok'
        ) {
            this.#user.interface.console?.AddLog('error', '[Server] Failed to get shop content from server', response);
            throw new Error(`Failed to get shop content from server: ${response}`);
        }

        return {
            dailyDeals: response.dailyDeals ?? [],
            chestsStats: {
                random: {
                    common: this.#convertChestStats(response.chestsStats?.random?.common),
                    rare: this.#convertChestStats(response.chestsStats?.random?.rare),
                    epic: this.#convertChestStats(response.chestsStats?.random?.epic)
                },
                target: {
                    common: this.#convertChestStats(response.chestsStats?.target?.common),
                    rare: this.#convertChestStats(response.chestsStats?.target?.rare),
                    epic: this.#convertChestStats(response.chestsStats?.target?.epic)
                }
            }
        };
    };

    /**
     * @param {ShopChestStats | undefined} stats
     * @returns {Chest}
     */
    #convertChestStats = (stats) => {
        if (!stats) {
            return {
                priceOriginal: 0,
                priceDiscount: 0,
                probas: { common: 0, rare: 0, epic: 0, legendary: 0 }
            };
        }
        return {
            priceOriginal: stats.priceOriginal,
            priceDiscount: stats.priceDiscount,
            probas: stats.probas
        };
    };
}

export default Shop;

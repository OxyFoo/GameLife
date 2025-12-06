import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Class/Shop').Chest} Chest
 * @typedef {import('Data/App/Items').ItemID} ItemID
 *
 * @typedef {import('react-native').ScrollView} ScrollView
 * @typedef {import('./UI/header').default} ShopHeader
 * @typedef {import('./DailyDeals').default} ShopDailyDeals
 * @typedef {import('./InAppPurchases').default} InAppPurchases
 * @typedef {import('./RandomChests').default} ShopRandomChests
 * @typedef {import('./TargetedChests').default} ShopTargetedChests
 */

class BackShop extends PageBase {
    static feKeepMounted = true;
    static feShowNavBar = true;
    static feShowUserHeader = true;

    state = {
        loaded: false,

        /** @type {ItemID[]} */
        dailyItemsID: [],

        /** @type {{ common: Chest, rare: Chest, epic: Chest } | null} */
        randomChestsStats: null,

        /** @type {{ common: Chest, rare: Chest, epic: Chest } | null} */
        targetChestsStats: null
    };

    /** @type {React.RefObject<ScrollView | null>} */
    refPage = React.createRef();

    /** @type {React.RefObject<ShopHeader | null>} */
    refHeader = React.createRef();

    /** @type {React.RefObject<ShopDailyDeals | null>} */
    refDailyDeals = React.createRef();

    /** @type {React.RefObject<InAppPurchases | null>} */
    refIAP = React.createRef();

    /** @type {React.RefObject<ShopRandomChests | null>} */
    refRandomChests = React.createRef();

    /** @type {React.RefObject<ShopTargetedChests | null>} */
    refTargetedChests = React.createRef();

    componentDidMount() {
        user.shop
            .GetShopContent()
            .then((shopInfo) => {
                this.setState({
                    loaded: true,
                    dailyItemsID: shopInfo.dailyDeals,
                    randomChestsStats: {
                        common: shopInfo.chestsStats.random.common,
                        rare: shopInfo.chestsStats.random.rare,
                        epic: shopInfo.chestsStats.random.epic
                    },
                    targetChestsStats: {
                        common: shopInfo.chestsStats.target.common,
                        rare: shopInfo.chestsStats.target.rare,
                        epic: shopInfo.chestsStats.target.epic
                    }
                });
            })
            .catch((error) => {
                user.interface.console?.AddLog('error', '[Shop] Failed to load shop content', error);
            });
    }
}

export default BackShop;

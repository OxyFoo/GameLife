import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import StartTutorial from './tuto';
import StartMission from './mission';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Class/Shop').Chest} Chest
 * @typedef {import('Data/App/Items').StuffID} StuffID
 *
 * @typedef {import('./UI/header').default} ShopHeader
 * @typedef {import('./DailyDeals').default} ShopDailyDeals
 * @typedef {import('./InAppPurchases').default} InAppPurchases
 * @typedef {import('./RandomChests').default} ShopRandomChests
 * @typedef {import('./TargetedChests').default} ShopTargetedChests
 * @typedef {import('./Dyes').default} ShopDyes
 */

class BackShop extends PageBase {
    static feShowNavBar = true;
    static feShowUserHeader = true;

    state = {
        refPage: null,

        loaded: false,

        /** @type {StuffID[]} */
        dailyItemsID: [],

        /** @type {{ common: Chest, rare: Chest, epic: Chest } | null} */
        randomChestsStats: null,

        /** @type {{ common: Chest, rare: Chest, epic: Chest } | null} */
        targetChestsStats: null
    };

    /** @type {React.RefObject<ShopHeader>} */
    refHeader = React.createRef();

    /** @type {React.RefObject<ShopDailyDeals>} */
    refDailyDeals = React.createRef();

    /** @type {React.RefObject<InAppPurchases>} */
    refIAP = React.createRef();

    /** @type {React.RefObject<ShopRandomChests>} */
    refRandomChests = React.createRef();

    /** @type {React.RefObject<ShopTargetedChests>} */
    refTargetedChests = React.createRef();

    /** @type {React.RefObject<ShopDyes>} */
    refDyes = React.createRef();

    componentDidMount() {
        this.componentDidFocused(this.props);
        // TODO: Reimplement get-shop
        // Old request: getDailyDeals
        // user.server
        //     .GetShopContent()
        //     .then((shopInfo) => {
        //         this.setState({
        //             loaded: true,
        //             dailyItemsID: shopInfo.dailyDeals,
        //             randomChestsStats: {
        //                 common: shopInfo.chestsStats.random.common,
        //                 rare: shopInfo.chestsStats.random.rare,
        //                 epic: shopInfo.chestsStats.random.epic
        //             },
        //             targetChestsStats: {
        //                 common: shopInfo.chestsStats.target.common,
        //                 rare: shopInfo.chestsStats.target.rare,
        //                 epic: shopInfo.chestsStats.target.epic
        //             }
        //         });
        //     })
        //     .catch((error) => {
        //         user.interface.console?.AddLog('error', '[Shop] Failed to load shop content', error);
        //     });
    }

    /** @param {any} args */
    componentDidFocused = (args) => {
        //StartTutorial.call(this, args?.tuto);
        //StartMission.call(this, args?.missionName);
    };
}

export default BackShop;

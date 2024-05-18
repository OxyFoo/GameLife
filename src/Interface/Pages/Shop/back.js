import React from 'react';

import { PageBase } from 'Interface/Components';
import StartTutorial from './tuto';
import StartMission from './mission';
import user from 'Managers/UserManager';

/**
 * @typedef {import('Interface/Components').Page} Page
 * @typedef {import('Class/Shop').Chest} Chest
 * @typedef {import('Data/Items').StuffID} StuffID
 * 
 * @typedef {import('./UI/header').default} ShopHeader
 * @typedef {import('./DailyDeals').default} ShopDailyDeals
 * @typedef {import('./InAppPurchases').default} InAppPurchases
 * @typedef {import('./RandomChests').default} ShopRandomChests
 * @typedef {import('./TargetedChests').default} ShopTargetedChests
 * @typedef {import('./Dyes').default} ShopDyes
 */

class BackShop extends PageBase {
    state = {
        /** @type {Page | null} */
        refPage: null,

        loaded: false,

        /** @type {StuffID[]} */
        dailyItemsID: [],

        /** @type {{ common: Chest, rare: Chest, epic: Chest } | null} */
        randomChestsStats: null,

        /** @type {{ common: Chest, rare: Chest, epic: Chest } | null} */
        targetChestsStats: null
    }

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
        super.componentDidMount();

        this.componentDidFocused(this.props);
        user.server.GetShopContent().then((shopInfo) => {
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
        });
    }

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
        StartMission.call(this, args?.missionName);
    }

    setRef = (ref) => {
        this.refPage = ref;
        this.setState({ refPage: ref });
    }
}

export default BackShop;

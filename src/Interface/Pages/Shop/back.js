import React from 'react';

import { PageBase } from 'Interface/Global';
import StartTutorial from './tuto';
import StartMission from './mission';

/**
 * @typedef {import('Interface/Global').Page} Page
 * @typedef {import('./UI/header').default} ShopHeader
 * @typedef {import('./DailyDeals').default} ShopDailyDeals
 * @typedef {import('./InAppPurchases').default} InAppPurchases
 * @typedef {import('./RandomChests').default} ShopRandomChests
 * @typedef {import('./TargetedChests').default} ShopTargetedChests
 * @typedef {import('./Dyes').default} ShopDyes
 */

class BackShop extends PageBase {
    /** @type {React.RefObject<Page>} */
    refShopHeader = React.createRef();

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

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
        StartMission.call(this, args?.missionName);
    }
}

export default BackShop;

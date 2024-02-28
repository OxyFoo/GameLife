import React from 'react';

import { PageBase } from 'Interface/Components';
import StartTutorial from './tuto';
import StartMission from './mission';

/**
 * @typedef {import('Interface/Components').Page} Page
 * @typedef {import('./UI/header').default} ShopHeader
 * @typedef {import('./DailyDeals').default} ShopDailyDeals
 * @typedef {import('./RandomChests').default} ShopRandomChests
 * @typedef {import('./TargetedChests').default} ShopTargetedChests
 * @typedef {import('./Dyes').default} ShopDyes
 */

class BackShop extends PageBase {
    state = {
        /** @type {Page | null} */
        refPage: null
    }

    /** @type {React.RefObject<ShopHeader>} */
    refHeader = React.createRef();

    /** @type {React.RefObject<ShopDailyDeals>} */
    refDailyDeals = React.createRef();

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

    setRef = (ref) => {
        this.refPage = ref;
        this.setState({ refPage: ref });
    }
}

export default BackShop;

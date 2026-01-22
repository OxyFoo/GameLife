import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

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

    /** @type {number} */
    iapSectionY = 0;

    /**
     * Scroll to the IAP section
     */
    scrollToIAP = () => {
        this.refPage.current?.scrollTo({ y: this.iapSectionY, animated: true });
    };

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

    /**
     * @param {string} id
     */
    handleHelp = (id) => {
        if (id !== 'randomChests' && id !== 'targetChests') return;

        const { randomChestsStats, targetChestsStats } = this.state;
        const lang = langManager.curr['shop']['tuto'];

        const stats = id === 'randomChests' ? randomChestsStats : targetChestsStats;
        if (!stats) {
            user.interface?.screenTuto?.ShowTutorial([
                { component: null, text: lang['unavailable'], showNextButton: true }
            ]);
            return;
        }

        /** @type {('common' | 'rare' | 'epic')[]} */
        const chestKeys = ['common', 'rare', 'epic'];

        /** @type {import('Interface/Global/ScreenTuto/back').TutoElement[]} */
        const tutoElements = chestKeys
            .map((key) => {
                const p = stats[key]?.probas;
                if (!p) return null;
                /** @type {'chest-common' | 'chest-rare' | 'chest-epic'} */
                const langKey = `chest-${key}`;
                return lang[langKey]
                    .replace('{}', (p.common * 100).toFixed(0))
                    .replace('{}', (p.rare * 100).toFixed(0))
                    .replace('{}', (p.epic * 100).toFixed(0))
                    .replace('{}', (p.legendary * 100).toFixed(0));
            })
            .filter((text) => text !== null)
            .map((text) => ({ component: null, text, showNextButton: true }));

        if (tutoElements.length === 0) {
            user.interface?.screenTuto?.ShowTutorial([
                { component: null, text: lang['unavailable'], showNextButton: true }
            ]);
            return;
        }

        user.interface?.screenTuto?.ShowTutorial(tutoElements);
    };
}

export default BackShop;

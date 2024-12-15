import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from './back';
import ShopHeader from './UI/header';
import Banner from './UI/banner';

import ShopDailyDeals from './DailyDeals';
import ShopRandomChests from './RandomChests';
import ShopTargetedChests from './TargetedChests';
import ShopDyes from './Dyes';
import ShopIAP from './InAppPurchases';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Icon } from 'Interface/Components';

class Shop extends BackShop {
    render() {
        const lang = langManager.curr['shop'];

        return (
            <View style={[styles.page, { alignItems: 'center', justifyContent: 'center' }]}>
                {/* <ShopHeader ref={this.refHeader} style={styles.shopHeader} /> */}
                <Text style={{ fontSize: 24 }}>{lang['temporary-message']}</Text>
            </View>
        );

        /*
        const { dailyItemsID, randomChestsStats, targetChestsStats } = this.state;

        if (user.settings.email.toLowerCase() === 'gamelife-test@oxyfoo.com') {
            return this.renderForTesters();
        } else if (!user.server.IsConnected(false)) {
            return this.renderNoInternet();
        } else if (!this.state.loaded) {
            return this.renderLoading();
        }

        const Help = () => {};

        return (
            <View style={styles.page}>
                <ShopHeader ref={this.refHeader} refPage={this.refShopHeader} style={styles.shopHeader} />

                <Text style={styles.title}>{lang['banner-header']}</Text>

                <Banner id='dailyDeals' onPress={Help} title={lang['banner-daily']} />
                <ShopDailyDeals ref={this.refDailyDeals} dailyItemsID={dailyItemsID} />

                <Banner id='iap' onPress={Help} title={lang['banner-iap']} />
                <ShopIAP ref={this.refIAP} />

                {randomChestsStats !== null && (
                    <>
                        <Banner id='randomChests' onPress={Help} title={lang['banner-random-chest']} />
                        <ShopRandomChests ref={this.refRandomChests} randomChestsStats={randomChestsStats} />
                    </>
                )}

                {targetChestsStats !== null && (
                    <>
                        <Banner id='targetChests' onPress={Help} title={lang['banner-targeted-chest']} />
                        <ShopTargetedChests ref={this.refTargetedChests} targetChestsStats={targetChestsStats} />
                    </>
                )}

                <Banner id='dyes' onPress={Help} title={lang['banner-dye']} />
                <ShopDyes ref={this.refDyes} />
            </View>
        );
        */
    }

    renderLoading = () => {
        return (
            <View style={styles.page}>
                <Text>Loading...</Text>
            </View>
        );
    };

    renderNoInternet = () => {
        const lang = langManager.curr['shop'];
        const title = lang['internet-offline-title'];
        const text = lang['internet-offline-text'];

        return (
            <View style={styles.noInternetContainer}>
                <Icon icon='nowifi' size={100} />
                <Text fontSize={22}>{title}</Text>
                <Text fontSize={16}>{text}</Text>
            </View>
        );
    };

    renderForTesters = () => {
        const lang = langManager.curr['shop'];

        return (
            <View style={styles.page}>
                <ShopHeader ref={this.refHeader} refPage={this.state.refPage} style={styles.shopHeader} />

                <Banner title={lang['banner-iap']} />
                <ShopIAP ref={this.refIAP} />
            </View>
        );
    };
}

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },
    pageFill: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    shopHeader: {
        marginBottom: 12
    },
    title: {
        marginBottom: 12,
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    noInternetContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Shop;

import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import BackShop from './back';
import ShopHeader from './UI/header';
import Banner from './UI/banner';

import ShopDailyDeals from './DailyDeals';
import ShopRandomChests from './RandomChests';
import ShopTargetedChests from './TargetedChests';
import ShopIAP from './InAppPurchases';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Icon } from 'Interface/Components';

class Shop extends BackShop {
    render() {
        const lang = langManager.curr['shop'];
        const { loaded, dailyItemsID, randomChestsStats, targetChestsStats } = this.state;

        const email = user.server2.userAuth.GetEmail();
        if (!!email && email.toLowerCase() === 'gamelife-test@oxyfoo.fr') {
            return this.renderForTesters();
        } else if (!user.server2.IsAuthenticated()) {
            return this.renderNoInternet();
        } else if (!loaded) {
            return this.renderLoading();
        }

        const Help = undefined; //() => {};

        return (
            <View style={styles.container}>
                <ShopHeader ref={this.refHeader} style={styles.shopHeader} onScrollToIAP={this.scrollToIAP} />

                <ScrollView style={styles.page} ref={this.refPage} showsVerticalScrollIndicator={false}>
                    <Banner id='dailyDeals' onPress={Help} title={lang['banner-daily']} showTimer />
                    <ShopDailyDeals ref={this.refDailyDeals} dailyItemsID={dailyItemsID} />

                    <View onLayout={(e) => (this.iapSectionY = e.nativeEvent.layout.y)}>
                        <Banner id='iap' onPress={Help} title={lang['banner-iap']} />
                    </View>
                    <ShopIAP ref={this.refIAP} />

                    {targetChestsStats !== null && (
                        <>
                            <Banner id='targetChests' onPress={Help} title={lang['banner-targeted-chest']} />
                            <ShopTargetedChests ref={this.refTargetedChests} targetChestsStats={targetChestsStats} />
                        </>
                    )}

                    {randomChestsStats !== null && (
                        <>
                            <Banner id='randomChests' onPress={Help} title={lang['banner-random-chest']} />
                            <ShopRandomChests ref={this.refRandomChests} randomChestsStats={randomChestsStats} />
                        </>
                    )}
                </ScrollView>
            </View>
        );
    }

    renderLoading = () => {
        const lang = langManager.curr['shop'];
        return (
            <View style={styles.page}>
                <Text>{lang['loading']}</Text>
            </View>
        );
    };

    renderNoInternet = () => {
        const lang = langManager.curr['shop'];

        return (
            <View style={styles.noInternetContainer}>
                <Icon icon='no-wifi' size={100} />
                <Text fontSize={22}>{lang['internet-offline-title']}</Text>
                <Text fontSize={14} color='secondary' style={styles.noInternetSubtext}>
                    {lang['internet-offline-text']}
                </Text>
            </View>
        );
    };

    /**
     * Render shop for testers, with all IAPs only
     */
    renderForTesters = () => {
        const lang = langManager.curr['shop'];

        return (
            <View style={styles.container}>
                <ShopHeader ref={this.refHeader} style={styles.shopHeader} />

                <ScrollView style={styles.page}>
                    <Banner title={lang['banner-iap']} />
                    <ShopIAP ref={this.refIAP} />
                </ScrollView>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24
    },
    page: {
        flex: 1
    },
    shopHeader: {
        marginBottom: 12
    },
    noInternetContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noInternetSubtext: {
        marginTop: 8
    }
});

export default Shop;

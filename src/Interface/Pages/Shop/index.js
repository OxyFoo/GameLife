import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackShop from './back';
import ShopHeader from './UI/header';
import Banner from './UI/banner';

import ShopDailyDeals from './DailyDeals';
import ShopRandomChests from './RandomChests';
import ShopTargetedChests from './TargetedChests';
import ShopDyes from './Dyes';
import ShopIAP from './InAppPurchases'

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Icon } from 'Interface/Components';
import StartHelp from './help';

class Shop extends BackShop {
    render() {
        const {
            dailyItemsID,
            randomChestsStats,
            targetChestsStats
        } = this.state;

        if (user.settings.email.toLowerCase() === 'gamelife-test@oxyfoo.com') {
            return this.renderForTesters();
        } else if (!user.server.IsConnected(false)) {
            return this.renderNoInternet();
        } else if (!this.state.loaded) {
            return this.renderLoading();
        }

        const lang = langManager.curr['shop'];
        const Help = StartHelp.bind(this);

        return (
            <Page
                ref={this.setRef}
                style={styles.page}
                isHomePage
                canScrollOver
            >
                <ShopHeader
                    ref={this.refHeader}
                    refPage={this.state.refPage}
                    style={styles.shopHeader}
                />

                <Text style={styles.title}>{lang['banner-header']}</Text>
                <Text style={styles.title2} color='secondary'>{lang['banner-header-refonte']}</Text>

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
            </Page>
        );
    }

    renderLoading = () => {
        return (
            <Page
                ref={this.setRef}
                style={styles.pageFill}
                isHomePage
                canScrollOver
            >
                <Text>Loading...</Text>
            </Page>
        );
    }

    renderNoInternet = () => {
        const lang = langManager.curr['shop'];
        const title = lang['internet-offline-title'];
        const text = lang['internet-offline-text'];

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.noInternetContainer}
                isHomePage
                canScrollOver
            >
                <Icon icon='nowifi' size={100} />
                <Text fontSize={22}>{title}</Text>
                <Text fontSize={16}>{text}</Text>
            </Page>
        );
    }

    renderForTesters = () => {
        const lang = langManager.curr['shop'];

        return (
            <Page
                ref={this.setRef}
                style={styles.page}
                isHomePage
                canScrollOver
            >
                <ShopHeader
                    ref={this.refHeader}
                    refPage={this.state.refPage}
                    style={styles.shopHeader}
                />

                <Banner title={lang['banner-iap']} />
                <ShopIAP ref={this.refIAP} />
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 0
    },
    pageFill: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    shopHeader: {
        marginBottom: 12
    },
    title: {
        marginBottom: 6,
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    title2: {
        marginBottom: 24,
        paddingHorizontal: 16,
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    noInternetContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Shop;

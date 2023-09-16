import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackShop from './back';
import ShopHeader from './UI/header';
import Banner from './UI/banner';

import ShopDailyDeals from './DailyDeals';
import ShopRandomChests from './RandomChests';
import ShopTargetedChests from './TargetedChests';
import ShopDyes from './Dyes';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Icon } from 'Interface/Components';
import StartHelp from './help';

class Shop extends BackShop {
    noInternetRender = () => {
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

    render() {
        if (!user.server.online) {
            return this.noInternetRender();
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
                    ref={ref => this.refTuto1 = ref}
                    refPage={this.state.refPage}
                />

                <Banner id='dailyDeals' onPress={Help} title={lang['banner-daily']} />
                <ShopDailyDeals ref={ref => this.refTuto2 = ref} />

                <Banner id='randomChests' onPress={Help} title={lang['banner-random-chest']} />
                <ShopRandomChests ref={ref => this.refTuto3 = ref} />

                <Banner id='targetChests' onPress={Help} title={lang['banner-targeted-chest']} />
                <ShopTargetedChests ref={ref => this.refTuto4 = ref} />

                <Banner id='dyes' onPress={Help} title={lang['banner-dye']} />
                <ShopDyes ref={ref => this.refTuto5 = ref} />

                {/*<ShopTitles ref={ref => this.refTuto2 = ref} />*/}
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 0
    },

    noInternetContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Shop;
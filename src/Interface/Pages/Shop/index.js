import * as React from 'react';
import { StyleSheet } from 'react-native';

import BackShop from './back';
import ShopHeader from './UI/header';
import Banner from './UI/banner';

import ShopItems from './Items';
import ShopRandomChests from './RandomChests';
import ShopTitles from './Titles';
import ShopDyes from './Dyes';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Icon } from 'Interface/Components';

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

        return (
            <Page
                ref={ref => this.refPage = ref}
                style={styles.page}
                isHomePage
                canScrollOver
            >
                <ShopHeader refContainer={this.refTuto1} />

                <Banner>{lang['banner-daily']}</Banner>
                <ShopItems ref={ref => this.refTuto3 = ref} />

                <Banner>{lang['banner-random-chest']}</Banner>
                <ShopRandomChests ref={ref => this.refTuto2 = ref} />

                <Banner>{lang['banner-targeted-chest']}</Banner>
                <ShopRandomChests ref={ref => this.refTuto2 = ref} />

                <Banner>{lang['banner-dye']}</Banner>
                <ShopDyes ref={ref => this.refTuto4 = ref} />

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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Shop;
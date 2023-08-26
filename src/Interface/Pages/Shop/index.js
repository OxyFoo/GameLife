import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from './back';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Page, Text, Icon } from 'Interface/Components';
import ShopHeader from './header';

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
        const lang = langManager.curr['shop'];

        if (!user.server.online) {
            return this.noInternetRender();
        }

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <ShopHeader />


            </Page>
        );
    }
}

const styles = StyleSheet.create({
    noInternetContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Shop;
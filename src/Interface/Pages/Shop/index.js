import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from './back';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { Page, Icon, Text, Button } from '../../Components';

class Shop extends BackShop {
    render() {
        const lang = langManager.curr['shop'];
        const { oxAmount } = this.state;

        return (
            <Page ref={ref => this.refPage = ref} isHomePage canScrollOver>
                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{oxAmount}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>

                <Button.Ad
                    id='shop'
                    color='main2'
                    style={[styles.button, styles.adButton]}
                />

                <Button
                    style={styles.button}
                    color='white'
                    colorText='main1'
                    icon='chevron'
                    iconColor='main1'
                    enabled={user.server.online}
                    onPress={this.openShopItems}
                >{lang['button-shop']}</Button>

                <Button
                    style={styles.button}
                    color='main1'
                    icon='add'
                    enabled={user.server.online}
                    onPress={this.openPopupCode}
                >
                    {lang['button-code']}
                </Button>
            </Page>
        );
    }
}

const styles = StyleSheet.create({
    wallet: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    ox: {
        marginRight: 6
    },

    button: {
        marginTop: 24
    },
    adButton: {
        borderRadius: 14,
        justifyContent: 'space-between'
    }
});

export default Shop;
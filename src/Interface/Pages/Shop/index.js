import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from './back';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { UserHeader } from '../../Widgets';
import { Page, Icon, Text, Button } from '../../Components';

class Shop extends BackShop {
    render() {
        const lang = langManager.curr['shop'];
        const adRemaining = user.informations.adRemaining;

        return (
            <Page canScrollOver={true} bottomOffset={156}>
                <UserHeader />
                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{user.informations.ox}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>

                <Button.Ad
                    style={[styles.button, styles.adButton]}
                    state={adRemaining <= 0 ? 'notAvailable' : this.state.adState}
                    color='main2'
                    onPress={this.watchAd}
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
                >{lang['button-code']}</Button>
            </Page>
        )
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

    button: { marginTop: 24 },
    adButton: { justifyContent: 'space-between', borderRadius: 14 }
});

export default Shop;
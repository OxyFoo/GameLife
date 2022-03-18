import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from '../PageBack/Shop';
import user from '../../Managers/UserManager';

import { UserHeader } from '../Widgets';
import { Page, Icon, Text, Button } from '../Components';

class Shop extends BackShop {
    render() {
        return (
            <Page canScrollOver={true}>
                <UserHeader />
                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{user.informations.ox}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>

                <Button style={styles.adButton} onPress={this.watchAd} color='main2' enabled={this.state.adLoaded && user.informations.adRemaining > 0}>
                    <Text>Regarder une pub</Text>
                    <View style={styles.adIcon}>
                        <Text style={styles.adText}>+10</Text>
                        <Icon icon='ox' color='white' size={24} />
                    </View>
                </Button>
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

    adButton: { justifyContent: 'space-between', borderRadius: 14 },
    adText: { marginRight: 6 },
    adIcon: { flexDirection: 'row' }
});

export default Shop;
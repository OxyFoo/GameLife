import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import BackShop from '../PageBack/shop';

import { Page, Icon, Text } from '../Components';
import { UserHeader } from '../Widgets';

class Shop extends BackShop {
    render() {
        return (
            <Page canScrollOver={true}>
                <UserHeader />
                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{'100'}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>
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
    }
});

export default Shop;
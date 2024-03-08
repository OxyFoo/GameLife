import * as React from 'react';
import { View, Image, FlatList } from 'react-native';

import BackShopIAP from './back';
import styles from './style';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableItem} BuyableItem
 * @typedef {import('./back').IAPItem} IAPItem
 * @typedef {import('react-native').ListRenderItem<IAPItem>} ListRenderItemIAPItem
 */

class ShopIAP extends BackShopIAP {
    /** @type {ListRenderItemIAPItem} */
    renderItem = ({ item }) => {

        const backgroundStyle = { backgroundColor: themeManager.GetColor('backgroundCard') };

        return (
            <View style={styles.itemParent}>
                <Button style={styles.itemButton} onPress={item.OnPress}>
                    <View style={[styles.itemContent, backgroundStyle]}>

                        {/** Item name & rarity */}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.Name}</Text>
                        </View>

                        {/** Item Image */}
                        <View style={styles.itemFrameContainer}>
                            <Image style={styles.itemOxImage} source={IMG_OX} />
                        </View>

                        {/** Item price */}
                        <View style={styles.itemPrice}>
                            <Text style={styles.itemPriceOx}>{item.Price}</Text>
                        </View>

                    </View>
                </Button>
            </View>
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['shop']['dailyDeals'];

        return (
            <Text style={styles.errorText}>
                {lang['error-no-items']}
            </Text>
        );
    }

    render() {
        const { iapItems } = this.state;

        return (
            <FlatList
                style={styles.flatlist}
                data={iapItems}
                ListEmptyComponent={this.renderEmpty}
                numColumns={3}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `buyable-item-${item.ID}-${index}`}
                scrollEnabled={false}
            />
        );
    }
}

export default ShopIAP;

import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './style';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableRandomChest} BuyableItem
 */

class ShopItems extends BackShopItems {
    render() {
        return (
            <FlatList
                style={styles.flatlist}
                data={this.CHESTS}
                numColumns={3}
                renderItem={this.renderItem}
                keyExtractor={(item) => `buyable-random-chest-${item.ID}`}
                scrollEnabled={false}
            />
        );
    }

    /**
     * @param {{ item: BuyableItem }} item
     * @returns {JSX.Element}
     */
    renderItem = ({ item }) => {
        const lang = langManager.curr['shop']['randomChests'];
        const name = lang[item.LangName];

        const disabled = user.shop.buyToday.items.includes(item.ID.toString());
        const rarityText = langManager.curr['rarities'][item.Rarity];
        const rarityStyle = { color: item.Colors[0] };
        const backgroundStyle = { backgroundColor: item.BackgroundColor };

        return (
            <View style={styles.itemParent} ref={(ref) => (this[item.ref] = ref)}>
                <Button style={styles.itemButton} onPress={item.OnPress} enabled={!disabled}>
                    <View style={[styles.itemContent, backgroundStyle]}>
                        {/** Chest name & rarity */}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{name}</Text>
                            <Text style={[styles.itemRarity, rarityStyle]}>{rarityText}</Text>
                        </View>

                        {/** Chest frame */}
                        <Image style={styles.imageChest} source={item.Image} resizeMode='contain' />

                        {/** Chest price */}
                        {this.renderPrice(item)}

                        {/** Decoration */}
                        <LinearGradient
                            style={styles.itemDecoration}
                            colors={item.Colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                    </View>
                </Button>
            </View>
        );
    };

    /** @param {BuyableItem} item */
    renderPrice = (item) => {
        // Default price
        if (item.PriceDiscount < 0) {
            return (
                <View style={styles.itemPrice}>
                    <Text style={styles.itemPriceOx}>{item.PriceOriginal.toString()}</Text>
                    <Image style={styles.itemOxImage} source={IMG_OX} />
                </View>
            );
        }

        // Price factor is applied
        return (
            <View style={styles.itemPrice}>
                <View>
                    <Text style={styles.itemPriceOxEditedOld}>{item.PriceOriginal.toString()}</Text>
                    <Text style={styles.itemPriceOxEditedNew}>{item.PriceDiscount.toString()}</Text>
                </View>
                <Image style={styles.itemOxImageEdited} source={IMG_OX} />
            </View>
        );
    };
}

export default ShopItems;

import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './style';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Button, Text, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableItem} BuyableItem
 */

class ShopDailyDeals extends BackShopItems {
    render() {
        const { buyableItems } = this.state;

        return (
            <FlatList
                style={styles.flatlist}
                data={buyableItems}
                ListEmptyComponent={this.renderEmpty}
                numColumns={3}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `buyable-item-${item.ID}-${index}`}
                scrollEnabled={false}
            />
        );
    }

    /**
     * @param {{ item: BuyableItem }} item
     * @returns {JSX.Element}
     */
    renderItem = ({ item }) => {
        const disabled = user.shop.buyToday.items.includes(item.ID.toString());
        const rarityText = langManager.curr['rarities'][item.Rarity];
        const rarityStyle = { color: item.Colors[0] };
        const backgroundStyle = { backgroundColor: item.BackgroundColor };

        return (
            <View style={styles.itemParent}>
                <Button style={styles.itemButton} onPress={item.OnPress} enabled={!disabled}>
                    <View style={[styles.itemContent, backgroundStyle]}>
                        {/** Item name & rarity */}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.Name}</Text>
                            <Text style={[styles.itemRarity, rarityStyle]}>{rarityText}</Text>
                        </View>

                        {/** Item frame */}
                        <View style={styles.itemFrameContainer}>
                            <Frame
                                style={styles.itemFrame}
                                characters={[item.Character]}
                                onlyItems={true}
                                size={item.Size}
                            />
                        </View>

                        {/** Item price */}
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

    renderEmpty = () => {
        const lang = langManager.curr['shop']['dailyDeals'];

        return <Text style={styles.errorText}>{lang['error-no-items']}</Text>;
    };

    /** @param {BuyableItem} item */
    renderPrice = (item) => {
        // Default price
        if (user.shop.priceFactor === 1) {
            return (
                <View style={styles.itemPrice}>
                    <Text style={styles.itemPriceOx}>{item.Price.toString()}</Text>
                    <Image style={styles.itemOxImage} source={IMG_OX} />
                </View>
            );
        }

        // Price factor is applied
        return (
            <View style={styles.itemPrice}>
                <View>
                    <Text style={styles.itemPriceOxEditedOld}>{item.Price.toString()}</Text>
                    <Text style={styles.itemPriceOxEditedNew}>
                        {Math.round(item.Price * user.shop.priceFactor).toString()}
                    </Text>
                </View>
                <Image style={styles.itemOxImageEdited} source={IMG_OX} />
            </View>
        );
    };
}

export default ShopDailyDeals;

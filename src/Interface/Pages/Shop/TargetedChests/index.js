import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './style';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Button, Text, IconCheckable } from 'Interface/Components';

/**
 * @typedef {import('./back').Target} Target
 * @typedef {import('./back').BuyableTargetedChest} BuyableTargetedChest
 */

class ShopItems extends BackShopItems {
    render() {
        return (
            <>
                <FlatList
                    style={styles.flatlistTargets}
                    contentContainerStyle={styles.flatlistTargetsContent}
                    data={this.TARGETS}
                    renderItem={this.renderCategory}
                    keyExtractor={(item) => `target-category-${item.id}`}
                    scrollEnabled={false}
                />
                <FlatList
                    ref={(ref) => (this.refTuto1 = ref)}
                    style={styles.flatlistChests}
                    data={this.CHESTS}
                    numColumns={3}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => `buyable-random-chest-${item.ID}`}
                    scrollEnabled={false}
                />
            </>
        );
    }

    /**
     * @param {{ item: Target }} param0
     * @returns {JSX.Element}
     */
    renderCategory = ({ item }) => {
        const { id, icon, onPress } = item;
        const checked = this.state.selectedCategory === id;

        return <IconCheckable style={styles.category} icon={icon} size={32} checked={checked} onPress={onPress} />;
    };

    /**
     * @param {{ item: BuyableTargetedChest }} item
     * @returns {JSX.Element}
     */
    renderItem = ({ item }) => {
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
                            <Text style={styles.itemName}>{item.Name}</Text>
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

    /** @param {BuyableTargetedChest} item */
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

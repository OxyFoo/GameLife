import * as React from 'react';
import { View, Image, FlatList } from 'react-native';

import BackShopItems from './back';
import styles from './style';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text, IconCheckable, Icon } from 'Interface/Components';

/**
 * @typedef {import('./back').Target} Target
 * @typedef {import('./back').BuyableTargetedChest} BuyableTargetedChest
 * @typedef {import('react-native').ListRenderItem<Target>} ListRenderItem
 * @typedef {import('react-native').ListRenderItem<BuyableTargetedChest>} ListRenderItemBuyableTargetedChest
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
                    horizontal
                />
                <FlatList
                    style={styles.flatlistChests}
                    columnWrapperStyle={styles.flatlistChestsContent}
                    data={this.CHESTS}
                    numColumns={3}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => `buyable-random-chest-${item.ID}`}
                    scrollEnabled={false}
                />
            </>
        );
    }

    /** @type {ListRenderItem} */
    renderCategory = ({ item }) => {
        const { id, icon, onPress } = item;
        const checked = this.state.selectedCategory === id;

        return <IconCheckable style={styles.category} icon={icon} size={32} checked={checked} onPress={onPress} />;
    };

    /** @type {ListRenderItemBuyableTargetedChest} */
    renderItem = ({ item }) => {
        const disabled = user.shop.buyToday.items.includes(item.ID.toString());
        const rarityText = langManager.curr['rarities'][item.Rarity];
        const rarityStyle = { color: item.Colors[0] };

        return (
            <Button
                style={[styles.itemButton, { borderColor: item.Colors[0] }]}
                gradientColors={['#38406573', '#3840651F']}
                gradientColorsAngle={-45}
                onPress={item.OnPress}
                enabled={!disabled}
            >
                <View style={styles.itemContent}>
                    {/** Chest name & rarity */}
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.Name}</Text>
                        <Text style={[styles.itemRarity, rarityStyle]}>{rarityText}</Text>
                    </View>

                    {/** Chest frame */}
                    <Image style={styles.imageChest} source={item.Image} resizeMode='contain' />

                    {/** Chest price */}
                    {this.renderPrice(item)}
                </View>
            </Button>
        );
    };

    /** @param {BuyableTargetedChest} item */
    renderPrice = (item) => {
        // Default price
        if (item.PriceDiscount < 0) {
            return (
                <View style={styles.itemPrice}>
                    <Text style={styles.itemPriceOx}>{item.PriceOriginal.toString()}</Text>
                    <Icon style={styles.itemOxImage} icon='ox' size={16} />
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
                <Icon style={styles.itemOxImageEdited} icon='ox' size={16} />
            </View>
        );
    };
}

export default ShopItems;

import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './style';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Icon, Text } from 'Interface/Components';
import { AvatarCharacter, AvatarFrame } from '@oxyfoo/avatar-factory';

/**
 * @typedef {import('./back').BuyableItem} BuyableItem
 * @typedef {import('react-native').ListRenderItem<BuyableItem>} ListRenderItemBuyableItem
 */

class ShopDailyDeals extends BackShopItems {
    render() {
        const { buyableItems } = this.state;

        return (
            <FlatList
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                columnWrapperStyle={styles.flatlistColumnWrapper}
                data={buyableItems}
                ListEmptyComponent={this.renderEmpty}
                numColumns={3}
                renderItem={this.renderItem}
                keyExtractor={(item) => `buyable-item-${item.ID}`}
                scrollEnabled={false}
            />
        );
    }

    /** @type {ListRenderItemBuyableItem} */
    renderItem = ({ item }) => {
        const disabled = this.isItemPurchased(item.ID);
        const rarityText = langManager.curr['rarities'][item.Rarity];
        const rarityStyle = { color: item.Colors[0] };
        const avatarRenderScale = item.Size.scale && item.Size.scale >= 3 ? 2 : 1;

        return (
            <Button
                style={styles.itemButton}
                gradientColors={['#38406573', '#3840651F']}
                gradientColorsAngle={-45}
                onPress={item.OnPress}
                enabled={!disabled}
            >
                <View style={styles.itemContent}>
                    {/** Item name & rarity */}
                    <View style={styles.itemInfo}>
                        <Text style={[styles.itemRarity, rarityStyle]}>{rarityText}</Text>
                        <Text style={styles.itemName}>{item.Name}</Text>
                    </View>

                    {/** Item frame */}
                    <AvatarFrame width={72} height={72} renderScale={avatarRenderScale} backgroundColor='#00000000'>
                        <AvatarCharacter
                            body={user.inventory.avatar.skin || 'human_00'}
                            bodyColor={BODY_COLORS[user.inventory.avatar.skinColor] || BODY_COLORS[0]}
                            position={item.Size.pos}
                            scale={item.Size.scale}
                            items={this.getPreviewItems(item)}
                        />
                    </AvatarFrame>

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
                    <Icon size={20} icon='ox' />
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
                <Icon size={20} icon='ox' />
            </View>
        );
    };
}

export default ShopDailyDeals;

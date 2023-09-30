import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './styles';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableRandomChest} BuyableItem
 */

class ShopItems extends BackShopItems {
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
            <View style={styles.itemParent} ref={ref => this[item.ref] = ref}>
                <Button style={styles.itemButton} onPress={item.OnPress} enabled={!disabled}>
                    <View style={[styles.itemContent, backgroundStyle]}>

                        {/** Chest name & rarity */}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{name}</Text>
                            <Text
                                style={[styles.itemRarity, rarityStyle]}
                            >
                                {rarityText}
                            </Text>
                        </View>

                        {/** Chest frame */}
                        <Image
                            style={styles.imageChest}
                            source={item.Image}
                            resizeMode='contain'
                        />

                        {/** Chest price */}
                        <View style={styles.itemPrice}>
                            <Text style={styles.itemPriceOx}>{item.Price.toString()}</Text>
                            <Icon icon='ox' color='main1' size={20} />
                        </View>

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
    }

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
}

export default ShopItems;
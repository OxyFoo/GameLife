import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './styles';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Button, Text, Icon, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableItem} BuyableItem
 */

class ShopDailyDeals extends BackShopItems {
    /**
     * @param {{ item: BuyableItem }} item
     * @returns {JSX.Element}
     */
    renderItem = ({ item }) => {
        const disabled = user.inventory.buyToday.items.includes(item.ID.toString());
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
                            <Text
                                style={[styles.itemRarity, rarityStyle]}
                            >
                                {rarityText}
                            </Text>
                        </View>

                        {/** Item frame */}
                        <View style={styles.itemFrameContainer}>
                            <Frame
                                style={styles.itemFrame}
                                characters={[ item.Character ]}
                                onlyItems={true}
                                size={item.Size}
                            />
                        </View>

                        {/** Item price */}
                        <View style={styles.itemPrice}>
                            <Text style={styles.itemPriceOx}>{item.Price.toString()}</Text>
                            <Icon icon='ox' color='main1' size={20} />
                        </View>

                        {/** Decoration */}
                        <LinearGradient
                            style={styles.itemBorder}
                            colors={item.Colors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />

                    </View>
                </Button>
            </View>
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['shopItems'];

        return (
            <Text style={styles.errorText}>
                {lang['error-no-items']}
            </Text>
        );
    }

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
            />
        );
    }
}

export default ShopDailyDeals;
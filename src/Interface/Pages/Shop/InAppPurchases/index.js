import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopIAP from './back';
import styles from './style';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Button, Text, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableItem} BuyableItem
 */

class ShopIAP extends BackShopIAP {
    /**
     * @param {{ item: ShopItem }} item
     * @returns {JSX.Element}
     */
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
                            <Text style={styles.itemPriceOx}>{item.localizedPrice}</Text>
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
        const { shopItems } = this.state;

        return (
            <FlatList
                style={styles.flatlist}
                data={shopItems}
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

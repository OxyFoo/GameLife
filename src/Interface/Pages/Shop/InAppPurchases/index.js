import * as React from 'react';
import { View, FlatList } from 'react-native';

import BackShopIAP from './back';
import styles from './style';

import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Button, Icon, Text } from 'Interface/Components';

/**
 * @typedef {import('./back').IAPItem} IAPItem
 * @typedef {import('react-native').ListRenderItem<IAPItem>} ListRenderItemIAPItem
 */

class ShopIAP extends BackShopIAP {
    render() {
        const { iapItems } = this.state;

        return (
            <FlatList
                style={styles.flatlist}
                contentContainerStyle={styles.flatlistContent}
                columnWrapperStyle={styles.flatlistColumnWrapper}
                data={iapItems}
                ListEmptyComponent={this.renderEmpty}
                numColumns={3}
                renderItem={this.renderItem}
                keyExtractor={(item) => `buyable-item-${item.ID}`}
                scrollEnabled={false}
            />
        );
    }

    /** @type {ListRenderItemIAPItem} */
    renderItem = ({ item }) => {
        return (
            <View style={styles.itemParent}>
                <Button
                    style={styles.itemButton}
                    onPress={item.OnPress}
                    gradientColors={[themeManager.GetColor('background'), themeManager.GetColor('backgroundCard')]}
                    gradientColorsAngle={0}
                >
                    <View style={styles.itemContent}>
                        {/** Item name & rarity */}
                        <Text style={styles.itemName}>{item.Name}</Text>

                        {/** Item Image */}
                        <Icon style={styles.itemIcon} icon='ox' size={48} />

                        {/** Item price */}
                        <View style={styles.itemPrice}>
                            <Text style={styles.itemPriceOx}>{item.Price}</Text>
                        </View>
                    </View>
                </Button>
            </View>
        );
    };

    renderEmpty = () => {
        const lang = langManager.curr['shop']['dailyDeals'];

        return <Text style={styles.errorText}>{lang['error-no-items']}</Text>;
    };
}

export default ShopIAP;

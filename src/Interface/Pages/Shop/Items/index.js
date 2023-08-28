import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './styles';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Container, Button, Text, Icon, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableItem} BuyableItem
 */

class ShopItems extends BackShopItems {
    /**
     * @param {{ item: BuyableItem }} item
     * @returns {JSX.Element}
     */
    renderItem = ({ item }) => {
        const disabled = user.inventory.buyToday.items.includes(item.ID.toString());
        const backgroundStyle = { backgroundColor: item.BackgroundColor };

        return (
            <View style={styles.itemParent}>
                <Button style={styles.itemButton} onPress={item.OnPress} enabled={!disabled}>
                    <LinearGradient style={styles.itemBorder} colors={item.Colors}>
                        <View style={[styles.itemContent, backgroundStyle]}>

                            <Frame
                                style={styles.itemFrame}
                                characters={[ item.Character ]}
                                onlyItems={true}
                                size={item.Size}
                            />

                            <View style={styles.itemPrice}>
                                <Text style={styles.itemPriceOx}>{item.Price.toString()}</Text>
                                <Icon icon='ox' color='main1' size={20} />
                            </View>

                        </View>
                    </LinearGradient>
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
        const lang = langManager.curr['shopItems'];

        return (
            <Container
                style={styles.container}
                styleHeader={styles.containerHeader}
                styleContainer={styles.itemsContainer}
                text={lang['container-items']}
            >
                <FlatList
                    data={buyableItems}
                    ListEmptyComponent={this.renderEmpty}
                    numColumns={4}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => `buyable-item-${item.ID}-${index}`}
                />
            </Container>
        );
    }
}

export default ShopItems;
import * as React from 'react';
import { View, Image, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopDyes from './back';
import styles from './style';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { IMG_OX } from 'Ressources/items/currencies/currencies';
import { Button, Text, Icon, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableDye} BuyableDye
 */

class ShopDyes extends BackShopDyes {
    /**
     * @param {{ item: BuyableDye }} item
     * @returns {JSX.Element}
     */
    renderDye = ({ item: dyer }) => {
        const { ItemBefore, ItemAfter } = dyer;
        const disabled = user.shop.buyToday.dyes.includes(dyer.ItemBefore.InventoryID);
        const buttonStyle = {
            flexDirection: !disabled ? 'row' : 'row-reverse',
            backgroundColor: dyer.BackgroundColor
        };

        return (
            <Button style={[styles.dyeView, buttonStyle]} onPress={dyer.OnPress} enabled={!disabled}>
                {/** Item before */}
                <Frame
                    style={styles.dyerFrame}
                    characters={[ ItemBefore.Character ]}
                    onlyItems={true}
                    size={ItemBefore.Size}
                />

                {/** Arrow + Ox amount */}
                <View style={styles.dyeAmount}>
                    <Icon icon='arrowLeft' angle={180} color='white' size={48} />
                    <View style={styles.dyeAmountPrice}>
                        <Text style={styles.dyeAmountText}>{dyer.Price.toString()}</Text>
                        <Image style={styles.dyeOxImage} source={IMG_OX} />
                    </View>
                </View>

                {/** Item after */}
                <Frame
                    style={styles.dyerFrame}
                    characters={[ ItemAfter.Character ]}
                    onlyItems={true}
                    size={ItemAfter.Size}
                />

                <LinearGradient style={styles.dyeDecoration} colors={dyer.Colors} />
            </Button>
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['shop']['dyes'];

        return (
            <Text style={styles.errorText}>
                {lang['error-no-dye']}
            </Text>
        );
    }

    render() {
        const { buyableDyes } = this.state;

        return (
            <FlatList
                data={buyableDyes}
                ListEmptyComponent={this.renderEmpty}
                renderItem={this.renderDye}
                keyExtractor={(item, index) => `buyable-dye-${item.ItemBefore.ID}-${index}`}
                scrollEnabled={false}
            />
        );
    }
}

export default ShopDyes;

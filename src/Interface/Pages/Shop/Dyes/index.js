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
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('./back').BuyableDye} BuyableDye
 */

class ShopDyes extends BackShopDyes {
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

    /**
     * @param {{ item: BuyableDye }} item
     * @returns {JSX.Element}
     */
    renderDye = ({ item: dyer }) => {
        const { ItemBefore, ItemAfter } = dyer;
        const disabled = user.shop.buyToday.dyes.includes(dyer.ItemBefore.InventoryID);

        /** @type {StyleProp} */
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
                    {this.renderPrice(dyer)}
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

    /** @param {BuyableDye} dyer */
    renderPrice = (dyer) => {
        // Default price
        if (user.shop.priceFactor === 1) {
            return (
                <View style={styles.dyeAmountPrice}>
                    <Text style={styles.dyeAmountText}>{dyer.Price.toString()}</Text>
                    <Image style={styles.dyeOxImage} source={IMG_OX} />
                </View>
            );
        }

        // Price factor is applied
        return (
            <View style={styles.dyeAmountPriceEdit}>
                <View>
                    <Text style={styles.dyeAmountTextOld}>
                        {dyer.Price.toString()}
                    </Text>
                    <Text style={styles.dyeAmountText}>
                        {Math.round(dyer.Price * user.shop.priceFactor).toString()}
                    </Text>
                </View>
                <Image style={styles.dyeOxImageEdit} source={IMG_OX} />
            </View>
        );
    }
}

export default ShopDyes;

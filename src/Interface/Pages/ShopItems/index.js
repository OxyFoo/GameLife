import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './styles';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { PageHeader } from 'Interface/Widgets';
import { Page, Icon, Text, Button, Container, Frame } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableTitle} BuyableTitle
 * @typedef {import('./back').BuyableItem} BuyableItem
 * @typedef {import('./back').BuyableDye} BuyableDye
 */

class ShopItems extends BackShopItems {
    /**
     * @param {{ item: BuyableTitle }} item
     * @returns {JSX.Element}
     */
    renderTitle = ({ item: title }) => {
        // Disable button if already bought today
        const disabled = user.inventory.buyToday.titles.includes(title.ID);

        // Line through if already owned
        const owned = user.inventory.titles.includes(title.ID);
        const styleLine = { textDecorationLine: owned ? 'line-through' : 'none' };

        return (
            <Button style={styles.titleButton} onPress={title.OnPress} enabled={!disabled}>
                <Text style={styleLine} numberOfLines={1}>{title.Name}</Text>
                <View style={styles.titlePrice}>
                    <Text style={[styles.titlePriceOx, styleLine]}>{title.Price}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>
            </Button>
        );
    }

    /**
     * @param {{ item: BuyableItem }} item
     * @returns {JSX.Element}
     */
    renderItem = ({ item }) => {
        const disabled = user.inventory.buyToday.items.includes(item.ID);
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
                                <Text style={styles.itemPriceOx}>{item.Price}</Text>
                                <Icon icon='ox' color='main1' size={20} />
                            </View>

                        </View>
                    </LinearGradient>
                </Button>
            </View>
        );
    }

    /**
     * @param {{ item: BuyableDye }} item
     * @returns {JSX.Element}
     */
    renderDye = ({ item: dyer }) => {
        const { ItemBefore, ItemAfter } = dyer;
        const disabled = user.inventory.buyToday.dyes.includes(dyer.ItemBefore.InventoryID);
        const backgroundStyle = { backgroundColor: dyer.BackgroundColor };

        return (
            <LinearGradient style={styles.dyeBorder} colors={dyer.Colors}>
                <Button style={[styles.dyeView, backgroundStyle]} onPress={dyer.OnPress} enabled={!disabled}>
                    {/** Item before */}
                    <Frame
                        style={styles.dyerFrame}
                        characters={[ ItemBefore.Character ]}
                        onlyItems={true}
                        size={ItemBefore.Size}
                    />

                    {/** Arrow + Ox amount */}
                    <View style={styles.dyeAmount}>
                        <View style={styles.dyeAmountPrice}>
                            <Text style={styles.dyeAmountText}>{dyer.Price}</Text>
                            <Icon icon='ox' color='main1' size={24} />
                        </View>
                        <Icon icon='arrowLeft' angle={180} color='white' size={48} />
                    </View>

                    {/** Item after */}
                    <Frame
                        style={styles.dyerFrame}
                        characters={[ ItemAfter.Character ]}
                        onlyItems={true}
                        size={ItemAfter.Size}
                    />
                </Button>
            </LinearGradient>
        );
    }

    topOverlay() {
        const { oxAmount } = this.state;

        return (
            <>
                <PageHeader
                    style={styles.overlayHeader}
                    onBackPress={user.interface.BackPage}
                    hideHelp
                />

                <View style={styles.overlayWallet}>
                    <Text style={styles.overlayOx} color='main1'>{oxAmount}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>
            </>
        );
    }

    render() {
        const lang = langManager.curr['shopItems'];
        const { oxAmount, buyableTitles, buyableItems, buyableDye } = this.state;

        const nullTitles = <Text style={styles.errorText}>{lang['error-no-titles']}</Text>;
        const nullItems = <Text style={styles.errorText}>{lang['error-no-items']}</Text>;
        const nullDye = <Text style={styles.errorText}>{lang['error-no-dye']}</Text>;
        const TopOverlay = this.topOverlay.bind(this);

        return (
            <Page
                ref={ref => this.refPage = ref}
                topOverlay={<TopOverlay />}
                canScrollOver
            >
                <PageHeader
                    style={styles.header}
                    onBackPress={user.interface.BackPage}
                    hideHelp
                />

                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{oxAmount}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>

                {/** Buy title */}
                <Container
                    style={styles.container}
                    styleHeader={styles.containerHeader}
                    styleContainer={styles.titlesContainer}
                    text={lang['container-titles']}
                >
                    <FlatList
                        data={buyableTitles}
                        ListEmptyComponent={nullTitles}
                        renderItem={this.renderTitle}
                        keyExtractor={(item, index) => `buyable-title-${item.ID}-${index}}`}
                    />
                </Container>

                {/** Buy item */}
                <Container
                    style={styles.container}
                    styleHeader={styles.containerHeader}
                    styleContainer={styles.itemsContainer}
                    text={lang['container-items']}
                >
                    <FlatList
                        data={buyableItems}
                        ListEmptyComponent={nullItems}
                        numColumns={4}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `buyable-item-${item.ID}-${index}`}
                    />
                </Container>

                {/** Buy item dye */}
                <Container
                    text={lang['container-dyer']}
                    styleHeader={styles.containerHeader}
                    styleContainer={styles.dyerContainer}
                >
                    <FlatList
                        data={buyableDye}
                        ListEmptyComponent={nullDye}
                        renderItem={this.renderDye}
                        keyExtractor={(item, index) => `buyable-dye-${item.ItemBefore.ID}-${index}`}
                    />
                </Container>
            </Page>
        );
    }
}

export default ShopItems;
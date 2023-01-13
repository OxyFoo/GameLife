import * as React from 'react';
import { View, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BackShopItems from './back';
import styles from './styles';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';
import dataManager from '../../../Managers/DataManager';
import themeManager from '../../../Managers/ThemeManager';

import { Rarity } from '../../../Data/Items';
import { PageHeader } from '../../Widgets';
import { Page, Icon, Text, Button, Container, Frame } from '../../Components';

class ShopItems extends BackShopItems {
    renderTitle = ({ item: titleID }) => {
        const title = dataManager.titles.GetByID(titleID);
        if (title === null) return null;

        const titleName = dataManager.GetText(title.Name);
        const onPress = () => this.openTitlePopup(title);
        const disabled = user.inventory.buyToday.titles.includes(title.ID);

        const owned = user.inventory.titles.includes(title.ID);
        const styleLine = owned ? { textDecorationLine: 'line-through' } : undefined;

        return (
            <Button style={styles.titleButton} onPress={onPress} enabled={!disabled}>
                <Text style={styleLine} numberOfLines={1}>{titleName}</Text>
                <View style={styles.titlePrice}>
                    <Text style={[styles.titlePriceOx, styleLine]}>{title.Value}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>
            </Button>
        )
    }

    renderItem = ({ item: itemID }) => {
        const { itemsCharacters } = this.state;

        const item = dataManager.items.GetByID(itemID);
        if (item === null) return null;

        let colors = [];
        const absoluteColors = themeManager.GetAbsoluteColors();
        switch (item.Rarity) {
            case Rarity.common:     colors = absoluteColors.rarity_common;    break;
            case Rarity.rare:       colors = absoluteColors.rarity_rare;      break;
            case Rarity.epic:       colors = absoluteColors.rarity_epic;      break;
            case Rarity.legendary:  colors = absoluteColors.rarity_legendary; break;
            case Rarity.event:      colors = absoluteColors.rarity_event;     break;
        }

        const itemSize = dataManager.items.GetContainerSize(item.Slot);
        const backgroundColor = { backgroundColor: themeManager.GetColor('backgroundCard') };
        const onPress = () => this.openItemPopup(item);
        const disabled = user.inventory.buyToday.items.includes(itemID);

        return (
            <View style={styles.itemParent}>
                <Button style={styles.itemButton} onPress={onPress} enabled={!disabled}>
                    <LinearGradient style={styles.itemBorder} colors={colors}>
                        <View style={[styles.itemContent, backgroundColor]}>

                            <Frame
                                style={styles.itemFrame}
                                characters={[ itemsCharacters[itemID] ]}
                                delayTime={200}
                                loadingTime={200}
                                onlyItems={true}
                                size={itemSize}
                            />

                            <View style={styles.itemPrice}>
                                <Text style={styles.itemPriceOx}>{item.Value}</Text>
                                <Icon icon='ox' color='main1' size={20} />
                            </View>

                        </View>
                    </LinearGradient>
                </Button>
            </View>
        )
    }

    topOverlay() {
        return (
            <>
                <PageHeader style={styles.header} onBackPress={user.interface.BackPage} hideHelp />

                <View style={styles.overlayWallet}>
                    <Text style={styles.overlayOx} color='main1'>{user.informations.ox}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>
            </>
        );
    }

    render() {
        const { titlesAvailable, itemsAvailable } = this.state;
        const lang = langManager.curr['shopItems'];

        // TODO - Texts
        const nullTitles = <Text>{lang['error-no-titles']}</Text>;
        const nullItems = <Text>{lang['error-no-items']}</Text>;

        return (
            <Page
                ref={ref => this.refPage = ref}
                bottomOffset={24}
                topOverlay={<this.topOverlay/>}
                canScrollOver
            >
                <PageHeader style={styles.header} onBackPress={user.interface.BackPage} hideHelp />

                <View style={styles.wallet}>
                    <Text style={styles.ox} color='main1'>{user.informations.ox}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>

                <Container
                    style={styles.container}
                    styleContainer={styles.titlesContainer}
                    text={lang['container-titles']}
                    styleHeader={{ justifyContent: 'center' }}
                >
                    {titlesAvailable === null ? nullTitles : (
                        <FlatList
                            data={titlesAvailable}
                            renderItem={this.renderTitle}
                            keyExtractor={item => item.toString()}
                        />
                    )}
                </Container>

                <Container
                    text={lang['container-items']}
                    style={styles.container}
                    styleHeader={{ justifyContent: 'center' }}
                    styleContainer={styles.itemsContainer}
                >
                    {itemsAvailable === null ? nullItems : (
                        <FlatList
                            data={itemsAvailable}
                            numColumns={4}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.toString()}
                        />
                    )}
                </Container>

                <Container
                    text={lang['container-dyer']}
                    styleHeader={{ justifyContent: 'center' }}
                >
                    <Button
                        onPress={this.openItemEditorPopup}
                    >
                        {lang['select-dyer']}
                    </Button>
                </Container>
            </Page>
        )
    }
}

export default ShopItems;
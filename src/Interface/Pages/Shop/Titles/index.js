import * as React from 'react';
import { View, FlatList } from 'react-native';

import BackShopTitles from './back';
import styles from './styles';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Container, Button, Text, Icon } from 'Interface/Components';

/**
 * @typedef {import('./back').BuyableTitle} BuyableTitle
 */

class ShopTitles extends BackShopTitles {
    /**
     * @param {{ item: BuyableTitle }} item
     * @returns {JSX.Element}
     */
    renderTitle = ({ item: title }) => {
        // Disable button if already bought today
        const disabled = user.inventory.buyToday.titles.includes(title.ID);

        // Line through if already owned
        const owned = user.inventory.titles.includes(title.ID);

        /** @type {import('react-native').TextStyle} */
        const styleLine = { textDecorationLine: owned ? 'line-through' : 'none' };

        return (
            <Button style={styles.titleButton} onPress={title.OnPress} enabled={!disabled}>
                <Text style={styleLine} numberOfLines={1}>{title.Name}</Text>
                <View style={styles.titlePrice}>
                    <Text style={[styles.titlePriceOx, styleLine]}>{title.Price.toString()}</Text>
                    <Icon icon='ox' color='main1' size={24} />
                </View>
            </Button>
        );
    }

    renderEmpty = () => {
        const lang = langManager.curr['shopItems'];

        return (
            <Text style={styles.errorText}>
                {lang['error-no-titles']}
            </Text>
        );
    }

    render() {
        const lang = langManager.curr['shopItems'];
        const { buyableTitles } = this.state;

        return (
            <Container
                style={styles.container}
                styleHeader={styles.containerHeader}
                styleContainer={styles.titlesContainer}
                text={lang['container-titles']}
            >
                <FlatList
                    data={buyableTitles}
                    ListEmptyComponent={this.renderEmpty}
                    renderItem={this.renderTitle}
                    keyExtractor={(item, index) => `buyable-title-${item.ID}-${index}}`}
                />
            </Container>
        );
    }
}

export default ShopTitles;
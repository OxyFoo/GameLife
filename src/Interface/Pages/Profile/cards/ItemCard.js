import * as React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from '../../../../Managers/UserManager';
import dataManager from '../../../../Managers/DataManager';
import themeManager from '../../../../Managers/ThemeManager';

import { Rarity } from '../../../../Data/Items';
import { Character, Frame } from '../../../Components';

/**
 * @typedef {import('../../Class/Inventory').Stuff} Stuff
 */

const ItemCardProps = {
    /** @type {Stuff} */
    stuff: {},

    /** @type {boolean} */
    isSelected: false,

    /** @type {boolean} Show border if item is equipped */
    isEquipped: false,

    /** @param {Stuff?} stuff */
    onPress: (stuff) => {}
}

class ItemCard extends React.PureComponent {
    constructor(props) {
        super(props);

        
        const { stuff } = this.props;
        const item = dataManager.items.GetByID(stuff.ItemID);
        if (item !== null) {
            this.character = new Character(
                'itemcard-' + item.ID,
                user.character.sexe,
                user.character.skin,
                user.character.skinColor
            );
            this.character.SetEquipment([ item.ID ]);
        }
    }

    onPress = () => {
        const { stuff } = this.props;
        this.props.onPress(stuff);
    }

    render() {
        const { stuff, isEquipped, isSelected } = this.props;

        const item = dataManager.items.GetByID(stuff.ItemID);
        if (item === null) return null;

        const background = {
            backgroundColor: themeManager.GetColor(isSelected ? 'main1' : 'backgroundCard')
        };
        let containerSize = dataManager.items.GetContainerSize(item.Slot);

        let borderColor = { borderColor: 'transparent' };
        if (isEquipped) {
            borderColor.borderColor = themeManager.GetColor('main1');
        }

        let colors = [];
        const absoluteColors = themeManager.GetAbsoluteColors();
        switch (item.Rarity) {
            case Rarity.common:     colors = absoluteColors.rarity_common;    break;
            case Rarity.rare:       colors = absoluteColors.rarity_rare;      break;
            case Rarity.epic:       colors = absoluteColors.rarity_epic;      break;
            case Rarity.legendary:  colors = absoluteColors.rarity_legendary; break;
            case Rarity.event:      colors = absoluteColors.rarity_event;     break;
        }

        let onlyItems = true;
        let bodyView = 'full';

        // Only for bald representation...
        if (item.ID === 'hair_01') {
            onlyItems = false;
            bodyView = 'head';
        }

        return (
            <View style={[styles.card, borderColor]}>
                <TouchableHighlight
                    style={[styles.content, background]}
                    onPress={this.onPress}
                    underlayColor={themeManager.GetColor('main1', .5)}
                    touchSoundDisabled={true}
                >
                    <View>
                        <Frame
                            characters={[ this.character ]}
                            onlyItems={onlyItems}
                            bodyView={bodyView}
                            loadingTime={400}
                            size={containerSize}
                        />
                        <LinearGradient
                            style={styles.border}
                            colors={colors}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        />
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

ItemCard.prototype.props = ItemCardProps;
ItemCard.defaultProps = ItemCardProps;

const styles = StyleSheet.create({
    card: {
        width: '30%',
        aspectRatio: 1,
        margin: 6,
        padding: 4,

        borderWidth: 2,
        borderRadius: 8
    },
    content: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden'
    },
    border: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 4
    }
});

export default ItemCard;
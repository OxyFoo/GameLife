import * as React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Character, Frame } from 'Interface/Components';

/**
 * @typedef {import('Class/Inventory').Stuff} Stuff
 * @typedef {import('Interface/Components/Character/Frame').BodyView} BodyView
 */

const ItemCardProps = {
    /** @type {Stuff | null} */
    stuff: null,

    /** @type {boolean} */
    isSelected: false,

    /** @type {boolean} Show border if item is equipped */
    isEquipped: false,

    /** @param {Stuff | null} stuff */
    onPress: (stuff) => {}
};

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

        const colors = themeManager.GetRariryColors(item.Rarity);
        const containerSize = dataManager.items.GetContainerSize(item.Slot);

        const background = {
            backgroundColor: themeManager.GetColor(isSelected ? 'main1' : 'backgroundCard')
        };

        let borderColor = { borderColor: 'transparent' };
        if (isEquipped) {
            borderColor.borderColor = themeManager.GetColor('main1');
        }

        // Only for bald representation...
        let onlyItems = true;
        /** @type {BodyView} */
        let bodyView = 'full';
        if (item.ID === 'hair_01') {
            onlyItems = false;
            bodyView = 'head';
        }

        return (
            <View style={[styles.card, borderColor]}>
                <TouchableHighlight
                    style={[styles.content, background]}
                    onPress={this.onPress}
                    underlayColor={themeManager.GetColor('main1', { opacity: .5 })}
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

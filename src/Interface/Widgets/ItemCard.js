import * as React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import dataManager from '../../Managers/DataManager';
import themeManager from '../../Managers/ThemeManager';

import { Character, Frame } from '../Components';

/**
 * @typedef {import('../../Class/Inventory').Stuff} Stuff
 */

const AvatarCardProps = {
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
            this.character = new Character('itemcard-' + item.ID, 'MALE', 'skin_01', 0);
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

        return (
            <View style={[styles.card, borderColor]}>
                <TouchableHighlight
                    style={[styles.content, background]}
                    onPress={this.onPress}
                    underlayColor={themeManager.GetColor('main1', .5)}
                    touchSoundDisabled={true}
                >
                    <Frame characters={[ this.character ]} onlyItems={true} loadingTime={400} size={containerSize} />
                </TouchableHighlight>
            </View>
        );
    }
}

ItemCard.prototype.props = AvatarCardProps;
ItemCard.defaultProps = AvatarCardProps;

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
    }
});

export default ItemCard;
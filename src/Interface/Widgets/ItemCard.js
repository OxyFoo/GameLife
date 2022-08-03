import * as React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import user from '../../Managers/UserManager';
import themeManager from '../../Managers/ThemeManager';
import dataManager from '../../Managers/DataManager';

import { STUFFS } from '../../../res/items/stuffs/Stuffs';
import { Character, Frame } from '../Components';

/**
 * @typedef {import('../../Class/Inventory').Item} Item
 */

const AvatarCardProps = {
    /** @type {Item} */
    item: {},

    /** @type {String?} - ID of card (used to check selected card) */
    selectedId: -1,

    /** @param {String?} ID */
    onPress: (ID) => {}
}

class ItemCard extends React.PureComponent {
    constructor(props) {
        super(props);

        const { item } = this.props;
        this.character = new Character('itemcard-' + item.ID, 'MALE', 'skin_01', 0);
        this.character.SetEquipment([ item.ID ]);
    }

    onPress = () => {
        this.props.onPress(this.props.item.ID);
    }

    render() {
        const { item } = this.props;
        const isSelected = item.ID === this.props.selectedId;
        const background = {
            backgroundColor: themeManager.GetColor(isSelected ? 'main1' : 'backgroundCard')
        };

        return (
            <TouchableHighlight
                style={[styles.card, background]}
                onPress={this.onPress}
                underlayColor={themeManager.GetColor('main1', .5)}
                touchSoundDisabled={true}
            >
                <Frame characters={[ this.character ]} onlyItems={true} loadingTime={400} />
            </TouchableHighlight>
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
        borderRadius: 8,

        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    }
});

export default ItemCard;
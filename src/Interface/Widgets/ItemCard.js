import * as React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import { Character, Frame, FrameContent } from '../Components';

// TODO - Define item (item in user inventory)

const AvatarCardProps = {
    item: {},

    /** @type {Number} - ID of card (used to check selected card) */
    selectedId: -1,

    /** @param {Number} ID */
    onPress: (ID) => {}
}

class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.character = new Character('itemcard-' + this.props.selectedId, 'male_test');
        this.frameContent = new FrameContent();
        this.frameContent.AddCharacter(this.character);
    }

    onPress = () => {
        this.props.onPress(this.props.item.id);
    }

    render() {
        const { item } = this.props;
        const isSelected = item.id === this.props.selectedId;
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
                <Frame content={this.frameContent} />
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
        justifyContent: 'center'
    }
});

export default ItemCard;
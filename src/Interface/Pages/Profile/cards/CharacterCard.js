import * as React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { Character, Frame } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').CharactersID} CharactersID
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 */

const CharacterCardProps = {
    /** @type {CharactersID} */
    characterName: 'human_00',

    /** @type {number} */
    characterSkinColor: 0,

    /** @type {boolean} */
    isSelected: false,

    /** @type {(skin: string) => void} */
    onPress: () => {}
};

class CharacterCard extends React.PureComponent {
    /** @param {CharacterCardProps} props */
    constructor(props) {
        super(props);

        const { characterName, characterSkinColor } = this.props;
        if (characterName) {
            this.character = new Character('itemcard-' + characterName, characterName, characterSkinColor);
        }
    }

    onPress = () => {
        const { characterName } = this.props;
        this.props.onPress(characterName);
    };

    render() {
        const { isSelected } = this.props;

        const background = {
            backgroundColor: themeManager.GetColor(isSelected ? 'main1' : 'backgroundCard')
        };

        return (
            <View style={styles.card}>
                <TouchableHighlight
                    style={[styles.content, background]}
                    onPress={this.onPress}
                    underlayColor={themeManager.GetColor('main1', { opacity: 0.5 })}
                    touchSoundDisabled={true}
                >
                    <Frame characters={[this.character]} onlyItems={false} loadingTime={800} />
                </TouchableHighlight>
            </View>
        );
    }
}

CharacterCard.prototype.props = CharacterCardProps;
CharacterCard.defaultProps = CharacterCardProps;

const styles = StyleSheet.create({
    card: {
        width: '30%',
        aspectRatio: 1,
        margin: 6
    },
    content: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden'
    }
});

export default CharacterCard;

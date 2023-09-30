import * as React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

import { Character, Frame } from 'Interface/Components';

/**
 * @typedef {import('Class/Inventory').Sexes} Sexes
 * @typedef {import('Class/Inventory').Stuff} Stuff
 */

const CharacterCardProps = {
    /** @type {Sexes} */
    characterSexe: 'MALE',

    /** @type {string} */
    characterName: '',

    /** @type {number} */
    characterSkinColor: 0,

    /** @type {boolean} */
    isSelected: false,

    /**
     * @param {Sexes} sexe
     * @param {string} skin
     */
    onPress: (sexe, skin) => {}
}

class CharacterCard extends React.PureComponent {
    constructor(props) {
        super(props);

        
        const { characterSexe, characterName, characterSkinColor } = this.props;
        if (characterSexe && characterName) {
            this.character = new Character(
                'itemcard-' + characterName,
                characterSexe,
                characterName,
                characterSkinColor
            );
        }
    }

    onPress = () => {
        const { characterSexe, characterName } = this.props;
        this.props.onPress(characterSexe, characterName);
    }

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
                    underlayColor={themeManager.GetColor('main1', .5)}
                    touchSoundDisabled={true}
                >
                    <Frame
                        characters={[ this.character ]}
                        onlyItems={false}
                        loadingTime={800}
                    />
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
        margin: 6,
    },
    content: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden'
    }
});

export default CharacterCard;
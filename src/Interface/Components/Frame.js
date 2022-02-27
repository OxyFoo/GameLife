import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';

/**
 * @typedef {import('./Character').default} Character
 */

const FrameProps = {
    width: 1000,
    height: 1000,

    /** @type {FrameContent?} */
    content: null
}

class FrameContent {
    constructor() {
        /** @type {Array<Character>} */
        this.characters = [];
    }

    /**
     * @param {Character} character 
     */
    AddCharacter(character) {
        this.characters.push(character);
    }
    /**
     * @param {string} characterName
     * @returns {Character?}
    */
    GetCharacterByName(characterName) {
        return this.characters.find(character => character.name === characterName) || null;
    }
    /**
     * @param {String} characterName
     * @returns {Boolean} True if the character was found and removed
     */
    RemoveCharacterByName(characterName) {
        const character = this.GetCharacterByName(characterName);
        if (character !== null) {
            character.unmount();
            this.characters.splice(this.characters.indexOf(character), 1);
            return true;
        }
        return false;
    }
    RemoveAll() {
        this.characters.forEach(character => character.unmount());
        this.characters = [];
    }
    RenderAll() {
        return this.characters.map(character => character.render());
    }
}

class Frame extends React.Component {
    componentDidUpdate() {
        if (this.props.content !== null) {
            this.props.content.characters.forEach(character => character.SetFrame(this));
        }
    }
    componentWillUnmount() {
        this.props.content.RemoveAll();
    }
    render() {
        const { width, height } = this.props;
        const viewBox = [ 0, 0, width, height ].join(' ');
        const characters = this.props.content.RenderAll();

        return (
            <View style={styles.canvas}>
                <Svg viewBox={viewBox}>
                    {characters}
                </Svg>
            </View>
        );
    }
}

Frame.prototype.props = FrameProps;
Frame.defaultProps = FrameProps;

const styles = StyleSheet.create({
    canvas: {
        width: '100%',
        height: '100%'
    },
    part: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
});

export { FrameContent };
export default Frame;
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';

import themeManager from '../../../Managers/ThemeManager';

import Icon from '../Icon';

/**
 * @typedef {import('./Character').default} Character
 */

const FrameProps = {
    width: 1000,
    height: 1000,

    /** @type {Array<Character>} */
    characters: []
}

class Frame extends React.Component {
    state = {
        mounted: false
    }

    componentDidMount() {
        this.updateCharacters(this.props.characters);

        // Loading page
        setTimeout(() => { this.setState({ mounted: true }) }, 1400);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.mounted !== this.state.mounted) {
            return true;
        }

        if (nextProps.characters.length !== this.props.characters.length) {
            this.updateCharacters(nextProps.characters);
            return true;
        }

        return false;
    }
    componentWillUnmount() {
        const { characters } = this.props;
        characters.forEach(character => character.unmount());
    }

    /** @param {Array<Character>} characters */
    updateCharacters(characters) {
        characters.forEach(character => character.parentFrame === null && character.SetFrame(this));
    }

    render() {
        const { width, height, characters } = this.props;
        const viewBox = [ 0, 0, width, height ].join(' ');
        const loadingColor = { backgroundColor: themeManager.GetColor('backgroundCard') };

        return (
            <View style={styles.canvas}>
                <Svg viewBox={viewBox}>
                    {characters.map(charac => charac.render())}
                </Svg>
                {!this.state.mounted && (
                    <View style={[styles.loading, loadingColor]}>
                        <Icon icon='loadingDots' />
                    </View>
                )}
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
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    part: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
});

export default Frame;
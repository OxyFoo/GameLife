import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';

import themeManager from '../../../Managers/ThemeManager';
import { Sleep } from '../../../Utils/Functions';

import Icon from '../Icon';

/**
 * @typedef {import('./Character').default} Character
 */

const FrameProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    size: {
        x: 0,
        y: 0,
        width: 1000,
        height: 1000
    },

    /** @type {Array<Character>} */
    characters: [],

    /** @type {Boolean} */
    onlyItems: false,

    /** @type {number} Time to wait before loading in ms */
    delayTime: 0,

    /** @type {number} Time to wait for loading in ms - TODO - Automatic end after loading */
    loadingTime: 1400
}

class Frame extends React.Component {
    _mounted = true;
    state = {
        loaded: false
    }

    componentDidMount() {
        setTimeout(this.startLoading.bind(this), this.props.delayTime);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.loaded !== this.state.loaded) {
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
        this._mounted = false;
    }

    async startLoading() {
        if (!this._mounted) return;
        this.updateCharacters(this.props.characters);

        await Sleep(this.props.loadingTime);
        if (!this._mounted) return;
        this.setState({ loaded: true });
    }

    /** @param {Array<Character>} characters */
    updateCharacters(characters) {
        characters.forEach(character => character.parentFrame === null && character.SetFrame(this));
    }

    render() {
        const { style, size, characters, onlyItems } = this.props;
        const viewBox = [ size.x, size.y, size.width, size.height ].join(' ');
        const loadingColor = { backgroundColor: themeManager.GetColor('backgroundCard') };

        return (
            <View style={[styles.canvas, style]}>
                <Svg viewBox={viewBox}>
                    {characters.map(charac => charac.render(onlyItems))}
                </Svg>
                {!this.state.loaded && (
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
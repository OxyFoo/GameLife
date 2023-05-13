import * as React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';

import themeManager from '../../../../Managers/ThemeManager';

const ColorCardProps = {
    /** @type {string} */
    characterSkinColor: '',

    /** @param {string} color */
    onPress: (color) => {}
}

class ColorCard extends React.PureComponent {
    onPress = () => {
        const { characterSkinColor } = this.props;
        this.props.onPress(characterSkinColor);
    }

    render() {
        const { characterSkinColor } = this.props;
        const background = { backgroundColor: characterSkinColor };

        return (
            <View style={styles.card}>
                <TouchableHighlight
                    style={[styles.content, background]}
                    onPress={this.onPress}
                    underlayColor={themeManager.GetColor('main1', .5)}
                    touchSoundDisabled={true}
                >
                    <></>
                </TouchableHighlight>
            </View>
        );
    }
}

ColorCard.prototype.props = ColorCardProps;
ColorCard.defaultProps = ColorCardProps;

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

export default ColorCard;
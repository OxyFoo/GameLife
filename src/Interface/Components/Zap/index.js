import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import InputBack from './back';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

class Zap extends InputBack {
    render() {
        const { position, layout, orientation } = this.state;
        const posX = Animated.subtract(position.x, layout.width / 2);
        const posY = Animated.subtract(position.y, layout.height / 2);

        const transformZap = {
            transform: [
                { translateX: posX },
                { translateY: posY },
                { scaleX: orientation === 'left' ? -1 : 1 },
            ]
        };

        return (
            <Animated.Image
                style={[styles.zap, transformZap]}
                onLayout={this.onZapLayout}
                source={this.getZapImage()}
            />
        );
    }
}

const styles = StyleSheet.create({
    zap: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 96,
        height: 96,
        resizeMode: 'contain'
    }
});

export default Zap;
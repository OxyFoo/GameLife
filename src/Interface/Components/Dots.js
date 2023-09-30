import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const DotsProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} Number of pages (dots displayed in component) */
    pagesLength: 1,

    /** @type {Animated.Value} Current page (dot displayed as active) */
    position: new Animated.Value(0),

    /** @type {ColorTheme|ColorThemeText} */
    colorDots: 'white',

    /** @type {ColorTheme|ColorThemeText} */
    colorActiveDot: 'main1'
}

class Dots extends React.Component {
    MainDot = () => {
        const { pagesLength, position, colorActiveDot } = this.props;

        // inputRange: [0, 0.5, 1, 1.5, 2], outputRange: [0, 0, 1, 1, 2]
        let inputRange = [...Array(1 + 2*pagesLength).keys()].map((v, i) => v/2);
        let outputRange = inputRange.map((v, i) => Math.floor(v));
        const interLeft = { inputRange: inputRange, outputRange: outputRange };

        //inputRange = [0, .5, 1, 1.5, 2], outputRange = [8, 24, 8, 24, 8]
        outputRange = [...inputRange].map((_, i) => (_ % 1 == 0) ? 8 : 24);
        const interWidth = { inputRange: inputRange, outputRange: outputRange };

        const left = { left: Animated.multiply(position.interpolate(interLeft), 16) };
        const width = { width: position.interpolate(interWidth) };
        const bg = { backgroundColor: themeManager.GetColor(colorActiveDot) };
        return <Animated.View style={[styles.dot, styles.mainDot, left, width, bg]} />;
    }
    Dot = (_, index) => {
        const { colorDots } = this.props;
        const bg = { backgroundColor: themeManager.GetColor(colorDots) };
        return <View key={'dot-'+index} style={[styles.dot, bg]} />;
    }

    render() {
        return (
            <View style={[styles.parent, this.props.style]} pointerEvents='none'>
                <View style={styles.dotsContainer}>
                    {new Array(this.props.pagesLength).fill(0).map(this.Dot)}
                    <this.MainDot />
                </View>
            </View>
        );
    }
}

Dots.prototype.props = DotsProps;
Dots.defaultProps = DotsProps;

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        alignItems: 'center'
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        marginHorizontal: 4,
        borderRadius: 12
    },
    mainDot: {
        position: 'absolute',
        top: 0,
        left: 0
    }
});

export default Dots;
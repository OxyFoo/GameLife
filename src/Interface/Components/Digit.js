import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { Text } from 'Interface/Components';
import { Range } from 'Utils/Functions';
import { TimingAnimation, SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const DigitProps = {
    /** @type {string} - The text to get in callback */
    name: 'index',

    /** @type {ColorTheme|ColorThemeText} */
    color: 'primary',

    /** @type {boolean} If true, value can't be changed */
    lock: false,

    /** @type {number} */
    initValue: 0,

    /** @type {number} */
    maxValue: 6,

    /** @type {Function} */
    callback: (name, index) => {}
}


class Digit extends React.Component {
    state = {
        digitWidth: 0,
        animLeft: new Animated.Value(0)
    }

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        const margins = 8;
        const digitWidth = width + margins;

        // Init
        if (this.state.digitWidth === 0 && width > 0) {
            const initValue = Math.min(this.props.initValue, this.props.maxValue);
            this.SetDigitsPosX(initValue * digitWidth);
        }

        this.setState({ digitWidth: digitWidth });
    }

    SetDigitsPosX = (x) => {
        this.digitX = x; // PositionX of digits container (same as this.state.animLeft)
        SpringAnimation(this.state.animLeft, x).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        this.firstX = event.nativeEvent.pageX;
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const posX = event.nativeEvent.pageX;
        const delta = (this.firstX - posX) / 2;
        this.newPosX = this.digitX + delta;
        TimingAnimation(this.state.animLeft, this.newPosX, 0.1).start();
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (this.props.lock) {
            this.SetDigitsPosX(this.digitX);
            return;
        }

        const { digitWidth } = this.state;
        const { name, maxValue, callback } = this.props;

        let min_index = -1;
        let min_delta = -1;
        for (let i = 0; i <= maxValue; i++) {
            const delta = Math.abs(this.newPosX - i * digitWidth);
            if (min_delta == -1 || delta < min_delta) {
                min_index = i;
                min_delta = delta;
            }
        }
        this.SetDigitsPosX(min_index * digitWidth);

        callback(name, min_index);
    }

    renderDigits = () => {
        const { color, maxValue } = this.props;
        const digit = (i) => (
            <Text
                key={'text-' + i}
                style={styles.textButton}
                color={color}
                onLayout={i === 0 ? this.onLayout : undefined}
            >
                {i}
            </Text>
        );
        return Range(maxValue+1).map(digit);
    }

    render() {
        const { containerStyle } = this.props;

        const style = [ styles.containerStyle, containerStyle ];
        const translateX = { transform: [{ translateX: Animated.subtract(0, this.state.animLeft) }] };

        return (
            <View
                style={style}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                <Animated.View style={[styles.content, translateX]}>
                    <this.renderDigits />
                </Animated.View>
            </View>
        );
    }
}

Digit.prototype.props = DigitProps;
Digit.defaultProps = DigitProps;

const styles = StyleSheet.create({
    containerStyle: {
        width: 40,
        height: 32,
        paddingLeft: 8,
        justifyContent: 'center',

        borderColor: '#FFFFFF',
        borderWidth: 2,
        overflow: 'hidden'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textButton: {
        marginHorizontal: 4,
        fontSize: 22
    }
});

export default Digit;
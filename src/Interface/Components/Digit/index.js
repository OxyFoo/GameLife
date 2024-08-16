import * as React from 'react';
import { View, Animated, PanResponder } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import DigitBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components/Text';
import { Range } from 'Utils/Functions';

class Digit extends DigitBack {
    panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true
    });

    render() {
        const { style } = this.props;
        const { animLeft, containerWidth, digitWidth } = this.state;

        const translateX = {
            transform: [{ translateX: Animated.subtract(0, animLeft) }]
        };

        const fadeColor = themeManager.GetColor(this.props.fadeColor);
        const gradientColor = [fadeColor, 'transparent', 'transparent', fadeColor];

        return (
            <View
                style={[
                    styles.containerStyle,
                    style,
                    {
                        paddingLeft: (containerWidth - digitWidth - 4) / 2
                    }
                ]}
                onLayout={this.onLayout}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
                onTouchCancel={this.onTouchEnd}
                {...this.panResponder.panHandlers}
            >
                <Animated.View style={[styles.content, translateX]}>
                    <this.renderDigits />
                </Animated.View>
                <LinearGradient
                    style={styles.gradient}
                    colors={gradientColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            </View>
        );
    }

    renderDigits = () => {
        const { minValue, maxValue, stepValue } = this.props;

        return Range(maxValue + stepValue, stepValue).map((i) =>
            i >= minValue ? this.renderDigit(i) : this.renderDigitEmpty(i)
        );
    };

    /** @param {number} i */
    renderDigit = (i) => {
        const { color, fontSize, minDigitWidth } = this.props;
        const { digitWidth } = this.state;

        return (
            <Text
                key={`digit-text-${i}`}
                style={[
                    styles.digit,
                    {
                        minWidth: Math.max(digitWidth, minDigitWidth),
                        fontSize: fontSize
                    }
                ]}
                color={color}
                onLayout={this.onLayoutDigit}
            >
                {i.toString()}
            </Text>
        );
    };

    /** @param {number} i */
    renderDigitEmpty = (i) => {
        const { digitWidth } = this.state;

        return (
            <Text key={`digit-text-${i}`} style={[styles.digit, { minWidth: digitWidth }]} color='transparent'>
                {i.toString()}
            </Text>
        );
    };
}

export { Digit };

import * as React from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import DigitBack from './back';
import themeManager from 'Managers/ThemeManager';

import { Text } from 'Interface/Components';
import { Range } from 'Utils/Functions';

class Digit extends DigitBack {
    renderDigit = (i) => {
        const { name, color } = this.props;
        return (
            <Text
                key={name + '-text-' + i}
                style={[
                    styles.digit,
                    {
                        minWidth: this.state.digitWidth - 4
                    }
                ]}
                color={color}
                onLayout={this.onLayout}
            >
                {i}
            </Text>
        );
    };

    renderDigitEmpty = (i) => {
        const { name } = this.props;
        const { digitWidth } = this.state;
        return (
            <View
                key={name + '-text-' + i}
                style={{ minWidth: digitWidth }}
            />
        );
    }

    renderDigits = () => {
        const { minValue, maxValue, stepValue } = this.props;

        return Range(maxValue + stepValue, stepValue)
                .map((i) => i >= minValue ?
                    this.renderDigit(i) :
                    this.renderDigitEmpty(i)
                );
    }

    render() {
        const { containerStyle } = this.props;

        const style = [
            styles.containerStyle,
            containerStyle,
            {
                width: this.props.containerWidth,
                paddingLeft: this.state.paddingLeft
            }
        ];
        const translateX = {
            transform: [
                { translateX: Animated.subtract(0, this.state.animLeft) }
            ]
        };

        const fadeColor = themeManager.GetColor(this.props.fadeColor);
        const gradientColor = [ fadeColor, '#FFFFFF00', fadeColor ];

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
                <LinearGradient
                    style={styles.gradient}
                    colors={gradientColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                />
            </View>
        );
    }
}

export default Digit;
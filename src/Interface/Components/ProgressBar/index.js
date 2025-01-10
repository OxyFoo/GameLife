import * as React from 'react';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import styles from './style';
import ProgressBarBack from './back';
import { ProgressBarInfinite } from './infinite';
import themeManager from 'Managers/ThemeManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

class ProgressBar extends ProgressBarBack {
    static Infinite = ProgressBarInfinite;

    render() {
        const { style, height } = this.props;
        const { width, animation, animCover } = this.state;

        const leftOffset = Animated.multiply(animation, width);
        const suppOffset = Animated.multiply(animCover, width);

        /** @type {StyleProp} */
        const animSupStyle = {
            transform: [{ translateX: Animated.add(leftOffset, suppOffset) }]
        };

        return (
            <View style={[styles.body, { height }, style]} onLayout={this.onLayout}>
                <Animated.View style={[styles.supXP, animSupStyle]} />
                <MaskedView maskElement={this.renderMask()}>{this.renderBackground()}</MaskedView>
            </View>
        );
    }

    renderMask = () => {
        const { width, animation } = this.state;
        const leftOffset = Animated.multiply(animation, width);

        return (
            <Animated.View
                style={[
                    styles.mask,
                    {
                        transform: [{ translateX: leftOffset }]
                    }
                ]}
            />
        );
    };

    renderBackground = () => {
        const { color } = this.props;

        if (color !== 'gradient') {
            const backgroundColor = themeManager.GetColor(color);
            return <View style={[styles.bar, { backgroundColor }]} />;
        }

        return (
            <LinearGradient
                style={styles.bar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[
                    themeManager.GetColor('main2'),
                    themeManager.GetColor('main1'),
                    themeManager.GetColor('main3')
                ]}
            />
        );
    };
}

export { ProgressBar };
